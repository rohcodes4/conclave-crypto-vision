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
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  AlphaWalletAdapter,
  CloverWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';

import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import Maintainance from './pages/Maintainance';
import RugCheck from './pages/RugCheck';
import WalletAnalysis from './pages/WalletAnalysis';
import LayoutNew from './components/layout/LayoutNew';
import Landing from './pages/Landing';
import { supabase } from '@/integrations/supabase/client';

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new AlphaWalletAdapter(),
  new CloverWalletAdapter(),
  new TorusWalletAdapter()
];

// FREE Solana RPC endpoints (with fallbacks)
const RPC_ENDPOINTS = [
  // "https://api.mainnet-beta.solana.com", // Official free endpoint
  "https://solana-api.projectserum.com", // Serum free endpoint
  "https://rpc.ankr.com/solana", // Ankr free endpoint
];

// Use the first endpoint, with fallback capability built into Solana's ConnectionProvider
const endpoint = RPC_ENDPOINTS[0];

const queryClient = new QueryClient();


// ── Handles #tgAuthResult= hash from Telegram OAuth redirect ──────────────
// Must be inside BrowserRouter so it has access to useNavigate.
const TelegramAuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith('#tgAuthResult=')) return;

    try {
      const encoded = hash.replace('#tgAuthResult=', '');
      const userData = JSON.parse(atob(encoded));
      window.history.replaceState(null, '', window.location.pathname);

      (async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/telegram-login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify(userData),
            }
          );

          const data = await res.json();

          if (!data.success || !data.login_url) {
            console.error('Telegram login failed:', data.error);
            return;
          }

          const url = new URL(data.login_url);
          const tokenHash = url.searchParams.get('token');

          if (!tokenHash) {
            console.error('No token in login_url');
            return;
          }

          // Listen for auth state BEFORE calling verifyOtp
          // so we don't navigate until AuthContext has the session
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
              subscription.unsubscribe();
              navigate('/dashboard', { replace: true });
            }
          });

          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email',
          });

          if (error) {
            console.error('verifyOtp error:', error);
            subscription.unsubscribe();
          }

        } catch (err) {
          console.error('Telegram auth error:', err);
        }
      })();

    } catch (err) {
      console.error('Failed to parse tgAuthResult:', err);
    }
  }, [navigate]);

  return null;
};

// Component to handle post-authentication redirect
const PostAuthRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // If user is authenticated and we're at the auth page, redirect to home
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
  
  // Check if splash screen has been shown in this session
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
  
  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
    // Mark that splash has been shown in this session
    sessionStorage.setItem('splashShown', 'true');
    
    // Add small delay before rendering the app content
    setTimeout(() => {
      setSplashCompleted(true);
    }, 300);
  };
  
  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      {splashCompleted && (
      //   <BrowserRouter>
      //   <Routes>
      //     <Route element={<Layout />}>
      //       <Route path="*" element={<Maintainance />} />
      //     </Route>
      //   </BrowserRouter>
        <BrowserRouter>
        <TelegramAuthHandler />
          <PostAuthRedirect />
          <Routes>
            {/* Add Auth route */}
            <Route path="/auth" element={<Auth handleSplashComplete={handleSplashComplete}/>} />
            <Route path="/" element={<Landing/>} />            
            {/* Protected routes */}
            <Route element={<ProtectedRoute handleSplashComplete={handleSplashComplete}/>}>
              <Route element={<Layout />}>
                <Route path="/settings" element={<Settings />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new-pairs" element={<NewPairs />} />
                {/* <Route path="/trending" element={<Trending />} /> */}
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

const App = () => (
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
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