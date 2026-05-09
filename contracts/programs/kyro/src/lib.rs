use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("ESVeXwXtP9jDv1JoGnfQcQwC3tnyEdXV5VsATqxyCCg3");

#[program]
pub mod kyro {
    use super::*;

    // ========== Admin Instructions ==========

    /// Initialize the entire protocol: CreditManager, LendingPool, ReputationManager, and all vaults
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::admin::initialize::handler(ctx)
    }

    /// Pause the entire protocol
    pub fn pause(ctx: Context<PauseUnpause>) -> Result<()> {
        instructions::admin::pause_unpause::handler_pause(ctx)
    }

    /// Unpause the entire protocol
    pub fn unpause(ctx: Context<PauseUnpause>) -> Result<()> {
        instructions::admin::pause_unpause::handler_unpause(ctx)
    }

    /// Initiate a two-step admin transfer
    pub fn transfer_admin(ctx: Context<TransferAdmin>, new_admin: Pubkey) -> Result<()> {
        instructions::admin::transfer_admin::handler_transfer_admin(ctx, new_admin)
    }

    /// Accept pending admin transfer
    pub fn accept_admin(ctx: Context<AcceptAdmin>) -> Result<()> {
        instructions::admin::transfer_admin::handler_accept_admin(ctx)
    }

    /// Cancel pending admin transfer
    pub fn cancel_admin_transfer(ctx: Context<CancelAdminTransfer>) -> Result<()> {
        instructions::admin::transfer_admin::handler_cancel_admin_transfer(ctx)
    }

    /// Update credit protocol parameters (interest rate, reputation threshold, credit multiplier)
    pub fn update_parameters(
        ctx: Context<UpdateParameters>,
        fixed_interest_rate: u64,
        reputation_threshold: u64,
        credit_increase_multiplier: u64,
    ) -> Result<()> {
        instructions::admin::update_parameters::handler_update_parameters(
            ctx,
            fixed_interest_rate,
            reputation_threshold,
            credit_increase_multiplier,
        )
    }

    /// Update reputation scoring parameters
    pub fn update_reputation_parameters(
        ctx: Context<UpdateReputationParameters>,
        on_time_bonus: u64,
        late_payment_penalty: u64,
        default_penalty: u64,
        max_score_change: u64,
    ) -> Result<()> {
        instructions::admin::update_parameters::handler_update_reputation_parameters(
            ctx,
            on_time_bonus,
            late_payment_penalty,
            default_penalty,
            max_score_change,
        )
    }

    // ========== Credit Instructions ==========

    /// Open a new credit line with collateral deposit
    pub fn open_credit_line(ctx: Context<OpenCreditLine>, collateral_amount: u64) -> Result<()> {
        instructions::credit::open_credit_line::handler(ctx, collateral_amount)
    }

    /// Add collateral to an existing credit line (also reactivates inactive credit lines)
    pub fn add_collateral(ctx: Context<AddCollateral>, collateral_amount: u64) -> Result<()> {
        instructions::credit::add_collateral::handler(ctx, collateral_amount)
    }

    /// Borrow funds from the pool (sent to borrower)
    pub fn borrow(ctx: Context<Borrow>, amount: u64) -> Result<()> {
        instructions::credit::borrow::handler(ctx, amount)
    }

    /// Borrow funds and pay directly to a recipient
    pub fn borrow_and_pay(
        ctx: Context<BorrowAndPay>,
        recipient: Pubkey,
        amount: u64,
    ) -> Result<()> {
        instructions::credit::borrow_and_pay::handler(ctx, recipient, amount)
    }

    /// Repay borrowed funds (principal and/or interest)
    pub fn repay(ctx: Context<Repay>, principal_amount: u64, interest_amount: u64) -> Result<()> {
        instructions::credit::repay::handler(ctx, principal_amount, interest_amount)
    }

    /// Withdraw collateral (only when no outstanding debt)
    pub fn withdraw_collateral(ctx: Context<WithdrawCollateral>, amount: u64) -> Result<()> {
        instructions::credit::withdraw_collateral::handler(ctx, amount)
    }

    /// Liquidate a borrower's position (admin only, when over LTV or overdue)
    pub fn liquidate(ctx: Context<Liquidate>, borrower: Pubkey) -> Result<()> {
        instructions::credit::liquidate::handler(ctx, borrower)
    }

    // ========== Lending Instructions ==========

    /// Deposit USDC into the lending pool
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::lending::deposit::handler(ctx, amount)
    }

    /// Withdraw USDC from the lending pool (interest deducted first, then principal)
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        instructions::lending::withdraw::handler(ctx, amount)
    }
}
