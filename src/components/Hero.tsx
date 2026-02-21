import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Sprout, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-90" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      
      {/* Floating Elements */}
      <div className="absolute top-32 left-10 w-20 h-20 bg-farm-gold/20 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-farm-gold/30 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Sprout className="w-4 h-4 text-farm-gold" />
              <span className="text-white/90 text-sm font-medium">Farm to Table on Blockchain</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Fresh Produce,{' '}
              <span className="text-farm-gold">Directly</span> from
              <br />
              Local Farmers
            </h1>

            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Connect with local farmers, track your food's journey from seed to harvest,
              and pay securely with Solana. Support sustainable farming with transparent blockchain technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/marketplace">
                <Button className="bg-farm-gold hover:bg-farm-gold/90 text-farm-soil px-8 py-6 text-lg font-semibold shadow-farm-gold">
                  Explore Marketplace
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/farmers">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Find Farmers Near You
                  <MapPin className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10"
            >
              {[
                { value: '500+', label: 'Local Farmers' },
                { value: '10K+', label: 'Happy Customers' },
                { value: '$2M+', label: 'Farmer Earnings' },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-farm-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Sprout className="w-6 h-6 text-farm-gold" />
                    </div>
                    <div className="text-white font-semibold">Track Growth</div>
                    <div className="text-white/60 text-sm">Seed to Harvest</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-primary-glow/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-primary-glow" />
                    </div>
                    <div className="text-white font-semibold">Find Local</div>
                    <div className="text-white/60 text-sm">Nearest Farms</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-farm-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-farm-gold" />
                    </div>
                    <div className="text-white font-semibold">Crowdfund</div>
                    <div className="text-white/60 text-sm">Support Farms</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="w-12 h-12 bg-primary-glow/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-primary-glow" />
                    </div>
                    <div className="text-white font-semibold">Secure Pay</div>
                    <div className="text-white/60 text-sm">SOL & USDC</div>
                  </div>
                </div>

                {/* Live Order Preview */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/80 text-sm">Live Order Tracking</span>
                    <span className="text-farm-gold text-xs font-medium">In Transit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-farm-green-light rounded-lg flex items-center justify-center text-2xl">
                      🥬
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Organic Lettuce</div>
                      <div className="text-white/60 text-sm">Green Valley Farm • 2.5 mi away</div>
                    </div>
                    <div className="text-right">
                      <div className="text-farm-gold font-semibold">12 USDC</div>
                      <div className="text-white/40 text-xs">~0.15 SOL</div>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-gold rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-farm-gold text-farm-soil px-4 py-2 rounded-full font-semibold text-sm shadow-farm-gold animate-bounce-gentle">
                100% Organic
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(45 33% 97%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
