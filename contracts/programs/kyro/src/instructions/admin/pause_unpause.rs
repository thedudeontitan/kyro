use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
pub struct PauseUnpause<'info> {
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [CREDIT_MANAGER_SEED],
        bump = credit_manager.bump,
        constraint = credit_manager.admin == admin.key() @ KyroError::NotAuthorized,
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
        seeds = [REPUTATION_MANAGER_SEED],
        bump = reputation_manager.bump,
    )]
    pub reputation_manager: Account<'info, ReputationManagerState>,
}

pub fn handler_pause(ctx: Context<PauseUnpause>) -> Result<()> {
    let clock = Clock::get()?;

    ctx.accounts.credit_manager.is_paused = true;
    ctx.accounts.lending_pool.is_paused = true;
    ctx.accounts.reputation_manager.is_paused = true;

    emit!(PausedEvent {
        admin: ctx.accounts.admin.key(),
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

pub fn handler_unpause(ctx: Context<PauseUnpause>) -> Result<()> {
    let clock = Clock::get()?;

    ctx.accounts.credit_manager.is_paused = false;
    ctx.accounts.lending_pool.is_paused = false;
    ctx.accounts.reputation_manager.is_paused = false;

    emit!(UnpausedEvent {
        admin: ctx.accounts.admin.key(),
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
