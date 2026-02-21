import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Twitter, Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-farm-soil text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Fresh<span className="text-farm-gold">Farm</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm mb-6">
              Connecting local farmers with conscious consumers. Track your food from seed to table with blockchain transparency.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Marketplace', href: '/marketplace' },
                { label: 'Find Farmers', href: '/farmers' },
                { label: 'Crowdfund', href: '/crowdfund' },
                { label: 'My Orders', href: '/orders' },
                { label: 'Become a Farmer', href: '/become-farmer' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-farm-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {[
                { label: 'Help Center', href: '/help' },
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'FAQs', href: '/faqs' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-farm-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-white/70 text-sm mb-4">
              Subscribe to get updates on new farms, seasonal produce, and exclusive offers.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="bg-farm-gold hover:bg-farm-gold/90 text-farm-soil shrink-0">
                <Mail className="w-4 h-4" />
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-farm-gold" />
                <span>San Francisco, CA 94102</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="w-4 h-4 text-farm-gold" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="w-4 h-4 text-farm-gold" />
                <span>hello@freshfarm.io</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              {currentYear} FreshFarm. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-2">
                Powered by
                <span className="text-farm-gold font-medium">Solana</span>
              </span>
              <span className="hidden sm:block">•</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Network Status: Healthy
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
