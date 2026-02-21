import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Target, Gift, Ticket, Leaf, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface CrowdfundTier {
  id: string;
  name: string;
  amount: number;
  currency: 'SOL' | 'USDC';
  description: string;
  benefits: string[];
  backers: number;
  limitedTo?: number;
}

export interface Campaign {
  id: string;
  title: string;
  farmName: string;
  farmerName: string;
  farmerAvatar: string;
  coverImage: string;
  description: string;
  goal: number;
  raised: number;
  currency: 'SOL' | 'USDC';
  backers: number;
  daysLeft: number;
  category: string;
  tiers: CrowdfundTier[];
  updates: number;
}

interface CrowdfundCardProps {
  campaign: Campaign;
  variant?: 'card' | 'featured';
}

const CrowdfundCard: React.FC<CrowdfundCardProps> = ({ campaign, variant = 'card' }) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const progress = (campaign.raised / campaign.goal) * 100;

  if (variant === 'featured') {
    return (
      <div className="farm-card overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Image Side */}
          <div className="relative h-64 lg:h-auto">
            <img
              src={campaign.coverImage}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent lg:bg-gradient-to-t" />
            
            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4 lg:hidden">
              <Badge className="bg-farm-gold text-farm-soil border-0 mb-2">
                {campaign.category}
              </Badge>
              <h2 className="text-2xl font-bold text-white">{campaign.title}</h2>
            </div>

            {/* Days Left Badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-warning" />
              <span className="font-semibold text-foreground">{campaign.daysLeft} days left</span>
            </div>
          </div>

          {/* Content Side */}
          <div className="p-6 lg:p-8">
            <div className="hidden lg:block">
              <Badge className="bg-farm-gold text-farm-soil border-0 mb-3">
                {campaign.category}
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-2">{campaign.title}</h2>
            </div>

            {/* Farmer Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={campaign.farmerAvatar}
                alt={campaign.farmerName}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
              />
              <div>
                <div className="font-medium text-foreground">{campaign.farmName}</div>
                <div className="text-sm text-muted-foreground">by {campaign.farmerName}</div>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">{campaign.description}</p>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <span className="text-3xl font-bold text-primary">{campaign.raised}</span>
                  <span className="text-muted-foreground"> {campaign.currency}</span>
                </div>
                <span className="text-muted-foreground">
                  of {campaign.goal} {campaign.currency} goal
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-secondary" />
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {campaign.backers} backers
                </span>
                <span>{Math.round(progress)}% funded</span>
              </div>
            </div>

            {/* Tiers Preview */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-foreground">Investment Tiers</h4>
              {campaign.tiers.slice(0, 2).map((tier) => (
                <div
                  key={tier.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTier === tier.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground">{tier.name}</span>
                    <span className="font-bold text-primary">
                      {tier.amount} {tier.currency}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {tier.backers} backers
                    </span>
                    {tier.limitedTo && (
                      <span className="flex items-center gap-1 text-warning">
                        <Ticket className="w-3 h-3" />
                        Limited: {tier.limitedTo - tier.backers} left
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full bg-gradient-primary text-primary-foreground py-6">
              <Gift className="w-5 h-5 mr-2" />
              Back This Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="farm-card overflow-hidden group"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.coverImage}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-farm-gold text-farm-soil border-0">
            {campaign.category}
          </Badge>
        </div>

        {/* Days Left */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-foreground flex items-center gap-1">
          <Clock className="w-3 h-3 text-warning" />
          {campaign.daysLeft}d left
        </div>

        {/* Farmer Avatar */}
        <div className="absolute -bottom-6 left-4">
          <img
            src={campaign.farmerAvatar}
            alt={campaign.farmerName}
            className="w-12 h-12 rounded-full object-cover border-4 border-card shadow-farm-md"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-8">
        <div className="mb-1">
          <span className="text-xs text-muted-foreground">{campaign.farmName}</span>
        </div>
        <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2">
          {campaign.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <Progress value={progress} className="h-2 bg-secondary" />
          <div className="flex items-center justify-between mt-2 text-sm">
            <div>
              <span className="font-bold text-primary">{campaign.raised}</span>
              <span className="text-muted-foreground"> / {campaign.goal} {campaign.currency}</span>
            </div>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{campaign.backers} backers</span>
          </div>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground">
            Support
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CrowdfundCard;

// Benefits Display Component
export const TierBenefits: React.FC<{ benefits: string[] }> = ({ benefits }) => (
  <div className="space-y-2">
    {benefits.map((benefit, index) => (
      <div key={index} className="flex items-start gap-2 text-sm">
        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
        <span className="text-muted-foreground">{benefit}</span>
      </div>
    ))}
  </div>
);
