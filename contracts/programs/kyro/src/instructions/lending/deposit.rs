use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub lender: Signer<'info>,

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
        constraint = !lending_pool.is_paused @ KyroError::Paused,
    )]
    pub lending_pool: Account<'info, LendingPoolState>,

    #[account(
        init_if_needed,
        payer = lender,
        space = 8 + LenderInfo::INIT_SPACE,
        seeds = [LENDER_INFO_SEED, lender.key().as_ref()],
        bump,
    )]
    pub lender_info: Account<'info, LenderInfo>,

    #[account(
        constraint = usdc_mint.key() == credit_manager.usdc_mint @ KyroError::InvalidAddress,
    )]
    pub usdc_mint: Account<'info, Mint>,

    /// Lender's USDC token account
    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = lender,
    )]
    pub lender_token_account: Account<'info, TokenAccount>,

    /// Pool vault
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

pub fn handler(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    require!(amount > 0, KyroError::InvalidAmount);
    require!(amount >= MIN_DEPOSIT_AMOUNT, KyroError::BelowMinimumAmount);

    let clock = Clock::get()?;
    let lender_key = ctx.accounts.lender.key();
    let pool = &mut ctx.accounts.lending_pool;
    let lender_info = &mut ctx.accounts.lender_info;

    // Check if this is an existing lender (already initialized)
    if lender_info.lender != Pubkey::default() {
        // Settle pending interest before changing deposit (O(1) accumulator)
        settle_lender_interest(pool.accumulated_interest_per_share, lender_info);

        lender_info.deposited_amount = lender_info
            .deposited_amount
            .checked_add(amount)
            .ok_or(KyroError::MathOverflow)?;

        // Recalculate reward_debt with new deposit amount
        lender_info.reward_debt = (lender_info.deposited_amount as u128)
            .checked_mul(pool.accumulated_interest_per_share)
            .ok_or(KyroError::MathOverflow)?
            / PRECISION;

        lender_info.last_deposit_timestamp = clock.unix_timestamp;
    } else {
        // First-time deposit: initialize lender info
        lender_info.lender = lender_key;
        lender_info.deposited_amount = amount;
        lender_info.earned_interest = 0;
        lender_info.reward_debt = (amount as u128)
            .checked_mul(pool.accumulated_interest_per_share)
            .ok_or(KyroError::MathOverflow)?
            / PRECISION;
        lender_info.initial_deposit_timestamp = clock.unix_timestamp;
        lender_info.last_deposit_timestamp = clock.unix_timestamp;
        lender_info.bump = ctx.bumps.lender_info;
    }

    pool.total_deposited = pool
        .total_deposited
        .checked_add(amount)
        .ok_or(KyroError::MathOverflow)?;

    // Transfer USDC from lender to pool vault
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.lender_token_account.to_account_info(),
                to: ctx.accounts.pool_vault.to_account_info(),
                authority: ctx.accounts.lender.to_account_info(),
            },
        ),
        amount,
    )?;

    emit!(DepositEvent {
        lender: lender_key,
        amount,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

/// Settle pending interest for a lender using the O(1) accumulator pattern
fn settle_lender_interest(accumulated: u128, lender_info: &mut LenderInfo) {
    if lender_info.deposited_amount > 0 {
        let current_accumulated = (lender_info.deposited_amount as u128)
            .saturating_mul(accumulated)
            / PRECISION;
        if current_accumulated > lender_info.reward_debt {
            let pending = current_accumulated - lender_info.reward_debt;
            lender_info.earned_interest = lender_info
                .earned_interest
                .saturating_add(pending as u64);
        }
    }
    lender_info.reward_debt = (lender_info.deposited_amount as u128)
        .saturating_mul(accumulated)
        / PRECISION;
}
