import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Star,
  Leaf,
  Clock,
  Sprout,
  Sun,
  Package,
  Truck,
  Home,
  ShoppingCart,
  Heart,
  Share2,
  MessageCircle,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { mockProducts, mockFarmers } from '@/lib/mockData';

const stageDetails = {
  seed: {
    icon: Sprout,
    label: 'Planted',
    color: 'text-amber-500',
    bg: 'bg-amber-500',
    progress: 10,
    description: 'Seeds planted in nutrient-rich soil',
  },
  growing: {
    icon: Sun,
    label: 'Growing',
    color: 'text-lime-500',
    bg: 'bg-lime-500',
    progress: 35,
    description: 'Plants receiving daily care and sunshine',
  },
  maturing: {
    icon: Leaf,
    label: 'Maturing',
    color: 'text-green-500',
    bg: 'bg-green-500',
    progress: 65,
    description: 'Produce developing full flavor and nutrients',
  },
  harvest: {
    icon: Package,
    label: 'Harvesting',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500',
    progress: 90,
    description: 'Being carefully harvested by hand',
  },
  ready: {
    icon: CheckCircle,
    label: 'Ready',
    color: 'text-primary',
    bg: 'bg-primary',
    progress: 100,
    description: 'Fresh and ready for delivery',
  },
};

const ProductDetail = () => {
  const { productId } = useParams();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = mockProducts.find((p) => p.id === productId);
  const farmer = mockFarmers.find((f) => f.id === product?.farmerId);
  const relatedProducts = mockProducts
    .filter((p) => p.id !== productId && p.category === product?.category)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
          <Link to="/marketplace">
            <Button className="mt-4">Back to Marketplace</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const stage = stageDetails[product.growthStage];
  const StageIcon = stage.icon;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: 'Added to cart',
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-gradient-earth">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/marketplace" className="hover:text-primary">Marketplace</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isOrganic && (
                    <Badge className="bg-farm-green text-white border-0">
                      <Leaf className="w-3 h-3 mr-1" />
                      Organic
                    </Badge>
                  )}
                  <Badge className={`${stage.bg} text-white border-0`}>
                    <StageIcon className="w-3 h-3 mr-1" />
                    {stage.label}
                  </Badge>
                </div>
                {/* Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Growth Timeline */}
              <div className="farm-card p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-primary" />
                  Growth Timeline
                </h3>
                <div className="relative">
                  <Progress value={stage.progress} className="h-3 mb-4" />
                  <div className="flex justify-between">
                    {Object.entries(stageDetails).map(([key, s], index) => {
                      const Icon = s.icon;
                      const isActive = Object.keys(stageDetails).indexOf(product.growthStage) >= index;
                      const isCurrent = key === product.growthStage;
                      return (
                        <div key={key} className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCurrent
                                ? `${s.bg} text-white`
                                : isActive
                                ? 'bg-primary/20 text-primary'
                                : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`text-xs mt-1 ${isCurrent ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  {stage.description}
                </p>
                {product.harvestDate && (
                  <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Expected harvest:</span>
                    <span className="font-medium text-foreground">{product.harvestDate}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Category */}
              <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                {product.category}
              </Badge>

              {/* Title & Rating */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-farm-gold fill-farm-gold" />
                    <span className="font-semibold text-foreground">{product.rating}</span>
                    <span className="text-muted-foreground">(128 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{product.distance} mi away</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-primary">
                  {product.price} {product.currency}
                </span>
                <span className="text-muted-foreground pb-1">per {product.unit}</span>
              </div>

              {/* Farmer Card */}
              {farmer && (
                <Link to={`/farmer/${farmer.id}`}>
                  <div className="farm-card p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
                    <img
                      src={farmer.avatar}
                      alt={farmer.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{farmer.farmName}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>by {farmer.name}</span>
                        <span>•</span>
                        <Star className="w-3 h-3 text-farm-gold fill-farm-gold" />
                        <span>{farmer.rating}</span>
                        {farmer.isVerified && (
                          <>
                            <span>•</span>
                            <Badge className="bg-primary/10 text-primary border-0 text-xs">Verified</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </Link>
              )}

              {/* Stock & Quantity */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={`font-semibold ${product.stock > 0 ? 'text-success' : 'text-warning'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Pre-order available'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {(product.price * quantity).toFixed(2)} {product.currency}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-primary text-primary-foreground py-6"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart(product.id) ? 'Add More to Cart' : 'Add to Cart'}
                </Button>
                <Button variant="outline" className="py-6">
                  Buy Now
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Leaf, label: 'Organic', sublabel: 'Certified' },
                  { icon: Truck, label: 'Free Delivery', sublabel: 'Orders $50+' },
                  { icon: Home, label: 'Farm Fresh', sublabel: 'Direct' },
                ].map((feature, index) => (
                  <div key={index} className="text-center p-3 bg-secondary/50 rounded-xl">
                    <feature.icon className="w-6 h-6 text-primary mx-auto mb-1" />
                    <div className="text-sm font-medium text-foreground">{feature.label}</div>
                    <div className="text-xs text-muted-foreground">{feature.sublabel}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                  <TabsTrigger value="nutrition" className="flex-1">Nutrition</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4">
                  <p className="text-muted-foreground">
                    Freshly harvested from {product.farmName}, these {product.name.toLowerCase()} are grown using sustainable farming practices. 
                    {product.isOrganic && ' Certified organic, free from pesticides and chemicals.'}
                    Our farmers take pride in delivering the highest quality produce directly from their fields to your table.
                  </p>
                </TabsContent>
                <TabsContent value="nutrition" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Calories', value: '25 kcal' },
                      { label: 'Protein', value: '2g' },
                      { label: 'Carbs', value: '5g' },
                      { label: 'Fiber', value: '3g' },
                      { label: 'Vitamins', value: 'A, C, K' },
                      { label: 'Minerals', value: 'Iron, Potassium' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between p-2 bg-secondary/50 rounded-lg">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-4">
                  <div className="space-y-4">
                    {[
                      { name: 'Sarah M.', rating: 5, comment: 'Absolutely fresh and delicious! Will order again.' },
                      { name: 'John D.', rating: 5, comment: 'Best tomatoes I\'ve had in years. Direct from farm quality!' },
                    ].map((review, index) => (
                      <div key={index} className="p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-foreground">{review.name}</span>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-farm-gold fill-farm-gold" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
