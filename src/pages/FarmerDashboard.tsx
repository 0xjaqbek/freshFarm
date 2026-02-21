import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  MessageCircle,
  Settings,
  Plus,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Header from '@/components/Header';
import { mockFarmerProfile, mockProducts, mockOrders, mockCampaigns } from '@/lib/mockData';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const farmerProducts = mockProducts.filter((p) => p.farmerId === '1');
  const farmerCampaigns = mockCampaigns.filter((c) => c.farmerName === 'John Peterson');

  // Mock analytics data
  const stats = {
    totalRevenue: 12450,
    revenueChange: 12.5,
    totalOrders: 156,
    ordersChange: 8.3,
    totalCustomers: 89,
    customersChange: 15.2,
    avgRating: 4.9,
    ratingChange: 0.1,
  };

  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Farmer Dashboard</h1>
              <p className="text-muted-foreground">{mockFarmerProfile.farmName}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                title: 'Total Revenue',
                value: `$${stats.totalRevenue.toLocaleString()}`,
                change: stats.revenueChange,
                icon: DollarSign,
                color: 'text-primary',
                bg: 'bg-primary/10',
              },
              {
                title: 'Total Orders',
                value: stats.totalOrders,
                change: stats.ordersChange,
                icon: ShoppingBag,
                color: 'text-farm-gold',
                bg: 'bg-farm-gold-light',
              },
              {
                title: 'Customers',
                value: stats.totalCustomers,
                change: stats.customersChange,
                icon: Users,
                color: 'text-farm-green',
                bg: 'bg-farm-green-light',
              },
              {
                title: 'Avg Rating',
                value: stats.avgRating,
                change: stats.ratingChange,
                icon: TrendingUp,
                color: 'text-warning',
                bg: 'bg-warning/10',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {stat.change >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {Math.abs(stat.change)}%
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.title}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-2">
                <Package className="w-4 h-4" />
                Products ({farmerProducts.length})
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl"
                        >
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {order.productName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.quantity} {order.unit} • #{order.id}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              {order.totalPrice} {order.currency}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {order.trackingSteps.find((s) => s.isCurrent)?.title}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {farmerProducts.slice(0, 4).map((product, index) => (
                        <div key={product.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate text-sm">
                              {product.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {product.stock} in stock
                            </div>
                          </div>
                          <div className="text-sm font-bold text-primary">
                            {product.price} {product.currency}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign Progress */}
                {farmerCampaigns.length > 0 && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Active Campaign</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={farmerCampaigns[0].coverImage}
                            alt={farmerCampaigns[0].title}
                            className="w-24 h-24 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">
                              {farmerCampaigns[0].title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {farmerCampaigns[0].description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium text-foreground">
                                  {Math.round((farmerCampaigns[0].raised / farmerCampaigns[0].goal) * 100)}%
                                </span>
                              </div>
                              <Progress
                                value={(farmerCampaigns[0].raised / farmerCampaigns[0].goal) * 100}
                                className="h-2"
                              />
                              <div className="flex justify-between text-sm">
                                <span className="font-bold text-primary">
                                  {farmerCampaigns[0].raised} {farmerCampaigns[0].currency}
                                </span>
                                <span className="text-muted-foreground">
                                  of {farmerCampaigns[0].goal} {farmerCampaigns[0].currency}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                          <div className="flex-1 text-center">
                            <div className="text-xl font-bold text-foreground">{farmerCampaigns[0].backers}</div>
                            <div className="text-xs text-muted-foreground">Backers</div>
                          </div>
                          <div className="flex-1 text-center">
                            <div className="text-xl font-bold text-foreground">{farmerCampaigns[0].daysLeft}</div>
                            <div className="text-xs text-muted-foreground">Days Left</div>
                          </div>
                          <div className="flex-1 text-center">
                            <div className="text-xl font-bold text-foreground">{farmerCampaigns[0].updates}</div>
                            <div className="text-xs text-muted-foreground">Updates</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Plus, label: 'Add Product' },
                        { icon: TrendingUp, label: 'New Campaign' },
                        { icon: MessageCircle, label: 'Messages' },
                        { icon: Settings, label: 'Settings' },
                      ].map((action) => (
                        <Button
                          key={action.label}
                          variant="outline"
                          className="flex-col h-auto py-4"
                        >
                          <action.icon className="w-5 h-5 mb-2" />
                          <span className="text-xs">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Products</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button className="bg-gradient-primary text-primary-foreground" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {farmerProducts.map((product) => (
                          <tr key={product.id} className="border-b border-border hover:bg-secondary/30">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div>
                                  <div className="font-medium text-foreground">{product.name}</div>
                                  {product.isOrganic && (
                                    <Badge className="bg-farm-green/10 text-farm-green border-0 text-xs">
                                      Organic
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{product.category}</td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-foreground">
                                {product.price} {product.currency}
                              </span>
                              <span className="text-xs text-muted-foreground ml-1">/{product.unit}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={product.stock > 10 ? 'text-success' : 'text-warning'}>
                                {product.stock}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                className={
                                  product.growthStage === 'ready'
                                    ? 'bg-success/10 text-success border-0'
                                    : 'bg-warning/10 text-warning border-0'
                                }
                              >
                                {product.growthStage === 'ready' ? 'Available' : 'Growing'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Orders Received</CardTitle>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl"
                      >
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">{order.productName}</span>
                            <Badge variant="secondary">#{order.id}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.quantity} {order.unit} • Customer Order
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              className={
                                order.trackingSteps.find((s) => s.status === 'delivered')?.isCompleted
                                  ? 'bg-success/10 text-success border-0'
                                  : 'bg-warning/10 text-warning border-0'
                              }
                            >
                              {order.trackingSteps.find((s) => s.isCurrent)?.title}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Est. {order.estimatedDelivery}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            {order.totalPrice} {order.currency}
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            Update Status
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns">
              <div className="grid gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>My Campaigns</CardTitle>
                    <Button className="bg-gradient-primary text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {farmerCampaigns.length > 0 ? (
                      <div className="space-y-6">
                        {farmerCampaigns.map((campaign) => (
                          <div key={campaign.id} className="p-6 bg-secondary/30 rounded-xl">
                            <div className="flex gap-6">
                              <img
                                src={campaign.coverImage}
                                alt={campaign.title}
                                className="w-32 h-32 rounded-xl object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <Badge className="mb-2">{campaign.category}</Badge>
                                    <h3 className="text-xl font-bold text-foreground">{campaign.title}</h3>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>{campaign.raised} / {campaign.goal} {campaign.currency}</span>
                                    <span>{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
                                  </div>
                                  <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                                </div>
                                <div className="flex items-center gap-6 mt-4">
                                  <div>
                                    <span className="text-lg font-bold text-foreground">{campaign.backers}</span>
                                    <span className="text-sm text-muted-foreground ml-1">backers</span>
                                  </div>
                                  <div>
                                    <span className="text-lg font-bold text-foreground">{campaign.daysLeft}</span>
                                    <span className="text-sm text-muted-foreground ml-1">days left</span>
                                  </div>
                                  <div>
                                    <span className="text-lg font-bold text-foreground">{campaign.tiers.length}</span>
                                    <span className="text-sm text-muted-foreground ml-1">tiers</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first crowdfunding campaign to raise funds for your farm.
                        </p>
                        <Button className="bg-gradient-primary text-primary-foreground">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Campaign
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Messages Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Direct messaging with customers will be available soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
