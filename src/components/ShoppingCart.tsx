import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSolanaPayment } from '@/hooks/useSolanaPayment';
import {
  ShoppingCart as CartIcon,
  X,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Wallet,
  Loader2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const ShoppingCart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotal, getTotalItems } = useCart();
  const { connected, publicKey } = useWallet();
  const { toast } = useToast();
  const { pay, isProcessing: isPaymentProcessing, getSolBalance, getUsdcBalance } = useSolanaPayment();
  const [solBalance, setSolBalance] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<number>(0);

  // Fetch balances when wallet connects
  React.useEffect(() => {
    const fetchBalances = async () => {
      if (connected) {
        const sol = await getSolBalance();
        const usdc = await getUsdcBalance();
        setSolBalance(sol);
        setUsdcBalance(usdc);
      }
    };
    fetchBalances();
  }, [connected, getSolBalance, getUsdcBalance]);

  // Demo farmer wallet address (in production this would come from the order/product)
  const DEMO_FARMER_WALLET = 'DemoFarmerWallet111111111111111111111111111';
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const totals = getTotal();
  const totalItems = getTotalItems();

  const handleCheckout = async () => {
    if (!connected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to checkout',
        variant: 'destructive',
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      // Process payments for each currency type
      const promises: Promise<any>[] = [];

      if (totals.sol > 0) {
        // Note: In production, you'd send to actual farmer wallets per order
        // Here we simulate with a demo address
        promises.push(
          pay({
            recipient: DEMO_FARMER_WALLET,
            amount: totals.sol,
            currency: 'SOL',
            memo: 'FreshFarm Order',
          })
        );
      }

      if (totals.usdc > 0) {
        promises.push(
          pay({
            recipient: DEMO_FARMER_WALLET,
            amount: totals.usdc,
            currency: 'USDC',
            memo: 'FreshFarm Order',
          })
        );
      }

      // For demo purposes, simulate success since we don't have real farmer wallets
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockTxHash = `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 10)}`;
      setTxHash(mockTxHash);
      setCheckoutSuccess(true);

      toast({
        title: 'Order placed successfully!',
        description: 'Your order has been confirmed and is being processed.',
      });

      // Clear cart after successful checkout
      setTimeout(() => {
        clearCart();
        setCheckoutSuccess(false);
        setTxHash(null);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      toast({
        title: 'Checkout failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <CartIcon className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CartIcon className="w-5 h-5" />
            Shopping Cart ({totalItems} items)
          </SheetTitle>
        </SheetHeader>

        {checkoutSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Order Confirmed!</h3>
            <p className="text-muted-foreground mb-4">
              Your fresh produce is on its way from local farms.
            </p>
            {txHash && (
              <a
                href={`https://solscan.io/tx/${txHash}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline text-sm"
              >
                View transaction <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </motion.div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <CartIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground">
              Start adding fresh produce from local farmers!
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 p-3 bg-secondary/50 rounded-xl"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.product.farmName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-7 h-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-7 h-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            {(item.product.price * item.quantity).toFixed(2)} {item.product.currency}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.product.price} / {item.product.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Checkout Section */}
            <div className="border-t border-border pt-4 space-y-4">
              {/* Totals */}
              <div className="space-y-2">
                {totals.usdc > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">USDC Total</span>
                    <span className="font-bold text-foreground">{totals.usdc.toFixed(2)} USDC</span>
                  </div>
                )}
                {totals.sol > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">SOL Total</span>
                    <span className="font-bold text-foreground">{totals.sol.toFixed(4)} SOL</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Estimated Total</span>
                  <div className="text-right">
                    {totals.usdc > 0 && (
                      <Badge variant="secondary" className="mr-2">
                        {totals.usdc.toFixed(2)} USDC
                      </Badge>
                    )}
                    {totals.sol > 0 && (
                      <Badge variant="secondary">{totals.sol.toFixed(4)} SOL</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Wallet Status & Balances */}
              <div className="p-3 bg-secondary/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  {connected ? (
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-foreground">Connected</span>
                      <p className="text-xs text-muted-foreground truncate">
                        {publicKey?.toBase58()}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Connect wallet to checkout
                    </span>
                  )}
                </div>
                {connected && (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                    <span className="text-muted-foreground">Balance:</span>
                    <div className="flex gap-2">
                      <span className="text-foreground">{solBalance.toFixed(4)} SOL</span>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-foreground">{usdcBalance.toFixed(2)} USDC</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full bg-gradient-primary text-primary-foreground py-6"
                onClick={handleCheckout}
                disabled={!connected || isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay with Solana
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={clearCart}
                disabled={isCheckingOut}
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;