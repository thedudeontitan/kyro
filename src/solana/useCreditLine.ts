import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { getCreditLinePda, getCollateralInfoPda } from "./pda";
import { rawToUsdc } from "./utils";

export type CreditData = {
  creditLimit: number;
  borrowed: number;
  interestAccrued: number;
  availableCredit: number;
  collateral: number;
  isActive: boolean;
  repaymentDueDate: number;
  totalRepaid: number;
  currentDebt: number;
};

export function useCreditLine() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const [creditData, setCreditData] = useState<CreditData | null>(null);
  const [creditLineExists, setCreditLineExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!program || !publicKey) {
      setCreditData(null);
      setCreditLineExists(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [creditLinePda] = getCreditLinePda(publicKey);
      const [collateralInfoPda] = getCollateralInfoPda(publicKey);

      let creditLine;
      try {
        creditLine = await program.account.creditLine.fetch(creditLinePda);
      } catch {
        setCreditData(null);
        setCreditLineExists(false);
        setLoading(false);
        return;
      }

      let collateralAmount = 0;
      try {
        const collateralInfo = await program.account.collateralInfo.fetch(
          collateralInfoPda
        );
        collateralAmount = rawToUsdc(collateralInfo.depositedAmount.toNumber());
      } catch {
        // No collateral info yet
      }

      const borrowed = rawToUsdc(creditLine.borrowedAmount.toNumber());
      const interestAccrued = rawToUsdc(
        creditLine.interestAccrued.toNumber()
      );
      const currentDebt = borrowed + interestAccrued;
      const creditLimit = collateralAmount;
      const availableCredit = Math.max(creditLimit - borrowed, 0);

      setCreditLineExists(true);
      setCreditData({
        creditLimit,
        borrowed,
        interestAccrued,
        availableCredit,
        collateral: collateralAmount,
        isActive: creditLine.isActive,
        repaymentDueDate: creditLine.repaymentDueDate.toNumber(),
        totalRepaid: rawToUsdc(creditLine.totalRepaid.toNumber()),
        currentDebt,
      });
    } catch (err) {
      console.error("Failed to fetch credit line:", err);
      setCreditData(null);
      setCreditLineExists(false);
    } finally {
      setLoading(false);
    }
  }, [program, publicKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { creditData, creditLineExists, loading, refresh };
}
