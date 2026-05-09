use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
pub struct Repay<'info> {
    #[account(mut)]
    pub borrower: Signer<'info>,

    #[account(
        mut,
        seeds = [CREDIT_MANAGER_SEED],
        bump = credit_manager.bump,
        constraint = !credit_manager.is_paused @ KyroError::Paused,
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
        seeds = [CREDIT_LINE_SEED, borrower.key().as_ref()],
        bump = credit_line.bump,
        constraint = credit_line.borrower == borrower.key() @ KyroError::NotAuthorized,
        constraint = credit_line.is_active @ KyroError::CreditLineNotActive,
    )]
    pub credit_line: Box<Account<'info, CreditLine>>,

    #[account(
        mut,
        seeds = [REPUTATION_MANAGER_SEED],
        bump = reputation_manager.bump,
    )]
    pub reputation_manager: Box<Account<'info, ReputationManagerState>>,

    /// Per-user reputation data. init_if_needed since first repay may be first reputation interaction.
    #[account(
        init_if_needed,
        payer = borrower,
        space = 8 + ReputationData::INIT_SPACE,
        seeds = [REPUTATION_SEED, borrower.key().as_ref()],
        bump,
    )]
    pub reputation_data: Box<Account<'info, ReputationData>>,

    #[account(
        constraint = usdc_mint.key() == credit_manager.usdc_mint @ KyroError::InvalidAddress,
    )]
    pub usdc_mint: Account<'info, Mint>,

    /// Borrower's USDC token account
    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = borrower,
    )]
    pub borrower_token_account: Account<'info, TokenAccount>,

    /// Pool vault (receives repayment)
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

pub fn handler(ctx: Context<Repay>, principal_amount: u64, interest_amount: u64) -> Result<()> {
    require!(
        principal_amount > 0 || interest_amount > 0,
        KyroError::InvalidAmount
    );

    let clock = Clock::get()?;
    let credit_manager = &ctx.accounts.credit_manager;
    let pool = &mut ctx.accounts.lending_pool;
    let credit_line = &mut ctx.accounts.credit_line;

    // Update interest before repayment
    update_interest(credit_manager, credit_line, clock.unix_timestamp);

    require!(credit_line.borrowed_amount > 0, KyroError::NoActiveDebt);
    require!(
        principal_amount <= credit_line.borrowed_amount,
        KyroError::ExceedsBorrowedAmount
    );
    require!(
        interest_amount <= credit_line.interest_accrued,
        KyroError::ExceedsInterest
    );

    let total_payment = principal_amount
        .checked_add(interest_amount)
        .ok_or(KyroError::MathOverflow)?;

    // Check if payment is on time
    let is_on_time = clock.unix_timestamp <= credit_line.repayment_due_date;

    // Update credit line state
    credit_line.borrowed_amount -= principal_amount;
    credit_line.interest_accrued -= interest_amount;
    credit_line.total_repaid = credit_line
        .total_repaid
        .checked_add(total_payment)
        .ok_or(KyroError::MathOverflow)?;

    if is_on_time {
        credit_line.on_time_repayments += 1;
    } else {
        credit_line.late_repayments += 1;
    }

    let remaining_balance = credit_line.borrowed_amount;

    // Calculate protocol fee from interest (10% of interest repaid)
    let protocol_fee = (interest_amount as u128)
        .checked_mul(PROTOCOL_FEE_RATE_BPS as u128)
        .ok_or(KyroError::MathOverflow)?
        / (BASIS_POINTS as u128);
    let protocol_fee = protocol_fee as u64;
    let distributable_interest = interest_amount.saturating_sub(protocol_fee);

    // Update pool accounting
    pool.total_repaid = pool
        .total_repaid
        .checked_add(principal_amount)
        .ok_or(KyroError::MathOverflow)?;
    pool.protocol_fees_collected = pool
        .protocol_fees_collected
        .checked_add(protocol_fee)
        .ok_or(KyroError::MathOverflow)?;

    // O(1) interest distribution via accumulator
    if distributable_interest > 0 {
        let total_funds = (pool.total_deposited as u128) + (pool.total_collateral as u128);
        if total_funds > 0 {
            pool.accumulated_interest_per_share = pool
                .accumulated_interest_per_share
                .checked_add(
                    (distributable_interest as u128)
                        .checked_mul(PRECISION)
                        .ok_or(KyroError::MathOverflow)?
                        / total_funds,
                )
                .ok_or(KyroError::MathOverflow)?;
        }
    }

    // Transfer repayment from borrower to pool vault
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.borrower_token_account.to_account_info(),
                to: ctx.accounts.pool_vault.to_account_info(),
                authority: ctx.accounts.borrower.to_account_info(),
            },
        ),
        total_payment,
    )?;

    // Update reputation
    let borrower_key = ctx.accounts.borrower.key();
    let rep_manager = &ctx.accounts.reputation_manager;
    let rep_data = &mut ctx.accounts.reputation_data;

    // Initialize reputation if first interaction
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

    // Update reputation score
    rep_data.total_repayments += 1;
    let (score_change, reason) = if is_on_time {
        rep_data.on_time_repayments += 1;
        (rep_manager.on_time_bonus, "On-time repayment")
    } else {
        rep_data.late_repayments += 1;
        (rep_manager.late_payment_penalty, "Late payment")
    };

    let old_score = rep_data.score;
    let old_tier = rep_data.tier;
    let actual_change = score_change.min(rep_manager.max_score_change);

    if is_on_time {
        rep_data.score = rep_data
            .score
            .saturating_add(actual_change)
            .min(MAX_REPUTATION_SCORE);
    } else {
        rep_data.score = rep_data.score.saturating_sub(actual_change);
    }

    rep_data.last_updated = clock.unix_timestamp;
    rep_data.tier = calculate_tier(rep_data.score);

    emit!(ScoreUpdatedEvent {
        user: borrower_key,
        old_score,
        new_score: rep_data.score,
        is_increase: is_on_time,
        reason: reason.to_string(),
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

    emit!(RepaidEvent {
        borrower: borrower_key,
        principal_amount,
        interest_amount,
        remaining_balance,
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
