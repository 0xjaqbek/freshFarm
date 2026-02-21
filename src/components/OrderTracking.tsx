import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Truck, Package, Sprout, Sun, Leaf, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type OrderStatus = 'seed' | 'growing' | 'harvesting' | 'processing' | 'shipping' | 'delivered';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  productName: string;
  productImage: string;
  farmName: string;
  farmerName: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  currency: 'SOL' | 'USDC';
  trackingSteps: TrackingStep[];
  estimatedDelivery: string;
  txHash?: string;
}

interface OrderTrackingProps {
  order: Order;
  variant?: 'full' | 'compact';
}

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  seed: <Sprout className="w-5 h-5" />,
  growing: <Sun className="w-5 h-5" />,
  harvesting: <Leaf className="w-5 h-5" />,
  processing: <Package className="w-5 h-5" />,
  shipping: <Truck className="w-5 h-5" />,
  delivered: <Home className="w-5 h-5" />,
};

const OrderTracking: React.FC<OrderTrackingProps> = ({ order, variant = 'full' }) => {
  const currentStepIndex = order.trackingSteps.findIndex(step => step.isCurrent);
  const progress = ((currentStepIndex + 1) / order.trackingSteps.length) * 100;

  if (variant === 'compact') {
    return (
      <div className="farm-card p-4">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={order.productImage}
            alt={order.productName}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{order.productName}</h4>
            <p className="text-sm text-muted-foreground">{order.farmName}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-primary/10 text-primary border-0 text-xs">
                {order.trackingSteps[currentStepIndex]?.title || 'Processing'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Est. {order.estimatedDelivery}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-primary">
              {order.totalPrice} {order.currency}
            </div>
            <div className="text-xs text-muted-foreground">
              {order.quantity} {order.unit}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-primary rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2">
            {order.trackingSteps.map((step, index) => (
              <div
                key={step.status}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step.isCompleted || step.isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="farm-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={order.productImage}
            alt={order.productName}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div>
            <h3 className="font-bold text-foreground text-xl">{order.productName}</h3>
            <p className="text-muted-foreground">{order.farmName} • by {order.farmerName}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-muted-foreground">
                {order.quantity} {order.unit}
              </span>
              <span className="text-primary">•</span>
              <span className="font-bold text-primary">
                {order.totalPrice} {order.currency}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Badge className="bg-primary/10 text-primary border-0">
            Order #{order.id.slice(0, 8)}
          </Badge>
          <div className="mt-2 text-sm text-muted-foreground">
            Est. Delivery: <span className="font-medium text-foreground">{order.estimatedDelivery}</span>
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="relative">
        {order.trackingSteps.map((step, index) => (
          <div key={step.status} className="flex gap-4 mb-6 last:mb-0">
            {/* Icon */}
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : step.isCurrent
                    ? 'bg-farm-gold text-farm-soil animate-pulse'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {step.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  statusIcons[step.status]
                )}
              </div>
              {/* Line */}
              {index < order.trackingSteps.length - 1 && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-12">
                  <div
                    className={`w-full h-full ${
                      step.isCompleted ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center justify-between">
                <h4
                  className={`font-semibold ${
                    step.isCompleted || step.isCurrent
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </h4>
                {step.timestamp && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {step.timestamp}
                  </span>
                )}
              </div>
              <p
                className={`text-sm mt-1 ${
                  step.isCompleted || step.isCurrent
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/60'
                }`}
              >
                {step.description}
              </p>
              {step.isCurrent && (
                <Badge className="mt-2 bg-farm-gold/10 text-farm-brown border-farm-gold/20">
                  Current Status
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Hash */}
      {order.txHash && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Transaction Hash</span>
            <a
              href={`https://solscan.io/tx/${order.txHash}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-mono truncate max-w-[200px]"
            >
              {order.txHash}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
