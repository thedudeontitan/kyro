use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
pub struct Withdraw<'info> {
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
        mut,
        seeds = [LENDER_INFO_SEED, lender.key().as_ref()],
        bump = lender_info.bump,
        constraint = lender_info.lender == lender.key() @ KyroError::LenderNotFound,
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
}

pub fn handler(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    require!(amount > 0, KyroError::InvalidAmount);

    let clock = Clock::get()?;
    let pool = &mut ctx.accounts.lending_pool;
    let lender_info = &mut ctx.accounts.lender_info;

    // Check available liquidity (pool balance minus reserved protocol fees)
    let pool_balance = ctx.accounts.pool_vault.amount;
    let available_liquidity = pool_balance.saturating_sub(pool.protocol_fees_collected);
    require!(
        available_liquidity >= amount,
        KyroError::InsufficientLiquidity
    );

    // Settle pending interest before withdrawal
    settle_lender_interest(pool.accumulated_interest_per_share, lender_info);

    let total_available = lender_info
        .deposited_amount
        .checked_add(lender_info.earned_interest)
        .ok_or(KyroError::MathOverflow)?;
    require!(total_available >= amount, KyroError::InsufficientBalance);

    // Deduction order: interest first, then principal
    let interest_withdrawn = amount.min(lender_info.earned_interest);
    let principal_withdrawn = amount - interest_withdrawn;

    lender_info.earned_interest -= interest_withdrawn;
    lender_info.deposited_amount -= principal_withdrawn;

    // Recalculate reward_debt after balance change
    lender_info.reward_debt = (lender_info.deposited_amount as u128)
        .saturating_mul(pool.accumulated_interest_per_share)
        / PRECISION;

    // Only deduct principal from pool total (interest was never part of total_deposited)
    pool.total_deposited = pool.total_deposited.saturating_sub(principal_withdrawn);

    // Transfer tokens from pool vault to lender (PDA signing)
    let pool_bump = pool.bump;
    let seeds = &[LENDING_POOL_SEED, &[pool_bump]];
    let signer_seeds = &[&seeds[..]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.pool_vault.to_account_info(),
                to: ctx.accounts.lender_token_account.to_account_info(),
                authority: ctx.accounts.lending_pool.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    emit!(WithdrawEvent {
        lender: ctx.accounts.lender.key(),
        amount,
        interest: interest_withdrawn,
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
