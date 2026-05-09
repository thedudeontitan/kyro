use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(borrower_key: Pubkey)]
pub struct Liquidate<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        seeds = [CREDIT_MANAGER_SEED],
        bump = credit_manager.bump,
        constraint = credit_manager.admin == admin.key() @ KyroError::NotAuthorized,
    )]
    pub credit_manager: Box<Account<'info, CreditManagerState>>,

    #[account(
        mut,
        seeds = [LENDING_POOL_SEED],
        bump = lending_pool.bump,
    )]
    pub lending_pool: Box<Account<'info, LendingPoolState>>,

    #[account(
        mut,
        seeds = [CREDIT_LINE_SEED, borrower_key.as_ref()],
        bump = credit_line.bump,
        constraint = credit_line.borrower == borrower_key @ KyroError::NotAuthorized,
        constraint = credit_line.is_active @ KyroError::CreditLineNotActive,
    )]
    pub credit_line: Box<Account<'info, CreditLine>>,

    #[account(
        mut,
        seeds = [COLLATERAL_INFO_SEED, borrower_key.as_ref()],
        bump = collateral_info.bump,
        constraint = collateral_info.borrower == borrower_key @ KyroError::NotAuthorized,
    )]
    pub collateral_info: Box<Account<'info, CollateralInfo>>,

    #[account(
        mut,
        seeds = [REPUTATION_MANAGER_SEED],
        bump = reputation_manager.bump,
    )]
    pub reputation_manager: Box<Account<'info, ReputationManagerState>>,

    /// Per-user reputation data. init_if_needed since liquidation may be first reputation interaction.
    #[account(
        init_if_needed,
        payer = admin,
        space = 8 + ReputationData::INIT_SPACE,
        seeds = [REPUTATION_SEED, borrower_key.as_ref()],
        bump,
    )]
    pub reputation_data: Box<Account<'info, ReputationData>>,

    #[account(
        constraint = usdc_mint.key() == credit_manager.usdc_mint @ KyroError::InvalidAddress,
    )]
    pub usdc_mint: Account<'info, Mint>,

    /// Collateral vault (collateral stays in vault — no transfer on liquidation)
    #[account(
        mut,
        seeds = [COLLATERAL_VAULT_SEED],
        bump,
        token::mint = usdc_mint,
    )]
    pub collateral_vault: Account<'info, TokenAccount>,

    /// Pool vault (seized collateral gets transferred here to cover bad debt)
    #[account(
        mut,
        seeds = [POOL_VAULT_SEED],
        bump,
        token::mint = usdc_mint,
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Liquidate>, borrower_key: Pubkey) -> Result<()> {
    let clock = Clock::get()?;
    let credit_manager = &ctx.accounts.credit_manager;
    let credit_line = &mut ctx.accounts.credit_line;
    let collateral_info = &mut ctx.accounts.collateral_info;

    // Update interest before liquidation
    update_interest(credit_manager, credit_line, clock.unix_timestamp);

    // Read accumulator before mutable borrow of pool
    let accumulated = ctx.accounts.lending_pool.accumulated_interest_per_share;
    let pool_bump = ctx.accounts.lending_pool.bump;

    // Settle collateral interest
    settle_collateral_interest(accumulated, collateral_info);

    let total_collateral = collateral_info
        .deposited_amount
        .checked_add(collateral_info.earned_interest)
        .ok_or(KyroError::MathOverflow)?;

    // Check liquidation conditions
    let is_over_ltv = is_over_ltv_check(credit_line, total_collateral);
    let is_overdue = credit_line.borrowed_amount > 0
        && clock.unix_timestamp > credit_line.repayment_due_date;

    require!(
        is_over_ltv || is_overdue,
        KyroError::LiquidationNotAllowed
    );

    // Calculate total debt (overflow-safe, cap at u64::MAX)
    let total_debt_u128 =
        (credit_line.borrowed_amount as u128) + (credit_line.interest_accrued as u128);
    let total_debt = total_debt_u128.min(u64::MAX as u128) as u64;

    let collateral_to_liquidate = total_debt.min(total_collateral);

    // Seize collateral: deduct principal first, then interest
    let principal_seized = collateral_to_liquidate.min(collateral_info.deposited_amount);
    let interest_seized = collateral_to_liquidate.saturating_sub(principal_seized);

    collateral_info.deposited_amount -= principal_seized;
    collateral_info.earned_interest = collateral_info
        .earned_interest
        .saturating_sub(interest_seized);

    // Recalculate reward_debt
    collateral_info.reward_debt = (collateral_info.deposited_amount as u128)
        .saturating_mul(accumulated)
        / PRECISION;

    // Transfer seized collateral from collateral_vault to pool_vault
    // This makes the seized funds available as liquidity to cover bad debt
    if principal_seized > 0 {
        let seeds = &[LENDING_POOL_SEED, &[pool_bump]];
        let signer_seeds = &[&seeds[..]];

        anchor_spl::token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.collateral_vault.to_account_info(),
                    to: ctx.accounts.pool_vault.to_account_info(),
                    authority: ctx.accounts.lending_pool.to_account_info(),
                },
                signer_seeds,
            ),
            principal_seized,
        )?;
    }

    // Now take mutable borrow of pool for accounting updates
    let pool = &mut ctx.accounts.lending_pool;

    // Update pool totals
    pool.total_collateral = pool.total_collateral.saturating_sub(principal_seized);

    // Write off bad debt (only principal, not interest — interest was never in total_borrowed)
    let principal_to_write_off = credit_line.borrowed_amount;
    pool.total_repaid = pool
        .total_repaid
        .checked_add(principal_to_write_off)
        .ok_or(KyroError::MathOverflow)?;

    // Clear the credit line debt
    credit_line.borrowed_amount = 0;
    credit_line.interest_accrued = 0;
    credit_line.initial_collateral = 0;

    // Check if any collateral remains
    let remaining = collateral_info
        .deposited_amount
        .checked_add(collateral_info.earned_interest)
        .ok_or(KyroError::MathOverflow)?;

    if remaining == 0 {
        credit_line.is_active = false;
    }

    // Update reputation (record default)
    let rep_manager = &ctx.accounts.reputation_manager;
    let rep_data = &mut ctx.accounts.reputation_data;

    if !rep_data.is_initialized {
        rep_data.user = borrower_key;
        rep_data.score = DEFAULT_REPUTATION_SCORE;
        rep_data.last_updated = clock.unix_timestamp;
        rep_data.total_repayments = 0;
        rep_data.on_time_repayments = 0;
        rep_data.late_repayments = 0;
        rep_data.defaults = 0;
        rep_data.tier = calculate_tier(DEFAULT_REPUTATION_SCORE);
        rep_data.is_initialized = true;
        rep_data.bump = ctx.bumps.reputation_data;

        emit!(UserInitializedEvent {
            user: borrower_key,
            initial_score: DEFAULT_REPUTATION_SCORE,
            initial_tier: rep_data.tier,
            timestamp: clock.unix_timestamp,
        });
    }

    rep_data.defaults += 1;

    // Double penalty for large debts (>10K USDC)
    let penalty = if total_debt > LARGE_DEBT_THRESHOLD {
        rep_manager.default_penalty.saturating_mul(2)
    } else {
        rep_manager.default_penalty
    };

    let old_score = rep_data.score;
    let old_tier = rep_data.tier;
    let actual_change = penalty.min(rep_manager.max_score_change);

    rep_data.score = rep_data.score.saturating_sub(actual_change);
    rep_data.last_updated = clock.unix_timestamp;
    rep_data.tier = calculate_tier(rep_data.score);

    emit!(ScoreUpdatedEvent {
        user: borrower_key,
        old_score,
        new_score: rep_data.score,
        is_increase: false,
        reason: "Loan default/liquidation".to_string(),
        timestamp: clock.unix_timestamp,
    });

    if old_tier != rep_data.tier {
        emit!(TierChangedEvent {
            user: borrower_key,
            old_tier,
            new_tier: rep_data.tier,
            timestamp: clock.unix_timestamp,
        });
    }

    emit!(DefaultRecordedEvent {
        user: borrower_key,
        debt_amount: total_debt,
        penalty_applied: penalty,
        timestamp: clock.unix_timestamp,
    });

    let reason = if is_over_ltv {
        "Over LTV".to_string()
    } else {
        "Overdue".to_string()
    };

    emit!(LiquidatedEvent {
        borrower: borrower_key,
        collateral_liquidated: collateral_to_liquidate,
        debt_cleared: total_debt,
        reason,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

fn update_interest(
    credit_manager: &CreditManagerState,
    credit_line: &mut CreditLine,
    current_time: i64,
) {
    if credit_line.borrowed_amount == 0 || credit_line.last_borrowed_timestamp == 0 {
        return;
    }

    let time_elapsed = (current_time - credit_line.last_interest_update) as u128;
    let annual_rate = credit_manager.fixed_interest_rate as u128;
    let borrowed = credit_line.borrowed_amount as u128;
    let basis = BASIS_POINTS as u128;
    let seconds_year = SECONDS_PER_YEAR as u128;

    let new_interest = borrowed
        .saturating_mul(annual_rate)
        .saturating_mul(time_elapsed)
        / basis.saturating_mul(seconds_year);

    let new_accrued = (credit_line.interest_accrued as u128) + new_interest;
    credit_line.interest_accrued = new_accrued.min(u64::MAX as u128) as u64;
    credit_line.last_interest_update = current_time;
}

fn settle_collateral_interest(accumulated: u128, collateral_info: &mut CollateralInfo) {
    if collateral_info.deposited_amount > 0 {
        let current_accumulated = (collateral_info.deposited_amount as u128)
            .saturating_mul(accumulated)
            / PRECISION;
        if current_accumulated > collateral_info.reward_debt {
            let pending = current_accumulated - collateral_info.reward_debt;
            collateral_info.earned_interest = collateral_info
                .earned_interest
                .saturating_add(pending as u64);
        }
    }
    collateral_info.reward_debt = (collateral_info.deposited_amount as u128)
        .saturating_mul(accumulated)
        / PRECISION;
}

fn is_over_ltv_check(credit_line: &CreditLine, collateral_value: u64) -> bool {
    if collateral_value == 0 {
        return true;
    }

    let total_debt =
        (credit_line.borrowed_amount as u128) + (credit_line.interest_accrued as u128);
    let current_ltv = total_debt
        .saturating_mul(BASIS_POINTS as u128)
        / (collateral_value as u128);

    current_ltv > LIQUIDATION_THRESHOLD_BPS as u128
}

fn calculate_tier(score: u64) -> u8 {
    if score >= PLATINUM_THRESHOLD {
        REPUTATION_TIER_PLATINUM
    } else if score >= GOLD_THRESHOLD {
        REPUTATION_TIER_GOLD
    } else if score >= SILVER_THRESHOLD {
        REPUTATION_TIER_SILVER
    } else {
        REPUTATION_TIER_BRONZE
    }
}
