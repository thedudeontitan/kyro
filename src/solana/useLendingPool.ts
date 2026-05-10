import { useCallback, useEffect, useState } from "react";
import { useProgram } from "./useProgram";
import { getLendingPoolPda } from "./pda";
import { rawToUsdc } from "./utils";

export type PoolStats = {
  totalDeposited: number;
  totalBorrowed: number;
  availableLiquidity: number;
  utilizationRate: number;
  currentAPY: number;
  protocolFees: number;
  totalCollateral: number;
  totalRepaid: number;
};

export function useLendingPool() {
  const { program } = useProgram();
  const [poolStats, setPoolStats] = useState<PoolStats>({
    totalDeposited: 0,
    totalBorrowed: 0,
    availableLiquidity: 0,
    utilizationRate: 0,
    currentAPY: 12.5,
    protocolFees: 0,
    totalCollateral: 0,
    totalRepaid: 0,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!program) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [lendingPoolPda] = getLendingPoolPda();
      const state = await program.account.lendingPoolState.fetch(
        lendingPoolPda
      );

      const totalDeposited = rawToUsdc(state.totalDeposited.toNumber());
      const totalBorrowed = rawToUsdc(state.totalBorrowed.toNumber());
      const availableLiquidity = totalDeposited - totalBorrowed;
      const utilizationRate =
        totalDeposited > 0 ? (totalBorrowed / totalDeposited) * 100 : 0;

      setPoolStats({
        totalDeposited,
        totalBorrowed,
        availableLiquidity,
        utilizationRate,
        currentAPY: 12.5,
        protocolFees: rawToUsdc(state.protocolFeesCollected.toNumber()),
        totalCollateral: rawToUsdc(state.totalCollateral.toNumber()),
        totalRepaid: rawToUsdc(state.totalRepaid.toNumber()),
      });
    } catch (err) {
      console.error("Failed to fetch lending pool:", err);
    } finally {
      setLoading(false);
    }
  }, [program]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { poolStats, loading, refresh };
}
