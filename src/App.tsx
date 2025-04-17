
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

const queryClient = new QueryClient();

// Component to handle post-authentication redirect
const PostAuthRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // If user is authenticated and we're at the auth page, redirect to home
    if (user && window.location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, navigate]);
  
  return null;
};

// Main application with splash screen
const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [splashCompleted, setSplashCompleted] = useState(false);
  
  // Check if splash screen has been shown in this session
  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
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
        <BrowserRouter>
          <PostAuthRedirect />
          <Routes>
            {/* Add Auth route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/new-pairs" element={<NewPairs />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/pump-vision" element={<PumpVision />} />
                <Route path="/holdings" element={<Holdings />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/token/:id" element={<TokenDetails />} />
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
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
