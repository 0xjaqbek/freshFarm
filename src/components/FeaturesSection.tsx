import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Sprout,
  Wallet,
  Shield,
  Users,
  Package,
  TrendingUp,
  Leaf,
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Find Local Farmers',
    description: 'Discover farms near you with our interactive map. Support your local agricultural community.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Sprout,
    title: 'Track From Seed',
    description: 'Follow your food\'s journey from planting to harvest. Complete transparency in every bite.',
    color: 'bg-farm-green-light text-farm-green',
  },
  {
    icon: Wallet,
    title: 'Pay with Crypto',
    description: 'Seamless payments with SOL, USDC, and other stablecoins. Instant, secure, borderless.',
    color: 'bg-farm-gold-light text-farm-brown',
  },
  {
    icon: Shield,
    title: 'Blockchain Verified',
    description: 'Every transaction and product origin recorded on Solana. Immutable proof of authenticity.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Users,
    title: 'Crowdfund Farms',
    description: 'Invest in farmers\' future harvests. Get exclusive benefits and discounted produce.',
    color: 'bg-farm-green-light text-farm-green',
  },
  {
    icon: Package,
    title: 'Order Tracking',
    description: 'Real-time updates from farm to your doorstep. Know exactly when your fresh produce arrives.',
    color: 'bg-farm-gold-light text-farm-brown',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-earth">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
          >
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Why FreshFarm?</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Farm-to-Table, <span className="text-gradient-primary">Reimagined</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Combining the freshness of local farming with the power of blockchain technology
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="farm-card p-6 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-primary rounded-2xl p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Verified Farmers', icon: Users },
              { value: '10,000+', label: 'Happy Customers', icon: TrendingUp },
              { value: '50K+', label: 'Products Delivered', icon: Package },
              { value: '$2M+', label: 'Farmer Earnings', icon: Wallet },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
