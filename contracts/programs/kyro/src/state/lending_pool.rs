use anchor_lang::prelude::*;

/// Global lending pool state (single PDA)
#[account]
#[derive(InitSpace)]
pub struct LendingPoolState {
    /// Admin authority
    pub admin: Pubkey,
    /// Total deposited by lenders (principal only)
    pub total_deposited: u64,
    /// Total collateral deposited by borrowers
    pub total_collateral: u64,
    /// Total borrowed from the pool
    pub total_borrowed: u64,
    /// Total repaid to the pool
    pub total_repaid: u64,
    /// Protocol fees collected (held in pool vault)
    pub protocol_fees_collected: u64,
    /// Global O(1) interest accumulator (scaled by PRECISION = 1e12)
    pub accumulated_interest_per_share: u128,
    /// USDC token mint
    pub usdc_mint: Pubkey,
    /// Whether the pool is paused
    pub is_paused: bool,
    /// Bump seed for PDA
    pub bump: u8,
}

/// Per-lender deposit tracking (PDA seeded by lender pubkey)
#[account]
#[derive(InitSpace)]
pub struct LenderInfo {
    /// Lender's public key
    pub lender: Pubkey,
    /// Principal amount deposited
    pub deposited_amount: u64,
    /// Settled (realized) interest earnings
    pub earned_interest: u64,
    /// Reward debt for O(1) accumulator pattern: deposited * acc_per_share at last settlement
    pub reward_debt: u128,
    /// Timestamp of first deposit (never overwritten)
    pub initial_deposit_timestamp: i64,
    /// Timestamp of most recent deposit
    pub last_deposit_timestamp: i64,
    /// Bump seed for PDA
    pub bump: u8,
}

/// Per-borrower collateral tracking (PDA seeded by borrower pubkey)
#[account]
#[derive(InitSpace)]
pub struct CollateralInfo {
    /// Borrower's public key
    pub borrower: Pubkey,
    /// Principal collateral deposited
    pub deposited_amount: u64,
    /// Settled (realized) interest earnings on collateral
    pub earned_interest: u64,
    /// Reward debt for O(1) accumulator pattern
    pub reward_debt: u128,
    /// Timestamp of collateral deposit
    pub deposit_timestamp: i64,
    /// Bump seed for PDA
    pub bump: u8,
}
