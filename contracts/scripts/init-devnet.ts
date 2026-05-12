/**
 * Initialize the Kyro protocol.
 *
 * Localnet: creates a mock USDC mint and initializes the protocol.
 * Devnet:   uses the real Circle devnet USDC mint.
 *
 * Usage:
 *   npx ts-node scripts/init-devnet.ts [WALLET_TO_FUND] [AMOUNT_USDC]
 *
 * Environment:
 *   RPC_URL  — RPC endpoint (default: http://localhost:8899)
 *
 * Examples:
 *   npx ts-node scripts/init-devnet.ts                             # localnet init
 *   RPC_URL=https://api.devnet.solana.com npx ts-node scripts/init-devnet.ts   # devnet init
 *   npx ts-node scripts/init-devnet.ts 7xKX...abc 500              # init + mint 500 USDC (localnet only)
 */

import {
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import type { Kyro } from "../target/types/kyro";
import idl from "../target/idl/kyro.json";

const PROGRAM_ID = new PublicKey(
  "2YTxz5iVKX6SspwxvhK67rpp3o9TKfWLspW1U69AprtS"
);
const RPC_URL = process.env.RPC_URL || "http://localhost:8899";
const USDC_DECIMALS = 6;
const DEFAULT_FUND_AMOUNT = 10_000;

// Circle's official devnet USDC mint
const DEVNET_USDC_MINT = new PublicKey(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
);

function isDevnet(): boolean {
  return RPC_URL.includes("devnet");
}

async function main() {
  const args = process.argv.slice(2);
  const fundAddress = args[0] || null;
  const fundAmount = args[1] ? parseFloat(args[1]) : DEFAULT_FUND_AMOUNT;
  const network = isDevnet() ? "devnet" : "localnet";

  // Load admin keypair
  const keyPath = path.join(os.homedir(), ".config", "solana", "id.json");
  if (!fs.existsSync(keyPath)) {
    console.error("Keypair not found at", keyPath);
    process.exit(1);
  }
  const adminKey = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
  const adminKeypair = Keypair.fromSecretKey(Uint8Array.from(adminKey));

  const connection = new Connection(RPC_URL, "confirmed");
  const wallet = new Wallet(adminKeypair);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program<Kyro>(idl as any, provider);

  console.log("Network:", network);
  console.log("Admin:  ", adminKeypair.publicKey.toBase58());
  console.log("RPC:    ", RPC_URL);
  console.log();

  // Check if already initialized
  const [creditManagerPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("credit_manager")],
    PROGRAM_ID
  );
  const existing = await connection.getAccountInfo(creditManagerPda);
  if (existing) {
    console.log("Protocol is already initialized!");
    console.log("CreditManager PDA:", creditManagerPda.toBase58());

    const state = await program.account.creditManagerState.fetch(
      creditManagerPda
    );
    console.log("USDC Mint:", (state.usdcMint as PublicKey).toBase58());

    if (fundAddress && !isDevnet()) {
      await fundWallet(
        connection,
        adminKeypair,
        state.usdcMint as PublicKey,
        fundAddress,
        fundAmount
      );
    } else if (fundAddress && isDevnet()) {
      console.log("Skipping mint — use the USDC faucet on devnet.");
    }
    return;
  }

  // Determine USDC mint
  let usdcMint: PublicKey;

  if (isDevnet()) {
    // Use Circle's devnet USDC
    usdcMint = DEVNET_USDC_MINT;
    console.log("Using Circle devnet USDC mint:", usdcMint.toBase58());
  } else {
    // Create mock USDC mint for localnet
    console.log("Creating mock USDC mint...");
    usdcMint = await createMint(
      connection,
      adminKeypair,
      adminKeypair.publicKey,
      null,
      USDC_DECIMALS
    );
    console.log("Mock USDC Mint:", usdcMint.toBase58());
  }
  console.log();

  // Initialize the protocol
  console.log(`Initializing Kyro protocol on ${network}...`);
  const tx = await program.methods
    .initialize()
    .accounts({
      admin: adminKeypair.publicKey,
      usdcMint: usdcMint,
    } as any)
    .rpc();

  console.log("Initialize tx:", tx);
  console.log();
  console.log("Protocol initialized successfully!");
  console.log("CreditManager PDA:", creditManagerPda.toBase58());
  console.log("USDC Mint:        ", usdcMint.toBase58());
  console.log();

  // Fund wallet (localnet only — on devnet use the USDC faucet)
  if (fundAddress && !isDevnet()) {
    await fundWallet(connection, adminKeypair, usdcMint, fundAddress, fundAmount);
  } else if (fundAddress && isDevnet()) {
    console.log("Skipping mint — use the USDC faucet to fund wallets on devnet.");
  }
}

async function fundWallet(
  connection: Connection,
  admin: Keypair,
  usdcMint: PublicKey,
  recipientAddress: string,
  amount: number
) {
  let recipient: PublicKey;
  try {
    recipient = new PublicKey(recipientAddress);
  } catch {
    console.error("Invalid wallet address:", recipientAddress);
    return;
  }

  console.log(`Minting ${amount} USDC to ${recipient.toBase58()}...`);

  const recipientAta = await getOrCreateAssociatedTokenAccount(
    connection,
    admin,
    usdcMint,
    recipient
  );

  const rawAmount = BigInt(Math.round(amount * 10 ** USDC_DECIMALS));
  const sig = await mintTo(
    connection,
    admin,
    usdcMint,
    recipientAta.address,
    admin,
    rawAmount
  );

  console.log(`Minted ${amount} USDC. Tx: ${sig}`);
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
