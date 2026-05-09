use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
pub struct OpenCreditLine<'info> {
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
        init,
        payer = borrower,
        space = 8 + CreditLine::INIT_SPACE,
        seeds = [CREDIT_LINE_SEED, borrower.key().as_ref()],
        bump,
    )]
    pub credit_line: Account<'info, CreditLine>,

    #[account(
        init,
        payer = borrower,
        space = 8 + CollateralInfo::INIT_SPACE,
        seeds = [COLLATERAL_INFO_SEED, borrower.key().as_ref()],
        bump,
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
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<OpenCreditLine>, collateral_amount: u64) -> Result<()> {
    require!(collateral_amount > 0, KyroError::InvalidAmount);
    require!(
        collateral_amount >= MIN_COLLATERAL_AMOUNT,
        KyroError::BelowMinimumAmount
    );

    let clock = Clock::get()?;
    let borrower_key = ctx.accounts.borrower.key();
    let pool = &mut ctx.accounts.lending_pool;

    // Transfer collateral from borrower to collateral vault
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

    // Initialize collateral info
    let collateral_info = &mut ctx.accounts.collateral_info;
    collateral_info.borrower = borrower_key;
    collateral_info.deposited_amount = collateral_amount;
    collateral_info.earned_interest = 0;
    collateral_info.reward_debt = (collateral_amount as u128)
        .checked_mul(pool.accumulated_interest_per_share)
        .ok_or(KyroError::MathOverflow)?
        / PRECISION;
    collateral_info.deposit_timestamp = clock.unix_timestamp;
    collateral_info.bump = ctx.bumps.collateral_info;

    // Update pool collateral tracking
    pool.total_collateral = pool
        .total_collateral
        .checked_add(collateral_amount)
        .ok_or(KyroError::MathOverflow)?;

    // Initialize credit line (credit limit = collateral amount, 1:1 ratio)
    let credit_line = &mut ctx.accounts.credit_line;
    credit_line.borrower = borrower_key;
    credit_line.initial_collateral = collateral_amount;
    credit_line.borrowed_amount = 0;
    credit_line.last_borrowed_timestamp = 0;
    credit_line.interest_accrued = 0;
    credit_line.last_interest_update = clock.unix_timestamp;
    credit_line.repayment_due_date = 0;
    credit_line.is_active = true;
    credit_line.total_repaid = 0;
    credit_line.on_time_repayments = 0;
    credit_line.late_repayments = 0;
    credit_line.bump = ctx.bumps.credit_line;

    emit!(CreditOpenedEvent {
        borrower: borrower_key,
        collateral_amount,
        credit_limit: collateral_amount,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
