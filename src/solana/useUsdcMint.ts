import { useEffect, useState } from "react";
import type { PublicKey } from "@solana/web3.js";
import { useProgram } from "./useProgram";
import { getCreditManagerPda } from "./pda";

export function useUsdcMint() {
  const { program } = useProgram();
  const [usdcMint, setUsdcMint] = useState<PublicKey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!program) {
      setLoading(false);
      return;
    }

    const fetchMint = async () => {
      try {
        const [creditManagerPda] = getCreditManagerPda();
        const state = await program.account.creditManagerState.fetch(
          creditManagerPda
        );
        setUsdcMint(state.usdcMint);
      } catch (err) {
        console.error("Failed to fetch USDC mint:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMint();
  }, [program]);

  return { usdcMint, loading };
}
