import { useCallback } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { useUsdcMint } from "./useUsdcMint";
import { usdcToRaw } from "./utils";

export function useTransactions() {
  const { program } = useProgram();
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { usdcMint } = useUsdcMint();

  const prepareAndSend = useCallback(
    async (tx: Transaction) => {
      if (!publicKey || !signTransaction)
        throw new Error("Wallet not connected");

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signed = await signTransaction(tx);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );
      return signature;
    },
    [publicKey, signTransaction, connection]
  );

  const deposit = useCallback(
    async (amount: number) => {
      if (!program || !publicKey || !usdcMint)
        throw new Error("Wallet not connected");

      const lenderTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        publicKey
      );

      const tx = await program.methods
        .deposit(usdcToRaw(amount))
        .accounts({
          lender: publicKey,
          usdcMint,
          lenderTokenAccount,
        })
        .transaction();

      return prepareAndSend(tx);
    },
    [program, publicKey, usdcMint, prepareAndSend]
  );

  const withdraw = useCallback(
    async (amount: number) => {
      if (!program || !publicKey || !usdcMint)
        throw new Error("Wallet not connected");

      const lenderTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        publicKey
      );

      const tx = await program.methods
        .withdraw(usdcToRaw(amount))
        .accounts({
          lender: publicKey,
          usdcMint,
          lenderTokenAccount,
        })
        .transaction();

      return prepareAndSend(tx);
    },
    [program, publicKey, usdcMint, prepareAndSend]
  );

  const openCreditLine = useCallback(
    async (collateralAmount: number) => {
      if (!program || !publicKey || !usdcMint)
        throw new Error("Wallet not connected");

      const borrowerTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        publicKey
      );

      const tx = await program.methods
        .openCreditLine(usdcToRaw(collateralAmount))
        .accounts({
          borrower: publicKey,
          usdcMint,
          borrowerTokenAccount,
        })
        .transaction();

      return prepareAndSend(tx);
    },
    [program, publicKey, usdcMint, prepareAndSend]
  );

  const addCollateral = useCallback(
    async (amount: number) => {
      if (!program || !publicKey || !usdcMint)
        throw new Error("Wallet not connected");

      const borrowerTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        publicKey
      );

      const tx = await program.methods
        .addCollateral(usdcToRaw(amount))
        .accounts({
          borrower: publicKey,
          usdcMint,
          borrowerTokenAccount,
        })
        .transaction();

      return prepareAndSend(tx);
    },
    [program, publicKey, usdcMint, prepareAndSend]
  );

  const borrowAndPay = useCallback(
    async (recipient: PublicKey, amount: number) => {
      if (!program || !publicKey || !usdcMint)
        throw new Error("Wallet not connected");

      const recipientTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        recipient
      );

      const tx = await program.methods
        .borrowAndPay(recipient, usdcToRaw(amount))
        .accounts({
          borrower: publicKey,
          usdcMint,
          recipientTokenAccount,
        })
        .transaction();

      return prepareAndSend(tx);
    },
    [program, publicKey, usdcMint, prepareAndSend]
  );

  const repay = useCallback(
    async (principalAmount: number, interestAmount: number) => {
      if (!program || !publicKey || !usdcMint)
        throw new Error("Wallet not connected");

      const borrowerTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        publicKey
      );

      const tx = await program.methods
        .repay(usdcToRaw(principalAmount), usdcToRaw(interestAmount))
        .accounts({
          borrower: publicKey,
          usdcMint,
          borrowerTokenAccount,
        })
        .transaction();

      return prepareAndSend(tx);
    },
    [program, publicKey, usdcMint, prepareAndSend]
  );

  const withdrawCollateral = useCallback(
    async (amount: number) => {
      if (!program || !publicKey || !usdcMint)
        throw new Error("Wallet not connected");

      const borrowerTokenAccount = await getAssociatedTokenAddress(
        usdcMint,
        publicKey
      );

      const tx = await program.methods
        .withdrawCollateral(usdcToRaw(amount))
        .accounts({
          borrower: publicKey,
          usdcMint,
          borrowerTokenAccount,
        })
        .transaction();

      return prepareAndSend(tx);
    },
    [program, publicKey, usdcMint, prepareAndSend]
  );

  return {
    deposit,
    withdraw,
    openCreditLine,
    addCollateral,
    borrowAndPay,
    repay,
    withdrawCollateral,
  };
}
