use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

// ========== Update Credit Parameters ==========

#[derive(Accounts)]
pub struct UpdateParameters<'info> {
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [CREDIT_MANAGER_SEED],
        bump = credit_manager.bump,
        constraint = credit_manager.admin == admin.key() @ KyroError::NotAuthorized,
    )]
    pub credit_manager: Account<'info, CreditManagerState>,
}

pub fn handler_update_parameters(
    ctx: Context<UpdateParameters>,
    fixed_interest_rate: u64,
    reputation_threshold: u64,
    credit_increase_multiplier: u64,
) -> Result<()> {
    require!(
        fixed_interest_rate >= MIN_INTEREST_RATE_BPS && fixed_interest_rate <= MAX_INTEREST_RATE_BPS,
        KyroError::InvalidParameters
    );
    require!(
        reputation_threshold <= MAX_REPUTATION_SCORE,
        KyroError::InvalidParameters
    );
    require!(
        credit_increase_multiplier >= BASIS_POINTS as u64
            && credit_increase_multiplier <= MAX_CREDIT_MULTIPLIER_BPS,
        KyroError::InvalidParameters
    );

    let credit_manager = &mut ctx.accounts.credit_manager;
    credit_manager.fixed_interest_rate = fixed_interest_rate;
    credit_manager.reputation_threshold = reputation_threshold;
    credit_manager.credit_increase_multiplier = credit_increase_multiplier;

    let clock = Clock::get()?;
    emit!(ParametersUpdatedEvent {
        fixed_interest_rate,
        reputation_threshold,
        credit_increase_multiplier,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

// ========== Update Reputation Parameters ==========

#[derive(Accounts)]
pub struct UpdateReputationParameters<'info> {
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
        seeds = [REPUTATION_MANAGER_SEED],
        bump = reputation_manager.bump,
    )]
    pub reputation_manager: Account<'info, ReputationManagerState>,
}

pub fn handler_update_reputation_parameters(
    ctx: Context<UpdateReputationParameters>,
    on_time_bonus: u64,
    late_payment_penalty: u64,
    default_penalty: u64,
    max_score_change: u64,
) -> Result<()> {
    require!(
        on_time_bonus > 0 && on_time_bonus <= MAX_REPUTATION_SCORE,
        KyroError::InvalidParameters
    );
    require!(
        late_payment_penalty > 0 && late_payment_penalty <= MAX_REPUTATION_SCORE,
        KyroError::InvalidParameters
    );
    require!(
        default_penalty > 0 && default_penalty <= MAX_REPUTATION_SCORE,
        KyroError::InvalidParameters
    );
    require!(
        max_score_change > 0 && max_score_change <= MAX_REPUTATION_SCORE,
        KyroError::InvalidParameters
    );

    let rep = &mut ctx.accounts.reputation_manager;
    rep.on_time_bonus = on_time_bonus;
    rep.late_payment_penalty = late_payment_penalty;
    rep.default_penalty = default_penalty;
    rep.max_score_change = max_score_change;

    let clock = Clock::get()?;
    emit!(ReputationParametersUpdatedEvent {
        on_time_bonus,
        late_payment_penalty,
        default_penalty,
        max_score_change,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
