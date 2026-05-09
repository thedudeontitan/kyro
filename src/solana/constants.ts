import { PublicKey } from "@solana/web3.js";

export const KYRO_PROGRAM_ID = new PublicKey(
  "ESVeXwXtP9jDv1JoGnfQcQwC3tnyEdXV5VsATqxyCCg3"
);

// PDA seed strings
export const SEED_CREDIT_MANAGER = "credit_manager";
export const SEED_LENDING_POOL = "lending_pool";
export const SEED_LENDER_INFO = "lender_info";
export const SEED_CREDIT_LINE = "credit_line";
export const SEED_COLLATERAL_INFO = "collateral_info";
export const SEED_REPUTATION_DATA = "reputation";
export const SEED_POOL_VAULT = "pool_vault";
export const SEED_COLLATERAL_VAULT = "collateral_vault";
export const SEED_PROTOCOL_FEES = "protocol_fees";
export const SEED_REPUTATION_MANAGER = "reputation_manager";

// USDC
export const USDC_DECIMALS = 6;
export const USDC_MULTIPLIER = 1_000_000;

// RPC
export const SOLANA_RPC_URL =
  import.meta.env.VITE_SOLANA_RPC_URL || "http://localhost:8899";
