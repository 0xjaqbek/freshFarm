import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MessagesChat from '@/components/MessagesChat';

const Messages = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-6 bg-gradient-earth">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Messages
            </h1>
            <p className="text-muted-foreground">
              Chat directly with farmers about your orders, products, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Messages */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MessagesChat />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Messages;
