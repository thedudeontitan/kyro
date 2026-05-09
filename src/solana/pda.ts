import { PublicKey } from "@solana/web3.js";
import {
  KYRO_PROGRAM_ID,
  SEED_CREDIT_MANAGER,
  SEED_LENDING_POOL,
  SEED_LENDER_INFO,
  SEED_CREDIT_LINE,
  SEED_COLLATERAL_INFO,
  SEED_REPUTATION_DATA,
  SEED_POOL_VAULT,
  SEED_COLLATERAL_VAULT,
  SEED_PROTOCOL_FEES,
  SEED_REPUTATION_MANAGER,
} from "./constants";

export function getCreditManagerPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_CREDIT_MANAGER)],
    KYRO_PROGRAM_ID
  );
}

export function getLendingPoolPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_LENDING_POOL)],
    KYRO_PROGRAM_ID
  );
}

export function getLenderInfoPda(lender: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_LENDER_INFO), lender.toBuffer()],
    KYRO_PROGRAM_ID
  );
}

export function getCreditLinePda(borrower: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_CREDIT_LINE), borrower.toBuffer()],
    KYRO_PROGRAM_ID
  );
}

export function getCollateralInfoPda(borrower: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_COLLATERAL_INFO), borrower.toBuffer()],
    KYRO_PROGRAM_ID
  );
}

export function getReputationDataPda(user: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_REPUTATION_DATA), user.toBuffer()],
    KYRO_PROGRAM_ID
  );
}

export function getPoolVaultPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_POOL_VAULT)],
    KYRO_PROGRAM_ID
  );
}

export function getCollateralVaultPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_COLLATERAL_VAULT)],
    KYRO_PROGRAM_ID
  );
}

export function getProtocolFeesPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_PROTOCOL_FEES)],
    KYRO_PROGRAM_ID
  );
}

export function getReputationManagerPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEED_REPUTATION_MANAGER)],
    KYRO_PROGRAM_ID
  );
}
