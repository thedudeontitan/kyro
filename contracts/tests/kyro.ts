import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Kyro } from "../target/types/kyro";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
} from "@solana/spl-token";
import { assert } from "chai";

describe("kyro", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Kyro as Program<Kyro>;
  const admin = provider.wallet as anchor.Wallet;

  let usdcMint: PublicKey;
  let adminTokenAccount: PublicKey;

  // PDAs
  let creditManagerPda: PublicKey;
  let lendingPoolPda: PublicKey;
  let reputationManagerPda: PublicKey;
  let poolVaultPda: PublicKey;
  let collateralVaultPda: PublicKey;
  let protocolFeesPda: PublicKey;

  before(async () => {
    // Create USDC mock mint
    usdcMint = await createMint(
      provider.connection,
      (admin as any).payer,
      admin.publicKey,
      null,
      6 // 6 decimals like USDC
    );

    // Create admin token account and mint some USDC
    adminTokenAccount = await createAccount(
      provider.connection,
      (admin as any).payer,
      usdcMint,
      admin.publicKey
    );

    await mintTo(
      provider.connection,
      (admin as any).payer,
      usdcMint,
      adminTokenAccount,
      admin.publicKey,
      1_000_000_000_000 // 1M USDC
    );

    // Derive PDAs
    [creditManagerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("credit_manager")],
      program.programId
    );

    [lendingPoolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("lending_pool")],
      program.programId
    );

    [reputationManagerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation_manager")],
      program.programId
    );

    [poolVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool_vault")],
      program.programId
    );

    [collateralVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("collateral_vault")],
      program.programId
    );

    [protocolFeesPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("protocol_fees")],
      program.programId
    );
  });

  it("Initializes the protocol", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        admin: admin.publicKey,
        creditManager: creditManagerPda,
        lendingPool: lendingPoolPda,
        reputationManager: reputationManagerPda,
        usdcMint: usdcMint,
        poolVault: poolVaultPda,
        collateralVault: collateralVaultPda,
        protocolFeesVault: protocolFeesPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("Initialize tx:", tx);

    // Verify credit manager state
    const creditManager = await program.account.creditManagerState.fetch(
      creditManagerPda
    );
    assert.ok(creditManager.admin.equals(admin.publicKey));
    assert.equal(creditManager.fixedInterestRate.toNumber(), 1500);
    assert.equal(creditManager.reputationThreshold.toNumber(), 750);
    assert.equal(creditManager.creditIncreaseMultiplier.toNumber(), 12000);
    assert.equal(creditManager.isPaused, false);

    // Verify lending pool state
    const lendingPool = await program.account.lendingPoolState.fetch(
      lendingPoolPda
    );
    assert.ok(lendingPool.admin.equals(admin.publicKey));
    assert.equal(lendingPool.totalDeposited.toNumber(), 0);
    assert.equal(lendingPool.totalBorrowed.toNumber(), 0);

    // Verify reputation manager state
    const repManager = await program.account.reputationManagerState.fetch(
      reputationManagerPda
    );
    assert.ok(repManager.admin.equals(admin.publicKey));
    assert.equal(repManager.onTimeBonus.toNumber(), 20);
    assert.equal(repManager.defaultPenalty.toNumber(), 50);
  });

  it("Can deposit into lending pool", async () => {
    const depositAmount = 100_000_000; // 100 USDC

    const [lenderInfoPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("lender_info"), admin.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .deposit(new anchor.BN(depositAmount))
      .accounts({
        lender: admin.publicKey,
        creditManager: creditManagerPda,
        lendingPool: lendingPoolPda,
        lenderInfo: lenderInfoPda,
        usdcMint: usdcMint,
        lenderTokenAccount: adminTokenAccount,
        poolVault: poolVaultPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Deposit tx:", tx);

    // Verify lending pool updated
    const lendingPool = await program.account.lendingPoolState.fetch(
      lendingPoolPda
    );
    assert.equal(lendingPool.totalDeposited.toNumber(), depositAmount);

    // Verify lender info
    const lenderInfo = await program.account.lenderInfo.fetch(lenderInfoPda);
    assert.equal(lenderInfo.depositedAmount.toNumber(), depositAmount);
  });
});
