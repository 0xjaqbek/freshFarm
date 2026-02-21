import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Tractor, ShoppingBag, Heart, TrendingUp, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CustomerProfileCard, FarmerProfileCard } from '@/components/ProfileSection';
import FarmerCard from '@/components/FarmerCard';
import ProductCard from '@/components/ProductCard';
import OrderTracking from '@/components/OrderTracking';
import CrowdfundCard from '@/components/CrowdfundCard';
import {
  mockCustomerProfile,
  mockFarmerProfile,
  mockFarmers,
  mockProducts,
  mockOrders,
  mockCampaigns,
} from '@/lib/mockData';

const Profile = () => {
  const [profileType, setProfileType] = useState<'customer' | 'farmer'>('customer');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-6 bg-gradient-earth">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            {/* Profile Type Toggle */}
            <div className="inline-flex items-center p-1 bg-card rounded-xl border border-border">
              <button
                onClick={() => setProfileType('customer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  profileType === 'customer'
                    ? 'bg-gradient-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4" />
                Customer View
              </button>
              <button
                onClick={() => setProfileType('farmer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  profileType === 'farmer'
                    ? 'bg-gradient-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Tractor className="w-4 h-4" />
                Farmer View
              </button>
            </div>
            <span className="text-sm text-muted-foreground">
              (Demo: Switch between profile types)
            </span>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {profileType === 'customer' ? (
            <CustomerProfileView />
          ) : (
            <FarmerProfileView />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Customer Profile View
const CustomerProfileView = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Profile Card */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <CustomerProfileCard profile={mockCustomerProfile} />
        </motion.div>
      </div>

      {/* Tabs Content */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Recent Orders
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="w-4 h-4" />
              Favorite Farms
            </TabsTrigger>
            <TabsTrigger value="investments" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              My Investments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-0">
            <div className="space-y-4">
              {mockOrders.slice(0, 2).map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OrderTracking order={order} variant="compact" />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-0">
            <div className="grid sm:grid-cols-2 gap-4">
              {mockFarmers.slice(0, 4).map((farmer, index) => (
                <motion.div
                  key={farmer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FarmerCard farmer={farmer} variant="compact" />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="investments" className="mt-0">
            <div className="grid sm:grid-cols-2 gap-4">
              {mockCampaigns.slice(0, 2).map((campaign, index) => (
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Farmer Profile View
const FarmerProfileView = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Profile Card */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FarmerProfileCard profile={mockFarmerProfile} isOwner={true} />
        </motion.div>
      </div>

      {/* Tabs Content */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              My Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Orders Received
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-2">
              <Heart className="w-4 h-4" />
              My Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-0">
            <div className="grid sm:grid-cols-2 gap-4">
              {mockProducts
                .filter((p) => p.farmerId === '1')
                .map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <div className="space-y-4">
              {mockOrders.slice(0, 2).map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OrderTracking order={order} variant="compact" />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CrowdfundCard campaign={mockCampaigns[0]} variant="featured" />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
