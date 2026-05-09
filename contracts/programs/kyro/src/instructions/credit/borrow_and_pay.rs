use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::constants::*;
use crate::errors::KyroError;
use crate::events::*;
use crate::state::*;

#[derive(Accounts)]
pub struct BorrowAndPay<'info> {
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
        constraint = credit_line.is_active @ KyroError::CreditLineNotActive,
    )]
    pub credit_line: Account<'info, CreditLine>,

    #[account(
        seeds = [COLLATERAL_INFO_SEED, borrower.key().as_ref()],
        bump = collateral_info.bump,
        constraint = collateral_info.borrower == borrower.key() @ KyroError::NotAuthorized,
    )]
    pub collateral_info: Account<'info, CollateralInfo>,

    #[account(
        constraint = usdc_mint.key() == credit_manager.usdc_mint @ KyroError::InvalidAddress,
    )]
    pub usdc_mint: Account<'info, Mint>,

    /// Recipient's USDC token account (receives the payment)
    /// CHECK: Validated that it's a token account with correct mint below
    #[account(
        mut,
        token::mint = usdc_mint,
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    /// Pool vault (source of borrowed funds)
    #[account(
        mut,
        seeds = [POOL_VAULT_SEED],
        bump,
        token::mint = usdc_mint,
    )]
    pub pool_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<BorrowAndPay>, recipient: Pubkey, amount: u64) -> Result<()> {
    require!(amount > 0, KyroError::InvalidAmount);
    require!(amount >= MIN_BORROW_AMOUNT, KyroError::BelowMinimumAmount);

    let borrower_key = ctx.accounts.borrower.key();

    // Validate recipient isn't the borrower or system accounts
    require!(recipient != borrower_key, KyroError::InvalidAddress);
    require!(recipient != Pubkey::default(), KyroError::InvalidAddress);

    let clock = Clock::get()?;
    let credit_manager = &ctx.accounts.credit_manager;
    let pool = &mut ctx.accounts.lending_pool;
    let credit_line = &mut ctx.accounts.credit_line;
    let collateral_info = &ctx.accounts.collateral_info;

    // Update interest before borrowing
    update_interest(credit_manager, credit_line, clock.unix_timestamp);

    // Overflow check
    require!(
        (credit_line.borrowed_amount as u128) + (amount as u128) <= u64::MAX as u128,
        KyroError::MathOverflow
    );

    // Get dynamic credit limit
    let credit_limit = get_collateral_total(collateral_info, pool.accumulated_interest_per_share);

    // Check total debt doesn't exceed credit limit
    let total_debt = (credit_line.borrowed_amount as u128) + (credit_line.interest_accrued as u128);
    require!(
        total_debt + (amount as u128) <= credit_limit as u128,
        KyroError::ExceedsCreditLimit
    );

    // Check available liquidity
    let pool_balance = ctx.accounts.pool_vault.amount;
    let available_liquidity = pool_balance.saturating_sub(pool.protocol_fees_collected);
    require!(
        available_liquidity >= amount,
        KyroError::InsufficientLiquidity
    );

    // Only set repayment_due_date on the FIRST borrow
    let is_first_borrow =
        credit_line.repayment_due_date == 0 || credit_line.borrowed_amount == 0;

    credit_line.borrowed_amount = credit_line
        .borrowed_amount
        .checked_add(amount)
        .ok_or(KyroError::MathOverflow)?;
    credit_line.last_borrowed_timestamp = clock.unix_timestamp;

    if is_first_borrow {
        credit_line.repayment_due_date =
            clock.unix_timestamp + GRACE_PERIOD_SECONDS + REPAYMENT_WINDOW_SECONDS;
    }

    pool.total_borrowed = pool
        .total_borrowed
        .checked_add(amount)
        .ok_or(KyroError::MathOverflow)?;

    // Transfer from pool vault directly to recipient (PDA signing)
    let pool_bump = pool.bump;
    let seeds = &[LENDING_POOL_SEED, &[pool_bump]];
    let signer_seeds = &[&seeds[..]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.pool_vault.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.lending_pool.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    emit!(DirectPaymentEvent {
        borrower: borrower_key,
        recipient,
        amount,
        total_borrowed: credit_line.borrowed_amount,
        due_date: credit_line.repayment_due_date,
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

fn get_collateral_total(collateral_info: &CollateralInfo, accumulated: u128) -> u64 {
    let pending = if collateral_info.deposited_amount > 0 {
        let current = (collateral_info.deposited_amount as u128)
            .saturating_mul(accumulated)
            / PRECISION;
        if current > collateral_info.reward_debt {
            (current - collateral_info.reward_debt) as u64
        } else {
            0
        }
    } else {
        0
    };
    let total_interest = collateral_info.earned_interest.saturating_add(pending);
    collateral_info.deposited_amount.saturating_add(total_interest)
}
