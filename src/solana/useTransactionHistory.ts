import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { KYRO_PROGRAM_ID } from "./constants";

export type TransactionRecord = {
  type: string;
  amount: number;
  date: string;
  status: string;
  signature?: string;
};

const INSTRUCTION_TYPE_MAP: Record<string, string> = {
  OpenCreditLine: "credit_opened",
  Deposit: "deposit",
  Withdraw: "withdraw",
  Borrow: "borrow",
  BorrowAndPay: "payment",
  Repay: "repay",
  AddCollateral: "stake",
  WithdrawCollateral: "collateral_withdrawn",
};

export function useTransactionHistory() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!publicKey) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    try {
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 50,
      });

      if (signatures.length === 0) {
        setTransactions([]);
        return;
      }

      const txs = await connection.getParsedTransactions(
        signatures.map((s) => s.signature),
        { maxSupportedTransactionVersion: 0 }
      );

      const records: TransactionRecord[] = [];

      for (let i = 0; i < txs.length; i++) {
        const tx = txs[i];
        const sigInfo = signatures[i];
        if (!tx) continue;

        // Check if this transaction involves the Kyro program
        const hasKyroIx = tx.transaction.message.instructions.some(
          (ix) => "programId" in ix && ix.programId.equals(KYRO_PROGRAM_ID)
        );
        if (!hasKyroIx) continue;

        // Parse instruction type from Anchor logs
        let type = "unknown";
        if (tx.meta?.logMessages) {
          for (const log of tx.meta.logMessages) {
            const match = log.match(/Instruction: (\w+)/);
            if (match) {
              type = INSTRUCTION_TYPE_MAP[match[1]] || match[1].toLowerCase();
              break;
            }
          }
        }

        // Calculate amount from token balance changes
        let amount = 0;
        if (tx.meta?.preTokenBalances && tx.meta?.postTokenBalances) {
          for (const post of tx.meta.postTokenBalances) {
            const pre = tx.meta.preTokenBalances.find(
              (p) => p.accountIndex === post.accountIndex
            );
            if (pre) {
              const diff = Math.abs(
                (post.uiTokenAmount.uiAmount || 0) -
                  (pre.uiTokenAmount.uiAmount || 0)
              );
              if (diff > amount) amount = diff;
            }
          }
        }

        records.push({
          type,
          amount,
          date: sigInfo.blockTime
            ? new Date(sigInfo.blockTime * 1000).toLocaleString()
            : "Unknown",
          status: sigInfo.err ? "failed" : "completed",
          signature: sigInfo.signature,
        });
      }

      setTransactions(records);
    } catch (err) {
      console.error("Failed to fetch transaction history:", err);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { transactions, loading, refresh: fetchHistory };
}
