import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import type { Kyro } from "./idl/kyro";
import idl from "./idl/kyro.json";
import { KYRO_PROGRAM_ID } from "./constants";

export function useProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) return null;
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    return new Program<Kyro>(idl as Kyro, provider);
  }, [connection, wallet]);

  return { program, programId: KYRO_PROGRAM_ID };
}
