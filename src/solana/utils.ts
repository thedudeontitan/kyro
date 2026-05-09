import { BN } from "@coral-xyz/anchor";
import { USDC_MULTIPLIER } from "./constants";

export function usdcToRaw(amount: number): BN {
  return new BN(Math.round(amount * USDC_MULTIPLIER));
}

export function rawToUsdc(raw: BN | number): number {
  const val = typeof raw === "number" ? raw : raw.toNumber();
  return val / USDC_MULTIPLIER;
}

export function bnToNumber(bn: BN): number {
  return bn.toNumber();
}
