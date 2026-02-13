import '@solana/wallet-adapter-react-ui/styles.css';
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import NewPairs from "./pages/NewPairs";
import Trending from "./pages/Trending";
import PumpVision from "./pages/PumpVision";
import Holdings from "./pages/Holdings";
import TokenDetails from "./pages/TokenDetails";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import SplashScreen from "./components/SplashScreen";
import Leaderboard from "./pages/Leaderboard";
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import { 
  InjectedWalletAdapter,
  PhantomWalletAdapter,
  BackpackWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { 
  WalletAdapterNetwork
} from '@solana/wallet-adapter-base'; 
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import Maintainance from './pages/Maintainance';
import RugCheck from './pages/RugCheck';
import WalletAnalysis from './pages/WalletAnalysis';
import LayoutNew from './components/layout/LayoutNew';
import Landing from './pages/Landing';

// ✅ Fix 3: MetaMask-First with InjectedWalletAdapter (native MetaMask support)
const wallets = [
  new InjectedWalletAdapter(),     // ✅ Native MetaMask + injected wallets first
  new BackpackWalletAdapter(),     // ✅ MetaMask shim/backup
  new PhantomWalletAdapter(),      // ✅ Solana native
  // ❌ Removed: SolflareWalletAdapter (conflicts with MetaMask detection)
// ❌ Removed: AlphaWalletAdapter (slow), Clover, Torus
];

// ✅ Fix 2: Single reliable FREE RPC endpoint
const endpoint = "https://rpc.ankr.com/solana";  // Fast, reliable, free

const queryClient = new QueryClient();

// Component to handle post-authentication redirect
const PostAuthRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user && window.location.pathname === '/auth') {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return null;
};

// Main application with splash screen
const AppContent = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [splashCompleted, setSplashCompleted] = useState(false);
  
  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (!splashShown) {
      setShowSplash(true);
      setSplashCompleted(true);
    } else {
      setShowSplash(false);
      setSplashCompleted(true);
    }
  }, []);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
    setTimeout(() => {
      setSplashCompleted(true);
    }, 300);
  };
  
  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      {splashCompleted && (
        <BrowserRouter>
          <PostAuthRedirect />
          <Routes>
            <Route path="/auth" element={<Auth handleSplashComplete={handleSplashComplete}/>} />
            <Route path="/" element={<Landing/>} />            
            <Route element={<ProtectedRoute handleSplashComplete={handleSplashComplete}/>}>
              <Route element={<Layout />}>
                <Route path="/settings" element={<Settings />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new-pairs" element={<NewPairs />} />
                <Route path="/pump-vision" element={<PumpVision />} />
                <Route path="/holdings" element={<Holdings />} />
                <Route path="/token/:id" element={<TokenDetails />} />
              </Route>
              <Route element={<LayoutNew />}>
                <Route path="/rug-check" element={<RugCheck />} />
                <Route path="/wallet-analysis" element={<WalletAnalysis />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

// ✅ Fix 5: Complete WalletProvider config
const App = () => (
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider 
      wallets={wallets} 
      autoConnect={false}
      config={{ 
        commitment: 'processed',  // ✅ Faster confirmations
        network: WalletAdapterNetwork.Mainnet
      }}
      onError={(error) => console.log('Wallet error:', error)}
    >
      <WalletModalProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);

export default App;
