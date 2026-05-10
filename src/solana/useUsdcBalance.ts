import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useUsdcMint } from "./useUsdcMint";
import { rawToUsdc } from "./utils";

export function useUsdcBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { usdcMint } = useUsdcMint();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!publicKey || !usdcMint) {
      setBalance(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const ata = await getAssociatedTokenAddress(usdcMint, publicKey);
      const accountInfo = await connection.getTokenAccountBalance(ata);
      setBalance(rawToUsdc(Number(accountInfo.value.amount)));
    } catch {
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey, usdcMint]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { balance, loading, refresh };
}
