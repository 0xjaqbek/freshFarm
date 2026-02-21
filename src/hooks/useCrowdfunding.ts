import { useState, useCallback, useMemo, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import { 
  CrowdfundingSDK, 
  CampaignData, 
  TierData, 
  BackingData,
  CreateCampaignParams,
  CreateTierParams,
} from '@/lib/crowdfundingSDK';
import { useToast } from './use-toast';

export interface CampaignWithTiers {
  publicKey: PublicKey;
  account: CampaignData;
  tiers: Array<{ publicKey: PublicKey; account: TierData }>;
}

export const useCrowdfunding = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignWithTiers[]>([]);
  const [userBackings, setUserBackings] = useState<Array<{ publicKey: PublicKey; account: BackingData }>>([]);

  // Create provider and SDK
  const provider = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) return null;
    return new AnchorProvider(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      },
      { commitment: 'confirmed' }
    );
  }, [connection, wallet.publicKey, wallet.signTransaction, wallet.signAllTransactions]);

  const sdk = useMemo(() => {
    if (!provider) return null;
    return new CrowdfundingSDK(provider);
  }, [provider]);

  /**
   * Refresh all campaigns
   */
  const refreshCampaigns = useCallback(async () => {
    if (!sdk) return;

    setIsLoading(true);
    try {
      const result = await sdk.getActiveCampaigns();
      if (result.success && result.data) {
        // Fetch tiers for each campaign
        const campaignsWithTiers = await Promise.all(
          result.data.map(async (campaign) => {
            const tiersResult = await sdk.getCampaignTiers(campaign.publicKey);
            return {
              ...campaign,
              tiers: tiersResult.success ? tiersResult.data! : [],
            };
          })
        );
        setCampaigns(campaignsWithTiers);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sdk]);

  /**
   * Refresh user backings
   */
  const refreshUserBackings = useCallback(async () => {
    if (!sdk || !wallet.publicKey) return;

    try {
      const result = await sdk.getUserBackings(wallet.publicKey);
      if (result.success && result.data) {
        setUserBackings(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch backings:', error);
    }
  }, [sdk, wallet.publicKey]);

  // Auto-refresh on mount and wallet change
  useEffect(() => {
    if (sdk) {
      refreshCampaigns();
      refreshUserBackings();
    }
  }, [sdk, refreshCampaigns, refreshUserBackings]);

  /**
   * Create a new campaign
   */
  const createCampaign = useCallback(async (params: Omit<CreateCampaignParams, 'campaignId'>): Promise<boolean> => {
    if (!sdk) {
      toast({ title: 'Error', description: 'Please connect your wallet', variant: 'destructive' });
      return false;
    }

    setIsLoading(true);
    try {
      const campaignId = sdk.generateCampaignId();
      const result = await sdk.createCampaign({ ...params, campaignId });

      if (result.success) {
        toast({
          title: 'Campaign created!',
          description: `Campaign address: ${result.data!.campaignAddress.slice(0, 8)}...`,
        });
        await refreshCampaigns();
        return true;
      } else {
        toast({ title: 'Failed', description: result.error, variant: 'destructive' });
        return false;
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create campaign', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sdk, toast, refreshCampaigns]);

  /**
   * Create a tier for a campaign
   */
  const createTier = useCallback(async (params: CreateTierParams): Promise<boolean> => {
    if (!sdk) {
      toast({ title: 'Error', description: 'Please connect your wallet', variant: 'destructive' });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await sdk.createTier(params);

      if (result.success) {
        toast({
          title: 'Tier created!',
          description: `Tier "${params.name}" added successfully`,
        });
        await refreshCampaigns();
        return true;
      } else {
        toast({ title: 'Failed', description: result.error, variant: 'destructive' });
        return false;
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create tier', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sdk, toast, refreshCampaigns]);

  /**
   * Back a campaign with SOL
   */
  const backCampaignSol = useCallback(async (
    campaignAddress: PublicKey,
    tierAddress: PublicKey,
    tierId: number,
    amountSol: number
  ): Promise<boolean> => {
    if (!sdk) {
      toast({ title: 'Error', description: 'Please connect your wallet', variant: 'destructive' });
      return false;
    }

    setIsLoading(true);
    try {
      const amountLamports = Math.floor(amountSol * LAMPORTS_PER_SOL);
      const result = await sdk.backCampaignSol({
        campaignAddress,
        tierAddress,
        tierId,
        amount: amountLamports,
        useSol: true,
      });

      if (result.success) {
        toast({
          title: 'Successfully backed!',
          description: `You backed ${amountSol} SOL`,
        });
        await refreshCampaigns();
        await refreshUserBackings();
        return true;
      } else {
        toast({ title: 'Failed', description: result.error, variant: 'destructive' });
        return false;
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to back campaign', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sdk, toast, refreshCampaigns, refreshUserBackings]);

  /**
   * Finalize a campaign
   */
  const finalizeCampaign = useCallback(async (campaignAddress: PublicKey): Promise<boolean> => {
    if (!sdk) {
      toast({ title: 'Error', description: 'Please connect your wallet', variant: 'destructive' });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await sdk.finalizeCampaign(campaignAddress);

      if (result.success) {
        toast({ title: 'Campaign finalized!' });
        await refreshCampaigns();
        return true;
      } else {
        toast({ title: 'Failed', description: result.error, variant: 'destructive' });
        return false;
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to finalize campaign', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sdk, toast, refreshCampaigns]);

  /**
   * Withdraw funds from campaign
   */
  const withdrawFunds = useCallback(async (campaignAddress: PublicKey): Promise<boolean> => {
    if (!sdk) {
      toast({ title: 'Error', description: 'Please connect your wallet', variant: 'destructive' });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await sdk.withdrawFundsSol(campaignAddress);

      if (result.success) {
        toast({ title: 'Funds withdrawn successfully!' });
        await refreshCampaigns();
        return true;
      } else {
        toast({ title: 'Failed', description: result.error, variant: 'destructive' });
        return false;
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to withdraw funds', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sdk, toast, refreshCampaigns]);

  /**
   * Claim refund from failed campaign
   */
  const claimRefund = useCallback(async (campaignAddress: PublicKey): Promise<boolean> => {
    if (!sdk) {
      toast({ title: 'Error', description: 'Please connect your wallet', variant: 'destructive' });
      return false;
    }

    setIsLoading(true);
    try {
      const result = await sdk.claimRefundSol(campaignAddress);

      if (result.success) {
        toast({ title: 'Refund claimed successfully!' });
        await refreshUserBackings();
        return true;
      } else {
        toast({ title: 'Failed', description: result.error, variant: 'destructive' });
        return false;
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to claim refund', variant: 'destructive' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sdk, toast, refreshUserBackings]);

  /**
   * Get farmer's campaigns
   */
  const getFarmerCampaigns = useCallback(async (): Promise<CampaignWithTiers[]> => {
    if (!sdk || !wallet.publicKey) return [];

    try {
      const result = await sdk.getCampaignsByFarmer(wallet.publicKey);
      if (result.success && result.data) {
        const campaignsWithTiers = await Promise.all(
          result.data.map(async (campaign) => {
            const tiersResult = await sdk.getCampaignTiers(campaign.publicKey);
            return {
              ...campaign,
              tiers: tiersResult.success ? tiersResult.data! : [],
            };
          })
        );
        return campaignsWithTiers;
      }
    } catch (error) {
      console.error('Failed to fetch farmer campaigns:', error);
    }
    return [];
  }, [sdk, wallet.publicKey]);

  return {
    // State
    campaigns,
    userBackings,
    isLoading,
    isConnected: !!wallet.publicKey,
    sdk,

    // Actions
    createCampaign,
    createTier,
    backCampaignSol,
    finalizeCampaign,
    withdrawFunds,
    claimRefund,
    getFarmerCampaigns,
    refreshCampaigns,
    refreshUserBackings,
  };
};

export default useCrowdfunding;
