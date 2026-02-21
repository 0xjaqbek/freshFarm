import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Calendar,
  Star,
  Package,
  Truck,
  Heart,
  Settings,
  Edit2,
  Camera,
  Wallet,
  Leaf,
  Award,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Customer Profile
export interface CustomerProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  location: string;
  coordinates: { lat: number; lng: number };
  joinedDate: string;
  walletAddress: string;
  totalOrders: number;
  totalSpent: number;
  currency: 'SOL' | 'USDC';
  favoriteFarms: number;
  investedCampaigns: number;
  investmentTotal: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  levelProgress: number;
}

// Farmer Profile
export interface FarmerProfile {
  id: string;
  name: string;
  farmName: string;
  avatar: string;
  coverImage: string;
  bio: string;
  email: string;
  location: string;
  coordinates: { lat: number; lng: number };
  joinedDate: string;
  walletAddress: string;
  isOrganic: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  currency: 'SOL' | 'USDC';
  followers: number;
  activeCampaigns: number;
  specialties: string[];
  certifications: string[];
}

interface CustomerProfileCardProps {
  profile: CustomerProfile;
}

interface FarmerProfileCardProps {
  profile: FarmerProfile;
  isOwner?: boolean;
}

const levelColors = {
  Bronze: 'from-amber-600 to-amber-800',
  Silver: 'from-gray-400 to-gray-600',
  Gold: 'from-yellow-400 to-yellow-600',
  Platinum: 'from-indigo-400 to-purple-600',
};

export const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({ profile }) => {
  return (
    <div className="farm-card overflow-hidden">
      {/* Header */}
      <div className="relative h-32 bg-gradient-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi0yNHYtMmgxMnpNMzYgMjR2MkgyNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        {/* Level Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${levelColors[profile.level]} text-white text-sm font-semibold flex items-center gap-1`}>
          <Award className="w-4 h-4" />
          {profile.level} Member
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-card shadow-farm-lg"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Edit Button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4"
        >
          <Edit2 className="w-4 h-4 mr-1" />
          Edit Profile
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 pt-16">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg mb-4">
          <Wallet className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm text-muted-foreground truncate flex-1">
            {profile.walletAddress.slice(0, 8)}...{profile.walletAddress.slice(-8)}
          </span>
          <Badge variant="outline" className="text-xs">Connected</Badge>
        </div>

        {/* Level Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Level Progress</span>
            <span className="text-sm text-muted-foreground">{profile.levelProgress}%</span>
          </div>
          <Progress value={profile.levelProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Spend 50 more {profile.currency} to reach {profile.level === 'Platinum' ? 'max level' : 'next level'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-secondary rounded-xl text-center">
            <ShoppingBag className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{profile.totalOrders}</div>
            <div className="text-xs text-muted-foreground">Total Orders</div>
          </div>
          <div className="p-4 bg-secondary rounded-xl text-center">
            <TrendingUp className="w-6 h-6 text-farm-gold mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{profile.totalSpent} {profile.currency}</div>
            <div className="text-xs text-muted-foreground">Total Spent</div>
          </div>
          <div className="p-4 bg-secondary rounded-xl text-center">
            <Heart className="w-6 h-6 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{profile.favoriteFarms}</div>
            <div className="text-xs text-muted-foreground">Favorite Farms</div>
          </div>
          <div className="p-4 bg-secondary rounded-xl text-center">
            <Users className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{profile.investedCampaigns}</div>
            <div className="text-xs text-muted-foreground">Campaigns Backed</div>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6 pt-4 border-t border-border">
          <Calendar className="w-4 h-4" />
          Member since {profile.joinedDate}
        </div>
      </div>
    </div>
  );
};

export const FarmerProfileCard: React.FC<FarmerProfileCardProps> = ({ profile, isOwner = false }) => {
  return (
    <div className="farm-card overflow-hidden">
      {/* Cover */}
      <div className="relative h-48">
        <img
          src={profile.coverImage}
          alt={profile.farmName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {profile.isOrganic && (
            <Badge className="bg-farm-green text-white border-0">
              <Leaf className="w-3 h-3 mr-1" />
              Certified Organic
            </Badge>
          )}
          {profile.isVerified && (
            <Badge className="bg-primary text-primary-foreground border-0">
              Verified Farmer
            </Badge>
          )}
        </div>

        {/* Edit Cover */}
        {isOwner && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4"
          >
            <Camera className="w-4 h-4 mr-1" />
            Edit Cover
          </Button>
        )}

        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-card shadow-farm-lg"
            />
            {isOwner && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Star className="w-4 h-4 text-farm-gold fill-farm-gold" />
          <span className="font-bold text-foreground">{profile.rating}</span>
          <span className="text-sm text-muted-foreground">({profile.reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-16">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{profile.farmName}</h2>
            <p className="text-muted-foreground">by {profile.name}</p>
          </div>
          {isOwner ? (
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          ) : (
            <Button className="bg-gradient-primary text-primary-foreground">
              <Heart className="w-4 h-4 mr-1" />
              Follow
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4" />
          {profile.location}
        </div>

        <p className="text-muted-foreground mb-4">{profile.bio}</p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.specialties.map((specialty, index) => (
            <Badge key={index} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-xl font-bold text-foreground">{profile.totalProducts}</div>
            <div className="text-xs text-muted-foreground">Products</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-xl font-bold text-foreground">{profile.totalSales}</div>
            <div className="text-xs text-muted-foreground">Sales</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-xl font-bold text-foreground">{profile.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-xl font-bold text-foreground">{profile.activeCampaigns}</div>
            <div className="text-xs text-muted-foreground">Campaigns</div>
          </div>
        </div>

        {/* Certifications */}
        {profile.certifications.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
              <Award className="w-4 h-4 text-farm-gold" />
              Certifications
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.certifications.map((cert, index) => (
                <Badge key={index} className="bg-farm-gold-light text-farm-brown border-0">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Member Since */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
          <Calendar className="w-4 h-4" />
          Farming since {profile.joinedDate}
        </div>
      </div>
    </div>
  );
};
