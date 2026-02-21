import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Filter, List, Grid3x3, ChevronRight, Star, Leaf, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import FarmerCard, { Farmer } from './FarmerCard';

interface MapViewProps {
  farmers: Farmer[];
}

// Mock map pin positions for demo (in a real app, these would be calculated from lat/lng)
const mockPositions: Record<string, { top: string; left: string }> = {
  '1': { top: '25%', left: '30%' },
  '2': { top: '45%', left: '55%' },
  '3': { top: '60%', left: '25%' },
  '4': { top: '35%', left: '70%' },
  '5': { top: '70%', left: '60%' },
  '6': { top: '20%', left: '50%' },
};

const MapView: React.FC<MapViewProps> = ({ farmers }) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOrganic, setFilterOrganic] = useState(false);

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrganic = !filterOrganic || farmer.isOrganic;
    return matchesSearch && matchesOrganic;
  });

  return (
    <div className="farm-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search farms by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters & View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={filterOrganic ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterOrganic(!filterOrganic)}
              className={filterOrganic ? 'bg-farm-green hover:bg-farm-green/90' : ''}
            >
              <Leaf className="w-4 h-4 mr-1" />
              Organic Only
            </Button>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-none ${viewMode === 'map' ? 'bg-secondary' : ''}`}
                onClick={() => setViewMode('map')}
              >
                <Navigation className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-none ${viewMode === 'list' ? 'bg-secondary' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Location */}
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span>Showing {filteredFarmers.length} farms near</span>
          <span className="font-medium text-foreground">San Francisco, CA</span>
          <Button variant="link" size="sm" className="text-primary p-0 h-auto">
            Change
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'map' ? (
        <div className="relative h-[500px] map-container">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Roads (decorative) */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 0 200 Q 200 250 400 200 T 800 250"
              stroke="hsl(var(--border))"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 300 0 Q 350 200 300 400 T 350 600"
              stroke="hsl(var(--border))"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Current Location Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute" />
              <div className="w-4 h-4 bg-primary rounded-full relative">
                <div className="absolute inset-1 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Farm Markers */}
          {filteredFarmers.map((farmer) => {
            const position = mockPositions[farmer.id] || { top: '50%', left: '50%' };
            return (
              <motion.div
                key={farmer.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute cursor-pointer z-20"
                style={{ top: position.top, left: position.left }}
                onClick={() => setSelectedFarmer(farmer)}
              >
                <div
                  className={`relative ${
                    selectedFarmer?.id === farmer.id ? 'z-30' : ''
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-full bg-card border-4 shadow-farm-lg overflow-hidden ${
                      selectedFarmer?.id === farmer.id
                        ? 'border-primary'
                        : 'border-card'
                    }`}
                  >
                    <img
                      src={farmer.avatar}
                      alt={farmer.farmName}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  {/* Distance Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {farmer.distance}mi
                  </div>
                  {/* Organic Badge */}
                  {farmer.isOrganic && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-farm-green rounded-full flex items-center justify-center">
                      <Leaf className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Selected Farmer Popup */}
          <AnimatePresence>
            {selectedFarmer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 z-40"
              >
                <div className="bg-card rounded-xl shadow-farm-lg border border-border p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8"
                    onClick={() => setSelectedFarmer(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedFarmer.avatar}
                      alt={selectedFarmer.farmName}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground truncate">
                          {selectedFarmer.farmName}
                        </h4>
                        {selectedFarmer.isOrganic && (
                          <Badge className="bg-farm-green text-white border-0 text-xs">
                            Organic
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedFarmer.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {selectedFarmer.distance} mi
                        </span>
                        <span className="text-sm flex items-center gap-1">
                          <Star className="w-3 h-3 text-farm-gold fill-farm-gold" />
                          {selectedFarmer.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {selectedFarmer.products} products
                        </span>
                      </div>
                    </div>
                    <Button className="bg-gradient-primary text-primary-foreground shrink-0">
                      View Farm
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[500px] overflow-y-auto">
          {filteredFarmers.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MapView;
