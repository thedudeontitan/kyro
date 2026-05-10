import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { getLenderInfoPda } from "./pda";
import { rawToUsdc } from "./utils";

export type LenderData = {
  depositedAmount: number;
  earnedInterest: number;
  depositTimestamp: number;
  lastUpdateTimestamp: number;
  apy: number;
};

export function useLenderInfo() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const [lenderData, setLenderData] = useState<LenderData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!program || !publicKey) {
      setLenderData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [lenderInfoPda] = getLenderInfoPda(publicKey);
      const state = await program.account.lenderInfo.fetch(lenderInfoPda);

      setLenderData({
        depositedAmount: rawToUsdc(state.depositedAmount.toNumber()),
        earnedInterest: rawToUsdc(state.earnedInterest.toNumber()),
        depositTimestamp: state.initialDepositTimestamp.toNumber(),
        lastUpdateTimestamp: state.lastDepositTimestamp.toNumber(),
        apy: 12.5,
      });
    } catch {
      setLenderData(null);
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { lenderData, loading, refresh };
}
