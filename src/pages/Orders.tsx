import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderTracking from '@/components/OrderTracking';
import { mockOrders } from '@/lib/mockData';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(mockOrders[0]);

  // Categorize orders
  const activeOrders = mockOrders.filter(
    (order) => !order.trackingSteps.find((s) => s.status === 'delivered')?.isCompleted
  );
  const completedOrders = mockOrders.filter(
    (order) => order.trackingSteps.find((s) => s.status === 'delivered')?.isCompleted
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-earth">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              My <span className="text-gradient-primary">Orders</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your orders from seed to delivery. Watch your fresh produce grow before it arrives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{mockOrders.length}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{activeOrders.length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 bg-farm-green-light rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-farm-green" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">2</div>
                <div className="text-sm text-muted-foreground">Shipping</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{completedOrders.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="active" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="active" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Active ({activeOrders.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Completed ({completedOrders.length})
                </TabsTrigger>
                <TabsTrigger value="all" className="gap-2">
                  <Package className="w-4 h-4" />
                  All ({mockOrders.length})
                </TabsTrigger>
              </TabsList>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Order List */}
              <div className="lg:col-span-1 space-y-4">
                <TabsContent value="active" className="mt-0 space-y-4">
                  {activeOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer ${
                        selectedOrder.id === order.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <OrderTracking order={order} variant="compact" />
                    </motion.div>
                  ))}
                  {activeOrders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No active orders
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="mt-0 space-y-4">
                  {completedOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer ${
                        selectedOrder.id === order.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <OrderTracking order={order} variant="compact" />
                    </motion.div>
                  ))}
                  {completedOrders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No completed orders
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all" className="mt-0 space-y-4">
                  {mockOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer ${
                        selectedOrder.id === order.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <OrderTracking order={order} variant="compact" />
                    </motion.div>
                  ))}
                </TabsContent>
              </div>

              {/* Order Detail */}
              <div className="lg:col-span-2">
                <motion.div
                  key={selectedOrder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <OrderTracking order={selectedOrder} variant="full" />
                </motion.div>
              </div>
            </div>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Orders;
