import { useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "./useProgram";
import { useUsdcMint } from "./useUsdcMint";
import { usdcToRaw } from "./utils";

export function useTransactions() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { usdcMint } = useUsdcMint();

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
        .rpc();

      return tx;
    },
    [program, publicKey, usdcMint]
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
        .rpc();

      return tx;
    },
    [program, publicKey, usdcMint]
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
        .rpc();

      return tx;
    },
    [program, publicKey, usdcMint]
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
        .rpc();

      return tx;
    },
    [program, publicKey, usdcMint]
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
        .rpc();

      return tx;
    },
    [program, publicKey, usdcMint]
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
        .rpc();

      return tx;
    },
    [program, publicKey, usdcMint]
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
        .rpc();

      return tx;
    },
    [program, publicKey, usdcMint]
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
