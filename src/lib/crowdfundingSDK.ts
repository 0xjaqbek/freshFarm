/**
 * Farm Crowdfunding Platform SDK
 * 
 * SDK for interacting with the Solana crowdfunding program.
 * Supports campaign creation, tier management, backing, and fund management.
 */

import { BN, Program, Provider } from "@coral-xyz/anchor";
import { 
  ASSOCIATED_TOKEN_PROGRAM_ID, 
  TOKEN_PROGRAM_ID, 
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { 
  LAMPORTS_PER_SOL, 
  PublicKey, 
  SystemProgram,
} from "@solana/web3.js";
import IDL from "../idl/crowdfundingIDL.json";
import { configAddress, CROWDFUNDING_PROGRAM_ID } from "./configAddress";

// Type Definitions
export interface ConfigData {
  bump: number;
  authority: PublicKey;
  feeBps: number;
  totalCampaigns: BN;
  totalRaised: BN;
  isActive: boolean;
  isPaused: boolean;
  version: number;
}

export interface CampaignData {
  bump: number;
  farmer: PublicKey;
  campaignId: BN;
  title: string;
  description: string;
  goalAmount: BN;
  raisedAmount: BN;
  currencyMint: PublicKey;
  startTime: BN;
  endTime: BN;
  isActive: boolean;
  isFinalized: boolean;
  backersCount: BN;
  tiersCount: number;
}

export interface TierData {
  bump: number;
  campaign: PublicKey;
  tierId: number;
  name: string;
  minAmount: BN;
  maxAmount: BN;
  benefits: string;
  maxBackers: number;
  currentBackers: number;
}

export interface BackingData {
  bump: number;
  backer: PublicKey;
  campaign: PublicKey;
  tierId: number;
  amount: BN;
  backedAt: BN;
  isRefunded: boolean;
}

// Parameter interfaces
export interface CreateCampaignParams {
  campaignId: number;
  title: string;
  description: string;
  goalAmount: number; // in lamports or token smallest unit
  durationDays: number;
  useSol: boolean; // true for SOL, false for token (USDC)
  currencyMint?: PublicKey; // required if useSol is false
}

export interface CreateTierParams {
  campaignAddress: PublicKey;
  tierId: number;
  name: string;
  minAmount: number;
  maxAmount: number; // 0 for unlimited
  benefits: string;
  maxBackers: number; // 0 for unlimited
}

export interface BackCampaignParams {
  campaignAddress: PublicKey;
  tierAddress: PublicKey;
  tierId: number;
  amount: number;
  useSol: boolean;
}

// Generic result wrapper
export interface SDKResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Main SDK class for the Farm Crowdfunding Platform
 */
export class CrowdfundingSDK {
  private readonly provider: Provider;
  private readonly program: Program<any>;
  private readonly configAddress: PublicKey | null;

  constructor(provider: Provider) {
    this.provider = provider;
    this.program = new Program(IDL as any, provider);
    this.configAddress = configAddress ? new PublicKey(configAddress) : null;
  }

  // Helper: Safe BN constructor
  private safeBN(value: any, defaultValue: number | string = 0): BN {
    if (value === null || value === undefined) {
      return new BN(defaultValue);
    }
    if (typeof value === 'number') {
      if (isNaN(value) || !isFinite(value)) {
        return new BN(defaultValue);
      }
      return new BN(Math.floor(value).toString());
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return new BN(defaultValue);
      try {
        return new BN(Math.floor(parseFloat(trimmed)).toString());
      } catch {
        return new BN(defaultValue);
      }
    }
    if (value instanceof BN) return value;
    return new BN(defaultValue);
  }

  // Helper: BN to number
  private safeBNToNumber(value: any, defaultValue: number = 0): number {
    try {
      return value && typeof value.toNumber === 'function' ? value.toNumber() : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  // Helper: BN to seed buffer
  private bnToSeedBuffer(value: BN, bytes: number = 8): Buffer {
    return value.toArrayLike(Buffer, "le", bytes);
  }

  // Helper: SOL conversions
  private solToLamports(sol: number): BN {
    return this.safeBN(Math.floor(sol * LAMPORTS_PER_SOL));
  }

  private lamportsToSol(lamports: BN): number {
    return this.safeBNToNumber(lamports, 0) / LAMPORTS_PER_SOL;
  }

  // Helper: Test RPC connection
  private async testConnection(): Promise<boolean> {
    try {
      if (!this.provider?.connection) return false;
      const { value } = await this.provider.connection.getLatestBlockhashAndContext('finalized');
      return !!(value && value.blockhash);
    } catch {
      return false;
    }
  }

  // Helper: Get PDA
  private getPDA(seeds: (string | PublicKey | Buffer | Uint8Array)[], programId?: PublicKey): [PublicKey, number] {
    const seedBuffers = seeds.map(seed => {
      if (typeof seed === 'string') return Buffer.from(seed, 'utf8');
      if (seed instanceof PublicKey) return seed.toBuffer();
      if (seed instanceof Uint8Array) return Buffer.from(seed);
      return seed;
    });
    return PublicKey.findProgramAddressSync(seedBuffers, programId || this.program.programId);
  }

  /**
   * Generate a unique campaign ID
   */
  generateCampaignId(): number {
    return Date.now();
  }

  /**
   * Get Config PDA
   */
  getConfigPDA(authority: PublicKey): [PublicKey, number] {
    return this.getPDA(["config", authority]);
  }

  /**
   * Get Campaign PDA
   */
  getCampaignPDA(farmer: PublicKey, campaignId: BN): [PublicKey, number] {
    return this.getPDA(["campaign", farmer, this.bnToSeedBuffer(campaignId, 8)]);
  }

  /**
   * Get Vault PDA (for SOL)
   */
  getVaultPDA(farmer: PublicKey, campaignId: BN): [PublicKey, number] {
    return this.getPDA(["vault", farmer, this.bnToSeedBuffer(campaignId, 8)]);
  }

  /**
   * Get Token Vault PDA
   */
  getTokenVaultPDA(farmer: PublicKey, campaignId: BN): [PublicKey, number] {
    return this.getPDA(["vault_token", farmer, this.bnToSeedBuffer(campaignId, 8)]);
  }

  /**
   * Get Tier PDA
   */
  getTierPDA(campaign: PublicKey, tierId: number): [PublicKey, number] {
    return this.getPDA(["tier", campaign, Buffer.from([tierId])]);
  }

  /**
   * Get Backing PDA
   */
  getBackingPDA(campaign: PublicKey, backer: PublicKey): [PublicKey, number] {
    return this.getPDA(["backing", campaign, backer]);
  }

  /**
   * Initialize Platform Config
   */
  async initializeConfig(feeBps: number): Promise<SDKResult<{ signature: string; configAddress: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };

    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const [configPDA] = this.getConfigPDA(this.provider.publicKey);

      const tx = await this.program.methods
        .initializeConfig(feeBps)
        .accounts({
          config: configPDA,
          authority: this.provider.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { 
        success: true, 
        data: { signature: tx, configAddress: configPDA.toString() } 
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Init failed" };
    }
  }

  /**
   * Create a new crowdfunding campaign
   */
  async createCampaign(params: CreateCampaignParams): Promise<SDKResult<{ signature: string; campaignAddress: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    if (!this.configAddress) return { success: false, error: "Platform not initialized" };

    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      if (!params.title?.trim()) return { success: false, error: "Title required" };
      if (params.goalAmount <= 0) return { success: false, error: "Goal must be > 0" };
      if (params.durationDays <= 0) return { success: false, error: "Duration must be > 0" };

      const campaignIdBN = this.safeBN(params.campaignId);
      const goalAmountBN = this.safeBN(params.goalAmount);
      
      const [campaignPDA] = this.getCampaignPDA(this.provider.publicKey, campaignIdBN);
      const [vaultPDA] = this.getVaultPDA(this.provider.publicKey, campaignIdBN);

      // Use system program pubkey for SOL, or actual mint for tokens
      const currencyMint = params.useSol 
        ? SystemProgram.programId 
        : (params.currencyMint || SystemProgram.programId);

      const tx = await this.program.methods
        .createCampaign(
          campaignIdBN,
          params.title.trim(),
          params.description.trim(),
          goalAmountBN,
          currencyMint,
          this.safeBN(params.durationDays)
        )
        .accounts({
          campaign: campaignPDA,
          vault: vaultPDA,
          farmer: this.provider.publicKey,
          config: this.configAddress,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { 
        success: true, 
        data: { signature: tx, campaignAddress: campaignPDA.toString() } 
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Campaign creation failed" };
    }
  }

  /**
   * Create a tier for a campaign
   */
  async createTier(params: CreateTierParams): Promise<SDKResult<{ signature: string; tierAddress: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };

    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      if (!params.name?.trim()) return { success: false, error: "Tier name required" };

      const [tierPDA] = this.getTierPDA(params.campaignAddress, params.tierId);

      const tx = await this.program.methods
        .createTier(
          params.tierId,
          params.name.trim(),
          this.safeBN(params.minAmount),
          this.safeBN(params.maxAmount),
          params.benefits.trim(),
          params.maxBackers
        )
        .accounts({
          campaign: params.campaignAddress,
          tier: tierPDA,
          farmer: this.provider.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { 
        success: true, 
        data: { signature: tx, tierAddress: tierPDA.toString() } 
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Tier creation failed" };
    }
  }

  /**
   * Back a campaign with SOL
   */
  async backCampaignSol(params: BackCampaignParams): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };

    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      if (params.amount <= 0) return { success: false, error: "Amount must be > 0" };

      // Fetch campaign to get farmer and campaign_id for PDA derivation
      const campaign = await this.program.account.campaign.fetch(params.campaignAddress);
      
      const [vaultPDA] = this.getVaultPDA(campaign.farmer, campaign.campaignId);
      const [backingPDA] = this.getBackingPDA(params.campaignAddress, this.provider.publicKey);

      const tx = await this.program.methods
        .backCampaignSol(params.tierId, this.safeBN(params.amount))
        .accounts({
          campaign: params.campaignAddress,
          tier: params.tierAddress,
          vault: vaultPDA,
          backing: backingPDA,
          backer: this.provider.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Backing failed" };
    }
  }

  /**
   * Back a campaign with SPL token (USDC)
   */
  async backCampaignToken(
    params: BackCampaignParams, 
    currencyMint: PublicKey
  ): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };

    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const campaign = await this.program.account.campaign.fetch(params.campaignAddress);
      
      const [vaultTokenPDA] = this.getTokenVaultPDA(campaign.farmer, campaign.campaignId);
      const [backingPDA] = this.getBackingPDA(params.campaignAddress, this.provider.publicKey);
      const backerToken = getAssociatedTokenAddressSync(currencyMint, this.provider.publicKey);

      const tx = await this.program.methods
        .backCampaignToken(params.tierId, this.safeBN(params.amount))
        .accounts({
          campaign: params.campaignAddress,
          tier: params.tierAddress,
          vaultToken: vaultTokenPDA,
          currencyMint: currencyMint,
          backerToken: backerToken,
          backing: backingPDA,
          backer: this.provider.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Backing failed" };
    }
  }

  /**
   * Finalize a campaign after it ends
   */
  async finalizeCampaign(campaignAddress: PublicKey): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    if (!this.configAddress) return { success: false, error: "Platform not initialized" };

    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const campaign = await this.program.account.campaign.fetch(campaignAddress);

      const tx = await this.program.methods
        .finalizeCampaign()
        .accounts({
          campaign: campaignAddress,
          config: this.configAddress,
          farmer: this.provider.publicKey,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Finalization failed" };
    }
  }

  /**
   * Withdraw funds from successful campaign (SOL)
   */
  async withdrawFundsSol(campaignAddress: PublicKey): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };
    if (!this.configAddress) return { success: false, error: "Platform not initialized" };

    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const campaign = await this.program.account.campaign.fetch(campaignAddress);
      const config = await this.program.account.config.fetch(this.configAddress);
      
      const [vaultPDA] = this.getVaultPDA(campaign.farmer, campaign.campaignId);

      const tx = await this.program.methods
        .withdrawFundsSol()
        .accounts({
          campaign: campaignAddress,
          vault: vaultPDA,
          config: this.configAddress,
          farmer: this.provider.publicKey,
          treasury: config.authority, // Platform treasury
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Withdrawal failed" };
    }
  }

  /**
   * Claim refund if campaign failed (SOL)
   */
  async claimRefundSol(campaignAddress: PublicKey): Promise<SDKResult<{ signature: string }>> {
    if (!this.provider.publicKey) return { success: false, error: "Wallet not connected" };

    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const campaign = await this.program.account.campaign.fetch(campaignAddress);
      
      const [vaultPDA] = this.getVaultPDA(campaign.farmer, campaign.campaignId);
      const [backingPDA] = this.getBackingPDA(campaignAddress, this.provider.publicKey);

      const tx = await this.program.methods
        .claimRefundSol()
        .accounts({
          campaign: campaignAddress,
          vault: vaultPDA,
          backing: backingPDA,
          backer: this.provider.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { success: true, data: { signature: tx } };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Refund claim failed" };
    }
  }

  /**
   * Fetch all campaigns
   */
  async getAllCampaigns(): Promise<SDKResult<Array<{ publicKey: PublicKey; account: CampaignData }>>> {
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const campaigns = await this.program.account.campaign.all();
      
      if (!campaigns?.length) return { success: true, data: [] };

      return {
        success: true,
        data: campaigns.map((c: any) => ({ publicKey: c.publicKey, account: c.account })),
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('Account does not exist')) {
        return { success: true, data: [] };
      }
      return { success: false, error: "Failed to fetch campaigns" };
    }
  }

  /**
   * Fetch active campaigns
   */
  async getActiveCampaigns(): Promise<SDKResult<Array<{ publicKey: PublicKey; account: CampaignData }>>> {
    const result = await this.getAllCampaigns();
    if (!result.success) return result;

    const activeCampaigns = result.data!.filter(
      (c) => c.account.isActive && !c.account.isFinalized
    );

    return { success: true, data: activeCampaigns };
  }

  /**
   * Fetch campaigns by farmer
   */
  async getCampaignsByFarmer(farmer?: PublicKey): Promise<SDKResult<Array<{ publicKey: PublicKey; account: CampaignData }>>> {
    const targetFarmer = farmer || this.provider.publicKey;
    if (!targetFarmer) return { success: false, error: "No farmer address" };

    const result = await this.getAllCampaigns();
    if (!result.success) return result;

    const farmerCampaigns = result.data!.filter(
      (c) => c.account.farmer.toString() === targetFarmer.toString()
    );

    return { success: true, data: farmerCampaigns };
  }

  /**
   * Fetch tiers for a campaign
   */
  async getCampaignTiers(campaignAddress: PublicKey): Promise<SDKResult<Array<{ publicKey: PublicKey; account: TierData }>>> {
    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const tiers = await this.program.account.campaignTier.all([
        { memcmp: { offset: 8 + 1, bytes: campaignAddress.toBase58() } }
      ]);

      if (!tiers?.length) return { success: true, data: [] };

      return {
        success: true,
        data: tiers.map((t: any) => ({ publicKey: t.publicKey, account: t.account })),
      };
    } catch (error) {
      return { success: true, data: [] };
    }
  }

  /**
   * Fetch user's backings
   */
  async getUserBackings(user?: PublicKey): Promise<SDKResult<Array<{ publicKey: PublicKey; account: BackingData }>>> {
    const targetUser = user || this.provider.publicKey;
    if (!targetUser) return { success: false, error: "No user address" };

    try {
      if (!(await this.testConnection())) return { success: false, error: "Network unavailable" };

      const backings = await this.program.account.backing.all([
        { memcmp: { offset: 8 + 1, bytes: targetUser.toBase58() } }
      ]);

      if (!backings?.length) return { success: true, data: [] };

      return {
        success: true,
        data: backings.map((b: any) => ({ publicKey: b.publicKey, account: b.account })),
      };
    } catch (error) {
      return { success: true, data: [] };
    }
  }

  /**
   * Fetch SOL balance
   */
  async fetchSolBalance(account?: PublicKey): Promise<SDKResult<number>> {
    const targetAccount = account || this.provider.publicKey;
    if (!targetAccount) return { success: false, error: "No account" };

    try {
      const balance = await this.provider.connection.getBalance(targetAccount);
      return { success: true, data: balance / LAMPORTS_PER_SOL };
    } catch {
      return { success: false, error: "Failed to fetch balance" };
    }
  }

  /**
   * Fetch token balance
   */
  async fetchTokenBalance(mint: PublicKey, account?: PublicKey): Promise<SDKResult<number>> {
    const targetAccount = account || this.provider.publicKey;
    if (!targetAccount) return { success: false, error: "No account" };

    try {
      const tokenAccount = getAssociatedTokenAddressSync(mint, targetAccount);
      const balance = await this.provider.connection.getTokenAccountBalance(tokenAccount);
      return { success: true, data: Number(balance.value.amount) };
    } catch {
      return { success: true, data: 0 };
    }
  }
}

export default CrowdfundingSDK;
