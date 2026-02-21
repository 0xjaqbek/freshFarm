import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Leaf, ShoppingBag, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Farmer {
  id: string;
  name: string;
  farmName: string;
  avatar: string;
  coverImage: string;
  location: string;
  distance: number;
  rating: number;
  reviewCount: number;
  products: number;
  specialties: string[];
  isOrganic: boolean;
  isVerified: boolean;
  totalSales: number;
  joinedDate: string;
}

interface FarmerCardProps {
  farmer: Farmer;
  variant?: 'default' | 'compact';
}

const FarmerCard: React.FC<FarmerCardProps> = ({ farmer, variant = 'default' }) => {
  if (variant === 'compact') {
    return (
      <Link to={`/farmer/${farmer.id}`}>
        <div className="farm-card p-4 flex items-center gap-4 hover:border-primary/30">
          <div className="relative">
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
            />
            {farmer.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{farmer.farmName}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{farmer.distance} mi away</span>
              <span className="text-primary">•</span>
              <Star className="w-3 h-3 text-farm-gold fill-farm-gold" />
              <span>{farmer.rating}</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </Link>
    );
  }

  return (
    <div className="farm-card overflow-hidden group">
      {/* Cover Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={farmer.coverImage}
          alt={farmer.farmName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {farmer.isOrganic && (
            <Badge className="bg-farm-green text-white border-0">
              <Leaf className="w-3 h-3 mr-1" />
              Organic
            </Badge>
          )}
          {farmer.isVerified && (
            <Badge className="bg-primary text-primary-foreground border-0">
              Verified
            </Badge>
          )}
        </div>

        {/* Distance */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3 text-primary" />
          {farmer.distance} mi
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-8 left-4">
          <img
            src={farmer.avatar}
            alt={farmer.name}
            className="w-16 h-16 rounded-xl object-cover border-4 border-card shadow-farm-md"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-foreground text-lg">{farmer.farmName}</h3>
            <p className="text-sm text-muted-foreground">{farmer.name}</p>
          </div>
          <div className="flex items-center gap-1 bg-farm-gold-light px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-farm-gold fill-farm-gold" />
            <span className="font-semibold text-farm-brown">{farmer.rating}</span>
            <span className="text-xs text-muted-foreground">({farmer.reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          {farmer.location}
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1 mb-4">
          {farmer.specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {farmer.specialties.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{farmer.specialties.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-sm">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{farmer.products}</span>
            <span className="text-muted-foreground">Products</span>
          </div>
          <Link to={`/farmer/${farmer.id}`}>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground">
              View Farm
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerCard;
