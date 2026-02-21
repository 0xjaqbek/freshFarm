import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Workspace } from "../target/types/workspace";
import { expect } from "chai";
import {
  PublicKey,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";

describe("Farm Crowdfunding Platform", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Workspace as Program<Workspace>;

  let authority: Keypair;
  let farmer: Keypair;
  let backer1: Keypair;
  let backer2: Keypair;
  let treasury: Keypair;
  let configPDA: PublicKey;
  let campaignPDA: PublicKey;
  let vaultPDA: PublicKey;
  let tierPDA: PublicKey;
  let backingPDA: PublicKey;
  let currencyMint: PublicKey;

  const campaignId = new BN(1);
  const tierId = 0;
  const feeBps = 250; // 2.5%

  before(async () => {
    // Generate keypairs
    authority = Keypair.generate();
    farmer = Keypair.generate();
    backer1 = Keypair.generate();
    backer2 = Keypair.generate();
    treasury = Keypair.generate();

    // Fund all accounts with 100 SOL
    const accounts = [authority, farmer, backer1, backer2, treasury];
    for (const account of accounts) {
      const sig = await provider.connection.requestAirdrop(
        account.publicKey,
        100 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);
    }

    // Derive PDAs
    [configPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("config"), authority.publicKey.toBuffer()],
      program.programId
    );

    [campaignPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign"),
        farmer.publicKey.toBuffer(),
        campaignId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    [vaultPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("vault"),
        farmer.publicKey.toBuffer(),
        campaignId.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    // Create a mock currency mint for testing
    currencyMint = await createMint(
      provider.connection,
      authority,
      authority.publicKey,
      null,
      6
    );
  });

  describe("Initialize Platform", () => {
    it("should initialize platform config successfully", async () => {
      await program.methods
        .initializeConfig(feeBps)
        .accounts({
          config: configPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      const config = await program.account.config.fetch(configPDA);
      expect(config.authority.toString()).to.equal(authority.publicKey.toString());
      expect(config.feeBps).to.equal(feeBps);
      expect(config.totalCampaigns.toNumber()).to.equal(0);
      expect(config.totalRaised.toNumber()).to.equal(0);
      expect(config.isActive).to.be.true;
      expect(config.isPaused).to.be.false;
      expect(config.version).to.equal(1);
    });

    it("should fail to initialize with invalid fee (>10000)", async () => {
      const newAuthority = Keypair.generate();
      const sig = await provider.connection.requestAirdrop(
        newAuthority.publicKey,
        10 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);

      const [newConfigPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("config"), newAuthority.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .initializeConfig(10001)
          .accounts({
            config: newConfigPDA,
            authority: newAuthority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([newAuthority])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("InvalidFee");
      }
    });
  });

  describe("Create Campaign", () => {
    it("should create a campaign successfully", async () => {
      const title = "Organic Farm Expansion";
      const description = "Help us expand our organic vegetable farm to serve more families";
      const goalAmount = new BN(10 * LAMPORTS_PER_SOL);
      const durationDays = new BN(30);

      await program.methods
        .createCampaign(campaignId, title, description, goalAmount, durationDays)
        .accounts({
          config: configPDA,
          campaign: campaignPDA,
          vault: vaultPDA,
          currencyMint: currencyMint,
          farmer: farmer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([farmer])
        .rpc();

      const campaign = await program.account.campaign.fetch(campaignPDA);
      expect(campaign.farmer.toString()).to.equal(farmer.publicKey.toString());
      expect(campaign.campaignId.toNumber()).to.equal(1);
      expect(campaign.title).to.equal(title);
      expect(campaign.description).to.equal(description);
      expect(campaign.goalAmount.toNumber()).to.equal(10 * LAMPORTS_PER_SOL);
      expect(campaign.raisedAmount.toNumber()).to.equal(0);
      expect(campaign.isActive).to.be.true;
      expect(campaign.isFinalized).to.be.false;
      expect(campaign.backersCount.toNumber()).to.equal(0);
      expect(campaign.tiersCount).to.equal(0);

      const config = await program.account.config.fetch(configPDA);
      expect(config.totalCampaigns.toNumber()).to.equal(1);
    });

    it("should fail to create campaign with title too long", async () => {
      const newCampaignId = new BN(999);
      const longTitle = "A".repeat(65);

      const [newCampaignPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("campaign"),
          farmer.publicKey.toBuffer(),
          newCampaignId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const [newVaultPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vault"),
          farmer.publicKey.toBuffer(),
          newCampaignId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      try {
        await program.methods
          .createCampaign(newCampaignId, longTitle, "desc", new BN(1000000), new BN(30))
          .accounts({
            config: configPDA,
            campaign: newCampaignPDA,
            vault: newVaultPDA,
            currencyMint: currencyMint,
            farmer: farmer.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([farmer])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("TitleTooLong");
      }
    });

    it("should fail to create campaign with zero goal amount", async () => {
      const newCampaignId = new BN(998);

      const [newCampaignPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("campaign"),
          farmer.publicKey.toBuffer(),
          newCampaignId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const [newVaultPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vault"),
          farmer.publicKey.toBuffer(),
          newCampaignId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      try {
        await program.methods
          .createCampaign(newCampaignId, "Test", "desc", new BN(0), new BN(30))
          .accounts({
            config: configPDA,
            campaign: newCampaignPDA,
            vault: newVaultPDA,
            currencyMint: currencyMint,
            farmer: farmer.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([farmer])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("InvalidAmount");
      }
    });
  });

  describe("Create Tier", () => {
    it("should create a tier successfully", async () => {
      [tierPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("tier"), campaignPDA.toBuffer(), Buffer.from([tierId])],
        program.programId
      );

      const tierName = "Bronze Supporter";
      const minAmount = new BN(1 * LAMPORTS_PER_SOL);
      const maxAmount = new BN(5 * LAMPORTS_PER_SOL);
      const benefits = "Early access to farm produce, monthly newsletter";
      const maxBackers = 100;

      await program.methods
        .createTier(tierId, tierName, minAmount, maxAmount, benefits, maxBackers)
        .accounts({
          campaign: campaignPDA,
          tier: tierPDA,
          farmer: farmer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([farmer])
        .rpc();

      const tier = await program.account.campaignTier.fetch(tierPDA);
      expect(tier.campaign.toString()).to.equal(campaignPDA.toString());
      expect(tier.tierId).to.equal(tierId);
      expect(tier.name).to.equal(tierName);
      expect(tier.minAmount.toNumber()).to.equal(1 * LAMPORTS_PER_SOL);
      expect(tier.maxAmount.toNumber()).to.equal(5 * LAMPORTS_PER_SOL);
      expect(tier.benefits).to.equal(benefits);
      expect(tier.maxBackers).to.equal(maxBackers);
      expect(tier.currentBackers).to.equal(0);

      const campaign = await program.account.campaign.fetch(campaignPDA);
      expect(campaign.tiersCount).to.equal(1);
    });

    it("should fail to create tier with invalid range (max < min)", async () => {
      const newTierId = 99;
      const [newTierPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("tier"), campaignPDA.toBuffer(), Buffer.from([newTierId])],
        program.programId
      );

      try {
        await program.methods
          .createTier(
            newTierId,
            "Invalid Tier",
            new BN(5 * LAMPORTS_PER_SOL),
            new BN(1 * LAMPORTS_PER_SOL), // max < min
            "Benefits",
            100
          )
          .accounts({
            campaign: campaignPDA,
            tier: newTierPDA,
            farmer: farmer.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([farmer])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("InvalidTierRange");
      }
    });

    it("should fail to create tier by non-farmer", async () => {
      const newTierId = 98;
      const [newTierPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("tier"), campaignPDA.toBuffer(), Buffer.from([newTierId])],
        program.programId
      );

      try {
        await program.methods
          .createTier(
            newTierId,
            "Unauthorized Tier",
            new BN(1 * LAMPORTS_PER_SOL),
            new BN(5 * LAMPORTS_PER_SOL),
            "Benefits",
            100
          )
          .accounts({
            campaign: campaignPDA,
            tier: newTierPDA,
            farmer: backer1.publicKey, // Not the farmer
            systemProgram: SystemProgram.programId,
          })
          .signers([backer1])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("constraint");
      }
    });
  });

  describe("Back Campaign (SOL)", () => {
    it("should back campaign with SOL successfully", async () => {
      [backingPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("backing"), campaignPDA.toBuffer(), backer1.publicKey.toBuffer()],
        program.programId
      );

      const backAmount = new BN(2 * LAMPORTS_PER_SOL);
      const vaultBalanceBefore = await provider.connection.getBalance(vaultPDA);

      await program.methods
        .backCampaignSol(tierId, backAmount)
        .accounts({
          campaign: campaignPDA,
          tier: tierPDA,
          vault: vaultPDA,
          backing: backingPDA,
          backer: backer1.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([backer1])
        .rpc();

      const backing = await program.account.backing.fetch(backingPDA);
      expect(backing.backer.toString()).to.equal(backer1.publicKey.toString());
      expect(backing.campaign.toString()).to.equal(campaignPDA.toString());
      expect(backing.tierId).to.equal(tierId);
      expect(backing.amount.toNumber()).to.equal(2 * LAMPORTS_PER_SOL);
      expect(backing.isRefunded).to.be.false;

      const vaultBalanceAfter = await provider.connection.getBalance(vaultPDA);
      expect(vaultBalanceAfter - vaultBalanceBefore).to.equal(2 * LAMPORTS_PER_SOL);

      const campaign = await program.account.campaign.fetch(campaignPDA);
      expect(campaign.raisedAmount.toNumber()).to.equal(2 * LAMPORTS_PER_SOL);
      expect(campaign.backersCount.toNumber()).to.equal(1);

      const tier = await program.account.campaignTier.fetch(tierPDA);
      expect(tier.currentBackers).to.equal(1);
    });

    it("should fail to back with amount below minimum", async () => {
      const [newBackingPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("backing"), campaignPDA.toBuffer(), backer2.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .backCampaignSol(tierId, new BN(0.5 * LAMPORTS_PER_SOL)) // Below min of 1 SOL
          .accounts({
            campaign: campaignPDA,
            tier: tierPDA,
            vault: vaultPDA,
            backing: newBackingPDA,
            backer: backer2.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([backer2])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("AmountBelowMinimum");
      }
    });

    it("should fail to back with amount above maximum", async () => {
      const [newBackingPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("backing"), campaignPDA.toBuffer(), backer2.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .backCampaignSol(tierId, new BN(10 * LAMPORTS_PER_SOL)) // Above max of 5 SOL
          .accounts({
            campaign: campaignPDA,
            tier: tierPDA,
            vault: vaultPDA,
            backing: newBackingPDA,
            backer: backer2.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([backer2])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("AmountAboveMaximum");
      }
    });

    it("should allow second backer to back campaign", async () => {
      const [backer2BackingPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("backing"), campaignPDA.toBuffer(), backer2.publicKey.toBuffer()],
        program.programId
      );

      const backAmount = new BN(3 * LAMPORTS_PER_SOL);

      await program.methods
        .backCampaignSol(tierId, backAmount)
        .accounts({
          campaign: campaignPDA,
          tier: tierPDA,
          vault: vaultPDA,
          backing: backer2BackingPDA,
          backer: backer2.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([backer2])
        .rpc();

      const campaign = await program.account.campaign.fetch(campaignPDA);
      expect(campaign.raisedAmount.toNumber()).to.equal(5 * LAMPORTS_PER_SOL);
      expect(campaign.backersCount.toNumber()).to.equal(2);

      const tier = await program.account.campaignTier.fetch(tierPDA);
      expect(tier.currentBackers).to.equal(2);
    });
  });

  describe("Finalize Campaign", () => {
    it("should fail to finalize campaign before end time", async () => {
      try {
        await program.methods
          .finalizeCampaign()
          .accounts({
            campaign: campaignPDA,
            authority: authority.publicKey,
          })
          .signers([authority])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("CampaignNotEnded");
      }
    });
  });

  describe("Create Second Campaign for Refund Testing", () => {
    let failedCampaignPDA: PublicKey;
    let failedVaultPDA: PublicKey;
    let failedTierPDA: PublicKey;
    let failedBackingPDA: PublicKey;
    const failedCampaignId = new BN(2);

    before(async () => {
      [failedCampaignPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("campaign"),
          farmer.publicKey.toBuffer(),
          failedCampaignId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      [failedVaultPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vault"),
          farmer.publicKey.toBuffer(),
          failedCampaignId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );
    });

    it("should create a campaign that will fail to reach goal", async () => {
      const title = "Failed Campaign Test";
      const description = "This campaign will not reach its goal";
      const goalAmount = new BN(100 * LAMPORTS_PER_SOL); // Very high goal
      const durationDays = new BN(1); // Short duration

      await program.methods
        .createCampaign(failedCampaignId, title, description, goalAmount, durationDays)
        .accounts({
          config: configPDA,
          campaign: failedCampaignPDA,
          vault: failedVaultPDA,
          currencyMint: currencyMint,
          farmer: farmer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([farmer])
        .rpc();

      const campaign = await program.account.campaign.fetch(failedCampaignPDA);
      expect(campaign.isActive).to.be.true;
    });

    it("should create tier for failed campaign", async () => {
      [failedTierPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("tier"), failedCampaignPDA.toBuffer(), Buffer.from([0])],
        program.programId
      );

      await program.methods
        .createTier(
          0,
          "Basic Tier",
          new BN(1 * LAMPORTS_PER_SOL),
          new BN(0), // Unlimited max
          "Basic benefits",
          0 // Unlimited backers
        )
        .accounts({
          campaign: failedCampaignPDA,
          tier: failedTierPDA,
          farmer: farmer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([farmer])
        .rpc();
    });

    it("should back the failed campaign", async () => {
      [failedBackingPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("backing"), failedCampaignPDA.toBuffer(), backer1.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .backCampaignSol(0, new BN(5 * LAMPORTS_PER_SOL))
        .accounts({
          campaign: failedCampaignPDA,
          tier: failedTierPDA,
          vault: failedVaultPDA,
          backing: failedBackingPDA,
          backer: backer1.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([backer1])
        .rpc();

      const campaign = await program.account.campaign.fetch(failedCampaignPDA);
      expect(campaign.raisedAmount.toNumber()).to.equal(5 * LAMPORTS_PER_SOL);
    });
  });

  describe("Additional Tier Tests", () => {
    it("should create tier with unlimited max amount (0)", async () => {
      const unlimitedTierId = 1;
      const [unlimitedTierPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("tier"), campaignPDA.toBuffer(), Buffer.from([unlimitedTierId])],
        program.programId
      );

      await program.methods
        .createTier(
          unlimitedTierId,
          "Gold Supporter",
          new BN(5 * LAMPORTS_PER_SOL),
          new BN(0), // Unlimited
          "Premium benefits, farm visits, exclusive produce",
          50
        )
        .accounts({
          campaign: campaignPDA,
          tier: unlimitedTierPDA,
          farmer: farmer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([farmer])
        .rpc();

      const tier = await program.account.campaignTier.fetch(unlimitedTierPDA);
      expect(tier.maxAmount.toNumber()).to.equal(0);
      expect(tier.name).to.equal("Gold Supporter");
    });

    it("should create tier with unlimited backers (0)", async () => {
      const unlimitedBackersTierId = 2;
      const [unlimitedBackersTierPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("tier"), campaignPDA.toBuffer(), Buffer.from([unlimitedBackersTierId])],
        program.programId
      );

      await program.methods
        .createTier(
          unlimitedBackersTierId,
          "Community Tier",
          new BN(0.1 * LAMPORTS_PER_SOL),
          new BN(1 * LAMPORTS_PER_SOL),
          "Community newsletter access",
          0 // Unlimited backers
        )
        .accounts({
          campaign: campaignPDA,
          tier: unlimitedBackersTierPDA,
          farmer: farmer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([farmer])
        .rpc();

      const tier = await program.account.campaignTier.fetch(unlimitedBackersTierPDA);
      expect(tier.maxBackers).to.equal(0);
    });
  });

  describe("Edge Cases", () => {
    it("should fail to create campaign with duration > 365 days", async () => {
      const newCampaignId = new BN(997);
      const [newCampaignPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("campaign"),
          farmer.publicKey.toBuffer(),
          newCampaignId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const [newVaultPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vault"),
          farmer.publicKey.toBuffer(),
          newCampaignId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      try {
        await program.methods
          .createCampaign(
            newCampaignId,
            "Long Campaign",
            "Description",
            new BN(1 * LAMPORTS_PER_SOL),
            new BN(366) // > 365 days
          )
          .accounts({
            config: configPDA,
            campaign: newCampaignPDA,
            vault: newVaultPDA,
            currencyMint: currencyMint,
            farmer: farmer.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([farmer])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("InvalidDuration");
      }
    });

    it("should fail to create tier with zero min amount", async () => {
      const zeroMinTierId = 97;
      const [zeroMinTierPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("tier"), campaignPDA.toBuffer(), Buffer.from([zeroMinTierId])],
        program.programId
      );

      try {
        await program.methods
          .createTier(
            zeroMinTierId,
            "Zero Min Tier",
            new BN(0), // Zero min amount
            new BN(5 * LAMPORTS_PER_SOL),
            "Benefits",
            100
          )
          .accounts({
            campaign: campaignPDA,
            tier: zeroMinTierPDA,
            farmer: farmer.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([farmer])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("InvalidAmount");
      }
    });

    it("should fail to create tier with name too long", async () => {
      const longNameTierId = 96;
      const [longNameTierPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("tier"), campaignPDA.toBuffer(), Buffer.from([longNameTierId])],
        program.programId
      );

      try {
        await program.methods
          .createTier(
            longNameTierId,
            "A".repeat(33), // > 32 chars
            new BN(1 * LAMPORTS_PER_SOL),
            new BN(5 * LAMPORTS_PER_SOL),
            "Benefits",
            100
          )
          .accounts({
            campaign: campaignPDA,
            tier: longNameTierPDA,
            farmer: farmer.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([farmer])
          .rpc();
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error.message).to.include("NameTooLong");
      }
    });
  });

  describe("Config Validation", () => {
    it("should verify config state after multiple campaigns", async () => {
      const config = await program.account.config.fetch(configPDA);
      expect(config.totalCampaigns.toNumber()).to.be.greaterThanOrEqual(2);
      expect(config.isActive).to.be.true;
      expect(config.isPaused).to.be.false;
    });
  });
});
