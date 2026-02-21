import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Clock, Users, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CrowdfundCard from '@/components/CrowdfundCard';
import CreateCampaignModal from '@/components/CreateCampaignModal';
import { useCrowdfunding } from '@/hooks/useCrowdfunding';
import { mockCampaigns } from '@/lib/mockData';

const categories = ['All', 'Infrastructure', 'Expansion', 'Sustainability', 'Equipment'];
const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'ending-soon', label: 'Ending Soon' },
  { value: 'most-funded', label: 'Most Funded' },
  { value: 'newest', label: 'Newest' },
  { value: 'most-backers', label: 'Most Backers' },
];

const Crowdfund = () => {
  const { connected } = useWallet();
  const { campaigns, isLoading, refreshCampaigns } = useCrowdfunding();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('trending');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.farmName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || campaign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalRaised = mockCampaigns.reduce((sum, c) => sum + c.raised, 0);
  const totalBackers = mockCampaigns.reduce((sum, c) => sum + c.backers, 0);
  const activeCampaigns = mockCampaigns.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Users className="w-4 h-4 text-farm-gold" />
              <span className="text-white/90 text-sm font-medium">Community Powered</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Invest in <span className="text-farm-gold">Local Farms</span>
            </h1>
            <p className="text-lg text-white/80">
              Support farmers' projects and get exclusive benefits like discounted produce, farm workshops, and first access to seasonal harvests.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-6 max-w-2xl"
          >
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="text-3xl font-bold text-white">${totalRaised.toLocaleString()}</div>
              <div className="text-white/60 text-sm">Total Raised</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="text-3xl font-bold text-white">{totalBackers}</div>
              <div className="text-white/60 text-sm">Total Backers</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="text-3xl font-bold text-white">{activeCampaigns}</div>
              <div className="text-white/60 text-sm">Active Campaigns</div>
            </div>
          </motion.div>

          {/* Create Campaign CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Button
              onClick={() => setShowCreateModal(true)}
              disabled={!connected}
              className="bg-farm-gold hover:bg-farm-gold/90 text-farm-soil px-6 py-3"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              {connected ? 'Start Your Campaign' : 'Connect Wallet to Create'}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          refreshCampaigns();
        }}
      />

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-40 bg-card/95 backdrop-blur-lg border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search campaigns or farms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? 'bg-gradient-primary text-primary-foreground shrink-0'
                      : 'shrink-0'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <TrendingUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-muted-foreground">
              {filteredCampaigns.length} campaigns found
            </span>
          </div>
        </div>
      </section>

      {/* Featured Campaign */}
      {filteredCampaigns.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Featured Campaign
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CrowdfundCard campaign={filteredCampaigns[0]} variant="featured" />
            </motion.div>
          </div>
        </section>
      )}

      {/* All Campaigns */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-foreground mb-4">All Campaigns</h2>
          {filteredCampaigns.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CrowdfundCard campaign={campaign} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            How Crowdfunding Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Choose a Campaign',
                description: 'Browse projects from local farmers and find one that resonates with you.',
              },
              {
                step: '02',
                title: 'Select a Tier',
                description: 'Pick a backing tier that fits your budget and get exclusive benefits.',
              },
              {
                step: '03',
                title: 'Enjoy Benefits',
                description: 'Receive discounts, free produce, farm tours, and more as the project succeeds.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Crowdfund;