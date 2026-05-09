use anchor_lang::prelude::*;

// ========== Credit Events ==========

#[event]
pub struct CreditOpenedEvent {
    pub borrower: Pubkey,
    pub collateral_amount: u64,
    pub credit_limit: u64,
    pub timestamp: i64,
}

#[event]
pub struct BorrowedEvent {
    pub borrower: Pubkey,
    pub amount: u64,
    pub total_borrowed: u64,
    pub due_date: i64,
    pub timestamp: i64,
}

#[event]
pub struct DirectPaymentEvent {
    pub borrower: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub total_borrowed: u64,
    pub due_date: i64,
    pub timestamp: i64,
}

#[event]
pub struct RepaidEvent {
    pub borrower: Pubkey,
    pub principal_amount: u64,
    pub interest_amount: u64,
    pub remaining_balance: u64,
    pub timestamp: i64,
}

#[event]
pub struct LiquidatedEvent {
    pub borrower: Pubkey,
    pub collateral_liquidated: u64,
    pub debt_cleared: u64,
    pub reason: String,
    pub timestamp: i64,
}

#[event]
pub struct CollateralAddedEvent {
    pub borrower: Pubkey,
    pub amount: u64,
    pub total_collateral: u64,
    pub new_credit_limit: u64,
    pub timestamp: i64,
}

#[event]
pub struct CollateralWithdrawnEvent {
    pub borrower: Pubkey,
    pub amount: u64,
    pub interest_earned: u64,
    pub remaining_collateral: u64,
    pub remaining_credit_limit: u64,
    pub timestamp: i64,
}

// ========== Lending Events ==========

#[event]
pub struct DepositEvent {
    pub lender: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct WithdrawEvent {
    pub lender: Pubkey,
    pub amount: u64,
    pub interest: u64,
    pub timestamp: i64,
}

#[event]
pub struct CollateralDepositedEvent {
    pub borrower: Pubkey,
    pub amount: u64,
    pub total_collateral: u64,
    pub timestamp: i64,
}

#[event]
pub struct CollateralSeizedEvent {
    pub borrower: Pubkey,
    pub amount_seized: u64,
    pub interest_seized: u64,
    pub remaining_collateral: u64,
    pub timestamp: i64,
}

#[event]
pub struct LendingCollateralWithdrawnEvent {
    pub borrower: Pubkey,
    pub amount: u64,
    pub interest_earned: u64,
    pub remaining_collateral: u64,
    pub timestamp: i64,
}

#[event]
pub struct BorrowEvent {
    pub borrower: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct RepayEvent {
    pub borrower: Pubkey,
    pub principal: u64,
    pub interest: u64,
    pub timestamp: i64,
}

#[event]
pub struct BadDebtWrittenOffEvent {
    pub borrower: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

// ========== Reputation Events ==========

#[event]
pub struct ScoreUpdatedEvent {
    pub user: Pubkey,
    pub old_score: u64,
    pub new_score: u64,
    pub is_increase: bool,
    pub reason: String,
    pub timestamp: i64,
}

#[event]
pub struct TierChangedEvent {
    pub user: Pubkey,
    pub old_tier: u8,
    pub new_tier: u8,
    pub timestamp: i64,
}

#[event]
pub struct UserInitializedEvent {
    pub user: Pubkey,
    pub initial_score: u64,
    pub initial_tier: u8,
    pub timestamp: i64,
}

#[event]
pub struct DefaultRecordedEvent {
    pub user: Pubkey,
    pub debt_amount: u64,
    pub penalty_applied: u64,
    pub timestamp: i64,
}

// ========== Admin Events ==========

#[event]
pub struct PausedEvent {
    pub admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct UnpausedEvent {
    pub admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct AdminTransferInitiatedEvent {
    pub current_admin: Pubkey,
    pub pending_admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct AdminTransferCompletedEvent {
    pub old_admin: Pubkey,
    pub new_admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct AdminTransferCancelledEvent {
    pub admin: Pubkey,
    pub cancelled_pending_admin: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct ParametersUpdatedEvent {
    pub fixed_interest_rate: u64,
    pub reputation_threshold: u64,
    pub credit_increase_multiplier: u64,
    pub timestamp: i64,
}

#[event]
pub struct ReputationParametersUpdatedEvent {
    pub on_time_bonus: u64,
    pub late_payment_penalty: u64,
    pub default_penalty: u64,
    pub max_score_change: u64,
    pub timestamp: i64,
}
