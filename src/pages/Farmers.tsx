import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MapView from '@/components/MapView';
import FarmerCard from '@/components/FarmerCard';
import { mockFarmers } from '@/lib/mockData';

const Farmers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-earth">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find <span className="text-gradient-primary">Local Farmers</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover verified farmers in your area. Support local agriculture and get the freshest produce delivered to your door.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MapView farmers={mockFarmers} />
          </motion.div>
        </div>
      </section>

      {/* All Farmers */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">All Farmers</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockFarmers.map((farmer, index) => (
              <motion.div
                key={farmer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FarmerCard farmer={farmer} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Farmers;
