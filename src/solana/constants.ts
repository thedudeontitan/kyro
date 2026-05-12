import { PublicKey } from "@solana/web3.js";

export const KYRO_PROGRAM_ID = new PublicKey(
  "2YTxz5iVKX6SspwxvhK67rpp3o9TKfWLspW1U69AprtS"
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
// VITE_SOLANA_RPC_URL — main RPC (devnet for production, localnet for dev)
// VITE_SOLANA_LOCALNET_RPC — optional localnet RPC for deployed builds pointing to a local validator
export const SOLANA_RPC_URL =
  import.meta.env.VITE_SOLANA_RPC_URL || "http://localhost:8899";
export const SOLANA_LOCALNET_RPC =
  import.meta.env.VITE_SOLANA_LOCALNET_RPC || "";
