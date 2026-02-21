import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import FarmerCard from '@/components/FarmerCard';
import ProductCard from '@/components/ProductCard';
import CrowdfundCard from '@/components/CrowdfundCard';
import Footer from '@/components/Footer';
import { mockFarmers, mockProducts, mockCampaigns } from '@/lib/mockData';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-foreground mb-2"
              >
                Fresh From the Farm
              </motion.h2>
              <p className="text-muted-foreground">
                Discover seasonal produce, track growth stages, and order with confidence
              </p>
            </div>
            <Link to="/marketplace">
              <Button variant="outline" className="hidden md:flex">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/marketplace">
              <Button className="bg-gradient-primary text-primary-foreground">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Farmers */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-foreground mb-2"
              >
                Meet Your Local Farmers
              </motion.h2>
              <p className="text-muted-foreground">
                Connect directly with verified farmers in your area
              </p>
            </div>
            <Link to="/farmers">
              <Button variant="outline" className="hidden md:flex">
                Find More Farmers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFarmers.slice(0, 3).map((farmer, index) => (
              <motion.div
                key={farmer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FarmerCard farmer={farmer} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/farmers">
              <Button className="bg-gradient-primary text-primary-foreground">
                Find More Farmers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Campaign */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-foreground mb-2"
              >
                Support Local Farmers
              </motion.h2>
              <p className="text-muted-foreground">
                Invest in farm projects and get exclusive benefits
              </p>
            </div>
            <Link to="/crowdfund">
              <Button variant="outline" className="hidden md:flex">
                Browse All Campaigns
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Featured Campaign */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <CrowdfundCard campaign={mockCampaigns[0]} variant="featured" />
          </motion.div>

          {/* Other Campaigns */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCampaigns.slice(1, 4).map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CrowdfundCard campaign={campaign} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/crowdfund">
              <Button className="bg-gradient-primary text-primary-foreground">
                Browse All Campaigns
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience Farm-Fresh?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join thousands of customers enjoying fresh, locally-sourced produce with full transparency from seed to table.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button className="bg-farm-gold hover:bg-farm-gold/90 text-farm-soil px-8 py-6 text-lg font-semibold">
                  Start Shopping
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/become-farmer">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Become a Farmer
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
