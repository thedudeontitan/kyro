use anchor_lang::prelude::*;

#[error_code]
pub enum KyroError {
    #[msg("Not authorized")]
    NotAuthorized,                    // 6000

    #[msg("Invalid amount")]
    InvalidAmount,                    // 6001

    #[msg("Credit line already exists")]
    CreditLineExists,                // 6002

    #[msg("Credit line not active")]
    CreditLineNotActive,             // 6003

    #[msg("Exceeds credit limit")]
    ExceedsCreditLimit,              // 6004

    #[msg("Insufficient liquidity")]
    InsufficientLiquidity,           // 6005

    #[msg("Exceeds borrowed amount")]
    ExceedsBorrowedAmount,           // 6006

    #[msg("Exceeds interest")]
    ExceedsInterest,                 // 6007

    #[msg("Liquidation not allowed")]
    LiquidationNotAllowed,           // 6008

    #[msg("Already initialized")]
    AlreadyInitialized,              // 6009

    #[msg("Invalid address")]
    InvalidAddress,                  // 6010

    #[msg("Pending admin not set")]
    PendingAdminNotSet,              // 6011

    #[msg("Not pending admin")]
    NotPendingAdmin,                 // 6012

    #[msg("Below minimum amount")]
    BelowMinimumAmount,              // 6013

    #[msg("No active debt")]
    NoActiveDebt,                    // 6014

    #[msg("Has outstanding debt")]
    HasOutstandingDebt,              // 6015

    #[msg("Invalid parameters")]
    InvalidParameters,               // 6016

    #[msg("Math overflow")]
    MathOverflow,                    // 6017

    #[msg("Insufficient balance")]
    InsufficientBalance,             // 6018

    #[msg("Protocol is paused")]
    Paused,                          // 6019

    #[msg("Collateral not found")]
    CollateralNotFound,              // 6020

    #[msg("Lender not found")]
    LenderNotFound,                  // 6021
}
