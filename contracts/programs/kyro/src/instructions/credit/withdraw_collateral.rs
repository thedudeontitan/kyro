use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
pub struct WithdrawCollateral<'info> {
    #[account(mut)]
    pub borrower: Signer<'info>,

    #[account(
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
        seeds = [COLLATERAL_INFO_SEED, borrower.key().as_ref()],
        bump = collateral_info.bump,
        constraint = collateral_info.borrower == borrower.key() @ KyroError::NotAuthorized,
    )]
    pub collateral_info: Box<Account<'info, CollateralInfo>>,

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

    /// Collateral vault
    #[account(
        mut,
        seeds = [COLLATERAL_VAULT_SEED],
        bump,
        token::mint = usdc_mint,
    )]
    pub collateral_vault: Account<'info, TokenAccount>,

    /// Pool vault (interest may come from here)
    #[account(
        mut,
        seeds = [POOL_VAULT_SEED],
        bump,
        token::mint = usdc_mint,
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<WithdrawCollateral>, amount: u64) -> Result<()> {
    require!(amount > 0, KyroError::InvalidAmount);

    let clock = Clock::get()?;
    let credit_manager = &ctx.accounts.credit_manager;
    let pool = &mut ctx.accounts.lending_pool;
    let credit_line = &mut ctx.accounts.credit_line;
    let collateral_info = &mut ctx.accounts.collateral_info;

    // Update interest before withdrawal check
    update_interest(credit_manager, credit_line, clock.unix_timestamp);

    // Can only withdraw if no outstanding debt
    let total_debt = credit_line
        .borrowed_amount
        .checked_add(credit_line.interest_accrued)
        .ok_or(KyroError::MathOverflow)?;
    require!(total_debt == 0, KyroError::HasOutstandingDebt);

    // Settle pending collateral interest
    settle_collateral_interest(pool.accumulated_interest_per_share, collateral_info);

    let principal = collateral_info.deposited_amount;
    let total_available = principal
        .checked_add(collateral_info.earned_interest)
        .ok_or(KyroError::MathOverflow)?;
    require!(amount <= total_available, KyroError::InvalidAmount);

    // Determine how much comes from principal vs interest
    let include_interest = amount >= principal;

    let withdraw_amount = if include_interest {
        total_available
    } else {
        amount
    };

    // Deduct: principal first, then interest
    let principal_withdrawn = withdraw_amount.min(principal);
    let interest_withdrawn = withdraw_amount.saturating_sub(principal_withdrawn);

    collateral_info.deposited_amount -= principal_withdrawn;
    collateral_info.earned_interest -= interest_withdrawn;

    // Recalculate reward_debt
    collateral_info.reward_debt = (collateral_info.deposited_amount as u128)
        .saturating_mul(pool.accumulated_interest_per_share)
        / PRECISION;

    // Update pool totals
    pool.total_collateral = pool.total_collateral.saturating_sub(principal_withdrawn);

    // Transfer principal from collateral vault
    let pool_bump = pool.bump;
    let seeds = &[LENDING_POOL_SEED, &[pool_bump]];
    let signer_seeds = &[&seeds[..]];

    if principal_withdrawn > 0 {
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.collateral_vault.to_account_info(),
                    to: ctx.accounts.borrower_token_account.to_account_info(),
                    authority: ctx.accounts.lending_pool.to_account_info(),
                },
                signer_seeds,
            ),
            principal_withdrawn,
        )?;
    }

    // Transfer interest from pool vault (interest earnings come from the pool)
    if interest_withdrawn > 0 {
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.pool_vault.to_account_info(),
                    to: ctx.accounts.borrower_token_account.to_account_info(),
                    authority: ctx.accounts.lending_pool.to_account_info(),
                },
                signer_seeds,
            ),
            interest_withdrawn,
        )?;
    }

    // Update credit line tracking
    credit_line.initial_collateral = collateral_info.deposited_amount;

    let remaining_total = collateral_info
        .deposited_amount
        .checked_add(collateral_info.earned_interest)
        .ok_or(KyroError::MathOverflow)?;

    // Deactivate credit line if all collateral withdrawn
    if remaining_total == 0 {
        credit_line.is_active = false;
    }

    emit!(CollateralWithdrawnEvent {
        borrower: ctx.accounts.borrower.key(),
        amount: withdraw_amount,
        interest_earned: interest_withdrawn,
        remaining_collateral: remaining_total,
        remaining_credit_limit: remaining_total,
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
