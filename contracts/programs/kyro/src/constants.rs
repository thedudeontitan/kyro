/// PDA Seeds
pub const CREDIT_MANAGER_SEED: &[u8] = b"credit_manager";
pub const LENDING_POOL_SEED: &[u8] = b"lending_pool";
pub const REPUTATION_MANAGER_SEED: &[u8] = b"reputation_manager";
pub const CREDIT_LINE_SEED: &[u8] = b"credit_line";
pub const LENDER_INFO_SEED: &[u8] = b"lender_info";
pub const COLLATERAL_INFO_SEED: &[u8] = b"collateral_info";
pub const REPUTATION_SEED: &[u8] = b"reputation";
pub const POOL_VAULT_SEED: &[u8] = b"pool_vault";
pub const COLLATERAL_VAULT_SEED: &[u8] = b"collateral_vault";
pub const PROTOCOL_FEES_SEED: &[u8] = b"protocol_fees";

/// Interest & Fee Parameters
pub const BASIS_POINTS: u64 = 10_000;
pub const DEFAULT_INTEREST_RATE_BPS: u64 = 1_500; // 15% annual
pub const MAX_INTEREST_RATE_BPS: u64 = 5_000; // 50% max
pub const MIN_INTEREST_RATE_BPS: u64 = 100; // 1% min
pub const PROTOCOL_FEE_RATE_BPS: u64 = 1_000; // 10% of interest
pub const SECONDS_PER_YEAR: u64 = 31_536_000; // 365 * 24 * 60 * 60

/// Credit Parameters
pub const LIQUIDATION_THRESHOLD_BPS: u64 = 11_000; // 110% LTV
pub const DEFAULT_CREDIT_MULTIPLIER_BPS: u64 = 12_000; // 120%
pub const MAX_CREDIT_MULTIPLIER_BPS: u64 = 20_000; // 200%
pub const GRACE_PERIOD_SECONDS: i64 = 2_592_000; // 30 days
pub const REPAYMENT_WINDOW_SECONDS: i64 = 2_592_000; // 30 days

/// Minimum Amounts (6 decimal USDC)
pub const MIN_COLLATERAL_AMOUNT: u64 = 1_000_000; // 1 USDC
pub const MIN_BORROW_AMOUNT: u64 = 100_000; // 0.1 USDC
pub const MIN_DEPOSIT_AMOUNT: u64 = 1_000_000; // 1 USDC

/// Interest Accumulator Precision (1e12)
pub const PRECISION: u128 = 1_000_000_000_000;

/// Reputation Parameters
pub const DEFAULT_REPUTATION_SCORE: u64 = 500;
pub const MAX_REPUTATION_SCORE: u64 = 1_000;
pub const MIN_REPUTATION_SCORE: u64 = 0;
pub const DEFAULT_ON_TIME_BONUS: u64 = 20;
pub const DEFAULT_LATE_PENALTY: u64 = 15;
pub const DEFAULT_DEFAULT_PENALTY: u64 = 50;
pub const DEFAULT_MAX_SCORE_CHANGE: u64 = 100;
pub const DEFAULT_REPUTATION_THRESHOLD: u64 = 750;

/// Reputation Tiers
pub const SILVER_THRESHOLD: u64 = 300;
pub const GOLD_THRESHOLD: u64 = 600;
pub const PLATINUM_THRESHOLD: u64 = 850;

pub const REPUTATION_TIER_BRONZE: u8 = 0;
pub const REPUTATION_TIER_SILVER: u8 = 1;
pub const REPUTATION_TIER_GOLD: u8 = 2;
pub const REPUTATION_TIER_PLATINUM: u8 = 3;

/// Large-debt threshold for doubled default penalty (10,000 USDC with 6 decimals)
pub const LARGE_DEBT_THRESHOLD: u64 = 10_000_000_000;
