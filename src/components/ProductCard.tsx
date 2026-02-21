import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { MapPin, Leaf, ShoppingCart, Eye, Clock, Sprout } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type GrowthStage = 'seed' | 'growing' | 'maturing' | 'harvest' | 'ready';

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  currency: 'SOL' | 'USDC';
  unit: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmerAvatar: string;
  distance: number;
  isOrganic: boolean;
  category: string;
  growthStage: GrowthStage;
  harvestDate?: string;
  stock: number;
  rating: number;
}

interface ProductCardProps {
  product: Product;
}

const stageConfig: Record<GrowthStage, { label: string; color: string; progress: number; icon: React.ReactNode }> = {
  seed: { label: 'Planted', color: 'bg-amber-500', progress: 10, icon: '🌱' },
  growing: { label: 'Growing', color: 'bg-lime-500', progress: 35, icon: '🌿' },
  maturing: { label: 'Maturing', color: 'bg-green-500', progress: 65, icon: '🌾' },
  harvest: { label: 'Harvesting', color: 'bg-emerald-500', progress: 90, icon: '🧺' },
  ready: { label: 'Ready', color: 'bg-primary', progress: 100, icon: '✅' },
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const stage = stageConfig[product.growthStage];
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} added to your cart`,
    });
  };

  const handleViewProduct = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="farm-card overflow-hidden group cursor-pointer"
      onClick={handleViewProduct}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isOrganic && (
            <Badge className="bg-farm-green text-white border-0">
              <Leaf className="w-3 h-3 mr-1" />
              Organic
            </Badge>
          )}
          <Badge className={`${stage.color} text-white border-0`}>
            <span className="mr-1">{stage.icon}</span>
            {stage.label}
          </Badge>
        </div>

        {/* Distance */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3 text-primary" />
          {product.distance} mi
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="icon" 
            variant="secondary" 
            className="w-8 h-8 rounded-full"
            onClick={(e) => { e.stopPropagation(); handleViewProduct(); }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            className="w-8 h-8 rounded-full bg-gradient-primary"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </div>

        {/* Name & Price */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight">
            {product.name}
          </h3>
          <div className="text-right shrink-0">
            <div className="font-bold text-primary text-lg">
              {product.price} {product.currency}
            </div>
            <div className="text-xs text-muted-foreground">per {product.unit}</div>
          </div>
        </div>

        {/* Farmer */}
        <Link to={`/farmer/${product.farmerId}`}>
          <div className="flex items-center gap-2 mb-3 hover:bg-secondary/50 rounded-lg p-1 -mx-1 transition-colors">
            <img
              src={product.farmerAvatar}
              alt={product.farmerName}
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {product.farmName}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                by {product.farmerName}
              </div>
            </div>
          </div>
        </Link>

        {/* Growth Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground flex items-center gap-1">
              <Sprout className="w-3 h-3" />
              Growth Stage
            </span>
            {product.harvestDate && (
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {product.harvestDate}
              </span>
            )}
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stage.progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full ${stage.color} rounded-full`}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Seed</span>
            <span>Ready</span>
          </div>
        </div>

        {/* Stock & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="text-sm">
            <span className={product.stock > 10 ? 'text-success' : 'text-warning'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Pre-order'}
            </span>
          </div>
          <Button
            size="sm"
            className="bg-gradient-primary text-primary-foreground"
            disabled={product.growthStage !== 'ready' && product.stock === 0}
            onClick={handleAddToCart}
          >
            {product.growthStage === 'ready' || product.stock > 0 ? 'Add to Cart' : 'Pre-order'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;