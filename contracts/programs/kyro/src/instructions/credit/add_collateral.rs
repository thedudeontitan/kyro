use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
pub struct AddCollateral<'info> {
    #[account(mut)]
    pub borrower: Signer<'info>,

    #[account(
        seeds = [CREDIT_MANAGER_SEED],
        bump = credit_manager.bump,
        constraint = !credit_manager.is_paused @ KyroError::Paused,
    )]
    pub credit_manager: Account<'info, CreditManagerState>,

    #[account(
        mut,
        seeds = [LENDING_POOL_SEED],
        bump = lending_pool.bump,
    )]
    pub lending_pool: Account<'info, LendingPoolState>,

    #[account(
        mut,
        seeds = [CREDIT_LINE_SEED, borrower.key().as_ref()],
        bump = credit_line.bump,
        constraint = credit_line.borrower == borrower.key() @ KyroError::NotAuthorized,
    )]
    pub credit_line: Account<'info, CreditLine>,

    #[account(
        mut,
        seeds = [COLLATERAL_INFO_SEED, borrower.key().as_ref()],
        bump = collateral_info.bump,
        constraint = collateral_info.borrower == borrower.key() @ KyroError::NotAuthorized,
    )]
    pub collateral_info: Account<'info, CollateralInfo>,

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

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<AddCollateral>, collateral_amount: u64) -> Result<()> {
    require!(collateral_amount > 0, KyroError::InvalidAmount);
    require!(
        collateral_amount >= MIN_COLLATERAL_AMOUNT,
        KyroError::BelowMinimumAmount
    );

    let clock = Clock::get()?;
    let pool = &mut ctx.accounts.lending_pool;
    let collateral_info = &mut ctx.accounts.collateral_info;
    let credit_line = &mut ctx.accounts.credit_line;

    // Transfer collateral from borrower to vault
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.borrower_token_account.to_account_info(),
                to: ctx.accounts.collateral_vault.to_account_info(),
                authority: ctx.accounts.borrower.to_account_info(),
            },
        ),
        collateral_amount,
    )?;

    // Settle pending interest before changing deposit
    settle_collateral_interest(pool.accumulated_interest_per_share, collateral_info);

    collateral_info.deposited_amount = collateral_info
        .deposited_amount
        .checked_add(collateral_amount)
        .ok_or(KyroError::MathOverflow)?;
    collateral_info.reward_debt = (collateral_info.deposited_amount as u128)
        .saturating_mul(pool.accumulated_interest_per_share)
        / PRECISION;
    collateral_info.deposit_timestamp = clock.unix_timestamp;

    pool.total_collateral = pool
        .total_collateral
        .checked_add(collateral_amount)
        .ok_or(KyroError::MathOverflow)?;

    // Update credit line tracking
    credit_line.initial_collateral = credit_line
        .initial_collateral
        .checked_add(collateral_amount)
        .ok_or(KyroError::MathOverflow)?;

    // Reactivate if inactive (H-02 from Move audit)
    if !credit_line.is_active {
        credit_line.is_active = true;
        credit_line.borrowed_amount = 0;
        credit_line.interest_accrued = 0;
        credit_line.last_borrowed_timestamp = 0;
        credit_line.last_interest_update = clock.unix_timestamp;
        credit_line.repayment_due_date = 0;
    }

    // Total collateral = principal + earned interest
    let total_collateral = collateral_info
        .deposited_amount
        .checked_add(collateral_info.earned_interest)
        .ok_or(KyroError::MathOverflow)?;

    emit!(CollateralAddedEvent {
        borrower: ctx.accounts.borrower.key(),
        amount: collateral_amount,
        total_collateral,
        new_credit_limit: total_collateral,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
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
