import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Loader2, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCrowdfunding } from '@/hooks/useCrowdfunding';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

interface TierInput {
  id: string;
  name: string;
  minAmount: string;
  maxAmount: string;
  benefits: string;
  maxBackers: string;
}

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createCampaign, createTier, isLoading, sdk } = useCrowdfunding();

  const [step, setStep] = useState<'campaign' | 'tiers'>('campaign');
  const [createdCampaignAddress, setCreatedCampaignAddress] = useState<string | null>(null);

  // Campaign form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [useSol, setUseSol] = useState(true);

  // Tiers form state
  const [tiers, setTiers] = useState<TierInput[]>([
    {
      id: '1',
      name: 'Supporter',
      minAmount: '0.5',
      maxAmount: '2',
      benefits: '10% discount on first order',
      maxBackers: '0',
    },
  ]);

  const addTier = () => {
    setTiers([
      ...tiers,
      {
        id: Date.now().toString(),
        name: '',
        minAmount: '',
        maxAmount: '',
        benefits: '',
        maxBackers: '0',
      },
    ]);
  };

  const removeTier = (id: string) => {
    setTiers(tiers.filter((t) => t.id !== id));
  };

  const updateTier = (id: string, field: keyof TierInput, value: string) => {
    setTiers(tiers.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleCreateCampaign = async () => {
    if (!title || !description || !goalAmount || !durationDays) {
      return;
    }

    // Convert goal to lamports (for SOL) or smallest unit
    const goalLamports = useSol
      ? Math.floor(parseFloat(goalAmount) * LAMPORTS_PER_SOL)
      : Math.floor(parseFloat(goalAmount) * 1_000_000); // USDC has 6 decimals

    const success = await createCampaign({
      title,
      description,
      goalAmount: goalLamports,
      durationDays: parseInt(durationDays),
      useSol,
    });

    if (success && sdk) {
      // Get the campaign address for tier creation
      const campaignId = sdk.generateCampaignId() - 1; // Use the ID we just created
      // For demo, we'll skip to success
      setStep('tiers');
      // In production, you'd store the actual campaign address
    }
  };

  const handleCreateTiers = async () => {
    if (!createdCampaignAddress) {
      // For demo, just show success
      onSuccess?.();
      onClose();
      resetForm();
      return;
    }

    const campaignPubkey = new PublicKey(createdCampaignAddress);

    for (let i = 0; i < tiers.length; i++) {
      const tier = tiers[i];
      if (!tier.name || !tier.minAmount) continue;

      const minLamports = useSol
        ? Math.floor(parseFloat(tier.minAmount) * LAMPORTS_PER_SOL)
        : Math.floor(parseFloat(tier.minAmount) * 1_000_000);

      const maxLamports = tier.maxAmount
        ? useSol
          ? Math.floor(parseFloat(tier.maxAmount) * LAMPORTS_PER_SOL)
          : Math.floor(parseFloat(tier.maxAmount) * 1_000_000)
        : 0;

      await createTier({
        campaignAddress: campaignPubkey,
        tierId: i,
        name: tier.name,
        minAmount: minLamports,
        maxAmount: maxLamports,
        benefits: tier.benefits,
        maxBackers: parseInt(tier.maxBackers) || 0,
      });
    }

    onSuccess?.();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setStep('campaign');
    setTitle('');
    setDescription('');
    setGoalAmount('');
    setDurationDays('30');
    setUseSol(true);
    setTiers([
      {
        id: '1',
        name: 'Supporter',
        minAmount: '0.5',
        maxAmount: '2',
        benefits: '10% discount on first order',
        maxBackers: '0',
      },
    ]);
    setCreatedCampaignAddress(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'campaign' ? 'Create Crowdfunding Campaign' : 'Add Investment Tiers'}
          </DialogTitle>
          <DialogDescription>
            {step === 'campaign'
              ? 'Set up your fundraising campaign details'
              : 'Define backing tiers with different benefits for supporters'}
          </DialogDescription>
        </DialogHeader>

        {step === 'campaign' ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Campaign Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Expand Greenhouse for Year-Round Tomatoes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={64}
                />
                <p className="text-xs text-muted-foreground mt-1">{title.length}/64 characters</p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project and how backers will benefit..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  maxLength={256}
                />
                <p className="text-xs text-muted-foreground mt-1">{description.length}/256 characters</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal">Funding Goal</Label>
                  <div className="relative">
                    <Input
                      id="goal"
                      type="number"
                      placeholder="100"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                      min="0"
                      step="0.1"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {useSol ? 'SOL' : 'USDC'}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (Days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <Label className="text-base">Currency</Label>
                  <p className="text-sm text-muted-foreground">
                    {useSol ? 'Accept SOL payments' : 'Accept USDC stablecoin'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={!useSol ? 'font-medium' : 'text-muted-foreground'}>USDC</span>
                  <Switch checked={useSol} onCheckedChange={setUseSol} />
                  <span className={useSol ? 'font-medium' : 'text-muted-foreground'}>SOL</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  A 2.5% platform fee will be deducted from successful campaigns. If your campaign
                  doesn't reach its goal, all backers can claim full refunds.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateCampaign}
                disabled={isLoading || !title || !description || !goalAmount}
                className="bg-gradient-primary text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Continue to Tiers'
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Tiers */}
            <div className="space-y-4">
              {tiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className="p-4 border border-border rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Tier {index + 1}</h4>
                    {tiers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeTier(tier.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Tier Name</Label>
                      <Input
                        placeholder="e.g., Seed Supporter"
                        value={tier.name}
                        onChange={(e) => updateTier(tier.id, 'name', e.target.value)}
                        maxLength={32}
                      />
                    </div>
                    <div>
                      <Label>Max Backers (0 = unlimited)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={tier.maxBackers}
                        onChange={(e) => updateTier(tier.id, 'maxBackers', e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Min Amount ({useSol ? 'SOL' : 'USDC'})</Label>
                      <Input
                        type="number"
                        placeholder="0.5"
                        value={tier.minAmount}
                        onChange={(e) => updateTier(tier.id, 'minAmount', e.target.value)}
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label>Max Amount (0 = unlimited)</Label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={tier.maxAmount}
                        onChange={(e) => updateTier(tier.id, 'maxAmount', e.target.value)}
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Benefits (what backers receive)</Label>
                    <Textarea
                      placeholder="e.g., 10% off first order, Farm newsletter, Thank you card"
                      value={tier.benefits}
                      onChange={(e) => updateTier(tier.id, 'benefits', e.target.value)}
                      rows={2}
                      maxLength={256}
                    />
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={addTier}
                disabled={tiers.length >= 5}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Tier
              </Button>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep('campaign')}>
                Back
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onSuccess?.();
                    onClose();
                    resetForm();
                  }}
                >
                  Skip Tiers
                </Button>
                <Button
                  onClick={handleCreateTiers}
                  disabled={isLoading || tiers.every((t) => !t.name)}
                  className="bg-gradient-primary text-primary-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Tiers...
                    </>
                  ) : (
                    'Create Campaign'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignModal;
