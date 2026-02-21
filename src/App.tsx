import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Pages
import Index from './pages/Index';
import Marketplace from './pages/Marketplace';
import Farmers from './pages/Farmers';
import Crowdfund from './pages/Crowdfund';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import FarmerDashboard from './pages/FarmerDashboard';
import Messages from './pages/Messages';

import '@solana/wallet-adapter-react-ui/styles.css';

const App = () => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <CartProvider>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/farmers" element={<Farmers />} />
                        <Route path="/crowdfund" element={<Crowdfund />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/product/:productId" element={<ProductDetail />} />
                        <Route path="/dashboard" element={<FarmerDashboard />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    </CartProvider>
                    <Toaster />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;