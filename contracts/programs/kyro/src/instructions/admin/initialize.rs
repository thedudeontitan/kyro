use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::constants::*;
use crate::state::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = 8 + CreditManagerState::INIT_SPACE,
        seeds = [CREDIT_MANAGER_SEED],
        bump,
    )]
    pub credit_manager: Account<'info, CreditManagerState>,

    #[account(
        init,
        payer = admin,
        space = 8 + LendingPoolState::INIT_SPACE,
        seeds = [LENDING_POOL_SEED],
        bump,
    )]
    pub lending_pool: Account<'info, LendingPoolState>,

    #[account(
        init,
        payer = admin,
        space = 8 + ReputationManagerState::INIT_SPACE,
        seeds = [REPUTATION_MANAGER_SEED],
        bump,
    )]
    pub reputation_manager: Account<'info, ReputationManagerState>,

    /// USDC mint
    pub usdc_mint: Account<'info, Mint>,

    /// Pool vault for lender deposits and borrows
    #[account(
        init,
        payer = admin,
        token::mint = usdc_mint,
        token::authority = lending_pool,
        seeds = [POOL_VAULT_SEED],
        bump,
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    /// Collateral vault for borrower collateral
    #[account(
        init,
        payer = admin,
        token::mint = usdc_mint,
        token::authority = lending_pool,
        seeds = [COLLATERAL_VAULT_SEED],
        bump,
    )]
    pub collateral_vault: Account<'info, TokenAccount>,

    /// Protocol fees vault
    #[account(
        init,
        payer = admin,
        token::mint = usdc_mint,
        token::authority = lending_pool,
        seeds = [PROTOCOL_FEES_SEED],
        bump,
    )]
    pub protocol_fees_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let admin_key = ctx.accounts.admin.key();
    let usdc_mint_key = ctx.accounts.usdc_mint.key();

    // Initialize Credit Manager
    let credit_manager = &mut ctx.accounts.credit_manager;
    credit_manager.admin = admin_key;
    credit_manager.pending_admin = None;
    credit_manager.fixed_interest_rate = DEFAULT_INTEREST_RATE_BPS;
    credit_manager.reputation_threshold = DEFAULT_REPUTATION_THRESHOLD;
    credit_manager.credit_increase_multiplier = DEFAULT_CREDIT_MULTIPLIER_BPS;
    credit_manager.usdc_mint = usdc_mint_key;
    credit_manager.is_paused = false;
    credit_manager.bump = ctx.bumps.credit_manager;

    // Initialize Lending Pool
    let lending_pool = &mut ctx.accounts.lending_pool;
    lending_pool.admin = admin_key;
    lending_pool.total_deposited = 0;
    lending_pool.total_collateral = 0;
    lending_pool.total_borrowed = 0;
    lending_pool.total_repaid = 0;
    lending_pool.protocol_fees_collected = 0;
    lending_pool.accumulated_interest_per_share = 0;
    lending_pool.usdc_mint = usdc_mint_key;
    lending_pool.is_paused = false;
    lending_pool.bump = ctx.bumps.lending_pool;

    // Initialize Reputation Manager
    let reputation_manager = &mut ctx.accounts.reputation_manager;
    reputation_manager.admin = admin_key;
    reputation_manager.on_time_bonus = DEFAULT_ON_TIME_BONUS;
    reputation_manager.late_payment_penalty = DEFAULT_LATE_PENALTY;
    reputation_manager.default_penalty = DEFAULT_DEFAULT_PENALTY;
    reputation_manager.max_score_change = DEFAULT_MAX_SCORE_CHANGE;
    reputation_manager.is_paused = false;
    reputation_manager.bump = ctx.bumps.reputation_manager;

    Ok(())
}
