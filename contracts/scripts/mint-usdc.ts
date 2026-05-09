/**
 * Mint test USDC to a wallet on localnet.
 *
 * Usage:
 *   npx ts-node scripts/mint-usdc.ts <WALLET_ADDRESS> [AMOUNT_USDC]
 *
 * Examples:
 *   npx ts-node scripts/mint-usdc.ts 7xKX...abc          # mints 10,000 USDC
 *   npx ts-node scripts/mint-usdc.ts 7xKX...abc 500      # mints 500 USDC
 *
 * Prerequisites:
 *   - solana-test-validator running
 *   - anchor test --skip-local-validator already ran (protocol initialized)
 *   - ~/.config/solana/id.json is the same keypair used as admin during init
 */

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const PROGRAM_ID = new PublicKey(
  "ESVeXwXtP9jDv1JoGnfQcQwC3tnyEdXV5VsATqxyCCg3"
);
const USDC_DECIMALS = 6;
const DEFAULT_AMOUNT = 10_000; // 10,000 USDC
const RPC_URL = "http://localhost:8899";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      "Usage: npx ts-node scripts/mint-usdc.ts <WALLET_ADDRESS> [AMOUNT_USDC]"
    );
    process.exit(1);
  }

  const recipientAddress = args[0];
  const amount = args[1] ? parseFloat(args[1]) : DEFAULT_AMOUNT;

  // Validate recipient address
  let recipient: PublicKey;
  try {
    recipient = new PublicKey(recipientAddress);
  } catch {
    console.error("Invalid wallet address:", recipientAddress);
    process.exit(1);
  }

  // Load admin keypair from default Solana CLI config
  const keyPath = path.join(os.homedir(), ".config", "solana", "id.json");
  if (!fs.existsSync(keyPath)) {
    console.error("Admin keypair not found at", keyPath);
    console.error(
      "Make sure you have a Solana keypair configured (solana-keygen new)"
    );
    process.exit(1);
  }
  const adminKey = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
  const admin = Keypair.fromSecretKey(Uint8Array.from(adminKey));

  const connection = new Connection(RPC_URL, "confirmed");

  console.log("Admin:    ", admin.publicKey.toBase58());
  console.log("Recipient:", recipient.toBase58());
  console.log("Amount:   ", amount, "USDC");
  console.log();

  // Derive CreditManager PDA and read usdcMint from on-chain state
  const [creditManagerPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("credit_manager")],
    PROGRAM_ID
  );

  console.log("Fetching USDC mint from CreditManager PDA...");
  const accountInfo = await connection.getAccountInfo(creditManagerPda);
  if (!accountInfo) {
    console.error(
      "CreditManager account not found. Has the protocol been initialized?"
    );
    console.error(
      "Run: cd contracts && anchor test --skip-local-validator"
    );
    process.exit(1);
  }

  // CreditManagerState layout:
  //   8 bytes  discriminator
  //  32 bytes  admin (pubkey)
  //   1 byte   Option<Pubkey> tag for pending_admin
  //  [32 bytes pending_admin pubkey if tag == 1]
  //   8 bytes  fixed_interest_rate (u64)
  //   8 bytes  reputation_threshold (u64)
  //   8 bytes  credit_increase_multiplier (u64)
  //  32 bytes  usdc_mint (pubkey)
  //   1 byte   is_paused (bool)
  //   1 byte   bump (u8)
  const data = accountInfo.data;
  const pendingAdminTag = data[8 + 32]; // 0 = None, 1 = Some
  const pendingAdminSize = pendingAdminTag === 1 ? 32 : 0;
  const usdcMintOffset = 8 + 32 + 1 + pendingAdminSize + 8 + 8 + 8;
  const usdcMint = new PublicKey(data.subarray(usdcMintOffset, usdcMintOffset + 32));

  console.log("USDC Mint:", usdcMint.toBase58());
  console.log();

  // Create or get the recipient's Associated Token Account
  console.log("Creating/fetching recipient token account...");
  const recipientAta = await getOrCreateAssociatedTokenAccount(
    connection,
    admin,
    usdcMint,
    recipient
  );
  console.log("Recipient ATA:", recipientAta.address.toBase58());

  // Mint USDC
  const rawAmount = BigInt(Math.round(amount * 10 ** USDC_DECIMALS));
  console.log(`Minting ${amount} USDC (${rawAmount} raw)...`);

  const sig = await mintTo(
    connection,
    admin,
    usdcMint,
    recipientAta.address,
    admin, // admin is mint authority
    rawAmount
  );

  console.log();
  console.log("Done! Transaction:", sig);
  console.log(
    `${recipient.toBase58()} now has ${amount} USDC on localnet.`
  );
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
