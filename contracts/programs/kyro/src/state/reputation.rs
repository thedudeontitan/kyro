use anchor_lang::prelude::*;

/// Global reputation manager state (single PDA)
#[account]
#[derive(InitSpace)]
pub struct ReputationManagerState {
    /// Admin authority
    pub admin: Pubkey,
    /// Score bonus for on-time repayment
    pub on_time_bonus: u64,
    /// Score penalty for late payment
    pub late_payment_penalty: u64,
    /// Score penalty for default/liquidation
    pub default_penalty: u64,
    /// Maximum score change in a single update
    pub max_score_change: u64,
    /// Whether the reputation system is paused
    pub is_paused: bool,
    /// Bump seed for PDA
    pub bump: u8,
}

/// Per-user reputation data (PDA seeded by user pubkey)
#[account]
#[derive(InitSpace)]
pub struct ReputationData {
    /// User's public key
    pub user: Pubkey,
    /// Current reputation score (0 - 1000)
    pub score: u64,
    /// Timestamp of last update
    pub last_updated: i64,
    /// Total number of repayments
    pub total_repayments: u64,
    /// Number of on-time repayments
    pub on_time_repayments: u64,
    /// Number of late repayments
    pub late_repayments: u64,
    /// Number of defaults
    pub defaults: u64,
    /// Current reputation tier (0=Bronze, 1=Silver, 2=Gold, 3=Platinum)
    pub tier: u8,
    /// Whether the user has been initialized in the reputation system
    pub is_initialized: bool,
    /// Bump seed for PDA
    pub bump: u8,
}
