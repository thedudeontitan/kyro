import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { getReputationDataPda } from "./pda";

export type ReputationInfo = {
  score: number;
  tier: number;
  onTimeRepayments: number;
  lateRepayments: number;
  defaults: number;
  totalRepayments: number;
};

export function useReputation() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const [reputationData, setReputationData] = useState<ReputationInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!program || !publicKey) {
      setReputationData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [reputationPda] = getReputationDataPda(publicKey);
      const state = await program.account.reputationData.fetch(reputationPda);

      setReputationData({
        score: state.score.toNumber(),
        tier: state.tier,
        onTimeRepayments: state.onTimeRepayments.toNumber(),
        lateRepayments: state.lateRepayments.toNumber(),
        defaults: state.defaults.toNumber(),
        totalRepayments: state.totalRepayments.toNumber(),
      });
    } catch {
      setReputationData(null);
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { reputationData, loading, refresh };
}
