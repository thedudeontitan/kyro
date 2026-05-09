use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

// ========== Transfer Admin (Initiate) ==========

#[derive(Accounts)]
pub struct TransferAdmin<'info> {
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [CREDIT_MANAGER_SEED],
        bump = credit_manager.bump,
        constraint = credit_manager.admin == admin.key() @ KyroError::NotAuthorized,
    )]
    pub credit_manager: Account<'info, CreditManagerState>,
}

pub fn handler_transfer_admin(ctx: Context<TransferAdmin>, new_admin: Pubkey) -> Result<()> {
    require!(new_admin != Pubkey::default(), KyroError::InvalidAddress);

    let clock = Clock::get()?;
    ctx.accounts.credit_manager.pending_admin = Some(new_admin);

    emit!(AdminTransferInitiatedEvent {
        current_admin: ctx.accounts.admin.key(),
        pending_admin: new_admin,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

// ========== Accept Admin ==========

#[derive(Accounts)]
pub struct AcceptAdmin<'info> {
    pub new_admin: Signer<'info>,

    #[account(
        mut,
        seeds = [CREDIT_MANAGER_SEED],
        bump = credit_manager.bump,
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

pub fn handler_accept_admin(ctx: Context<AcceptAdmin>) -> Result<()> {
    let credit_manager = &mut ctx.accounts.credit_manager;
    let new_admin_key = ctx.accounts.new_admin.key();

    require!(
        credit_manager.pending_admin.is_some(),
        KyroError::PendingAdminNotSet
    );
    require!(
        credit_manager.pending_admin.unwrap() == new_admin_key,
        KyroError::NotPendingAdmin
    );

    let clock = Clock::get()?;
    let old_admin = credit_manager.admin;

    // Update admin across all state accounts
    credit_manager.admin = new_admin_key;
    credit_manager.pending_admin = None;
    ctx.accounts.lending_pool.admin = new_admin_key;
    ctx.accounts.reputation_manager.admin = new_admin_key;

    emit!(AdminTransferCompletedEvent {
        old_admin,
        new_admin: new_admin_key,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

// ========== Cancel Admin Transfer ==========

#[derive(Accounts)]
pub struct CancelAdminTransfer<'info> {
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [CREDIT_MANAGER_SEED],
        bump = credit_manager.bump,
        constraint = credit_manager.admin == admin.key() @ KyroError::NotAuthorized,
    )]
    pub credit_manager: Account<'info, CreditManagerState>,
}

pub fn handler_cancel_admin_transfer(ctx: Context<CancelAdminTransfer>) -> Result<()> {
    let credit_manager = &mut ctx.accounts.credit_manager;

    require!(
        credit_manager.pending_admin.is_some(),
        KyroError::PendingAdminNotSet
    );

    let clock = Clock::get()?;
    let cancelled = credit_manager.pending_admin.unwrap();
    credit_manager.pending_admin = None;

    emit!(AdminTransferCancelledEvent {
        admin: ctx.accounts.admin.key(),
        cancelled_pending_admin: cancelled,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
