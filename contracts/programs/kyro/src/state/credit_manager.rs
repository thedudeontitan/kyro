use anchor_lang::prelude::*;

/// Global protocol configuration (single PDA)
#[account]
#[derive(InitSpace)]
pub struct CreditManagerState {
    /// Admin authority
    pub admin: Pubkey,
    /// Two-step admin transfer: pending new admin
    pub pending_admin: Option<Pubkey>,
    /// Fixed annual interest rate in basis points (e.g. 1500 = 15%)
    pub fixed_interest_rate: u64,
    /// Reputation score threshold for credit increase eligibility
    pub reputation_threshold: u64,
    /// Credit increase multiplier in basis points (e.g. 12000 = 120%)
    pub credit_increase_multiplier: u64,
    /// USDC token mint
    pub usdc_mint: Pubkey,
    /// Whether the protocol is paused
    pub is_paused: bool,
    /// Bump seed for PDA
    pub bump: u8,
}

/// Per-borrower credit line (PDA seeded by borrower pubkey)
#[account]
#[derive(InitSpace)]
pub struct CreditLine {
    /// Borrower's public key
    pub borrower: Pubkey,
    /// Original collateral deposited (for reference tracking)
    pub initial_collateral: u64,
    /// Current outstanding borrowed amount
    pub borrowed_amount: u64,
    /// Timestamp of last borrow action
    pub last_borrowed_timestamp: i64,
    /// Accrued interest on the borrowed amount
    pub interest_accrued: u64,
    /// Timestamp of last interest calculation
    pub last_interest_update: i64,
    /// Deadline for full repayment (grace + repayment window)
    pub repayment_due_date: i64,
    /// Whether this credit line is active
    pub is_active: bool,
    /// Total amount repaid over lifetime
    pub total_repaid: u64,
    /// Number of on-time repayments
    pub on_time_repayments: u64,
    /// Number of late repayments
    pub late_repayments: u64,
    /// Bump seed for PDA
    pub bump: u8,
}
