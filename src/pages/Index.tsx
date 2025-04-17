
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import TokenGrid from '@/components/tokens/TokenGrid';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Simulate loading state
  const isLoading = false;
  
  // Sample tokens for homepage showcase
  const featuredTokens = [
    {
      id: "1",
      name: "Bitcoin",
      symbol: "BTC",
      price: 55000,
      change24h: 2.5,
      volume24h: 24500000000,
      logoUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
    },
    {
      id: "2",
      name: "Ethereum",
      symbol: "ETH",
      price: 3200,
      change24h: 1.8,
      volume24h: 16200000000,
      logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
    },
    {
      id: "3",
      name: "Solana",
      symbol: "SOL",
      price: 146,
      change24h: 4.2,
      volume24h: 3780000000,
      logoUrl: "https://cryptologos.cc/logos/solana-sol-logo.png"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-8">
        {/* Hero Section */}
        <section className="text-center py-12 px-4 bg-crypto-card rounded-lg border border-crypto-card">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Welcome to Paper Trader
            </h1>
            <p className="text-xl text-crypto-muted mb-8">
              Your gateway to crypto trading and market insights
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-crypto-accent hover:bg-crypto-accent/90"
                  onClick={() => navigate('/auth')}
                >
                  Start Trading Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-crypto-accent text-crypto-accent hover:bg-crypto-accent/10"
                  onClick={() => navigate('/trending')}
                >
                  Explore Trending Tokens
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-crypto-accent hover:bg-crypto-accent/90"
                  onClick={() => navigate('/holdings')}
                >
                  View My Portfolio
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-crypto-accent text-crypto-accent hover:bg-crypto-accent/10"
                  onClick={() => navigate('/new-pairs')}
                >
                  Discover New Tokens
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Market Overview */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Market Overview</h2>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-crypto-accent"
              onClick={() => navigate('/trending')}
            >
              <span>See More</span>
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-crypto-card border-crypto-card">
              <CardContent className="p-6">
                {isLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div>
                    <h3 className="text-crypto-muted text-sm mb-1">Market Cap</h3>
                    <div className="text-2xl font-bold">$2.14 T</div>
                    <div className="flex items-center text-crypto-success mt-1">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>2.1% (24h)</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-crypto-card border-crypto-card">
              <CardContent className="p-6">
                {isLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div>
                    <h3 className="text-crypto-muted text-sm mb-1">24h Volume</h3>
                    <div className="text-2xl font-bold">$84.6 B</div>
                    <div className="flex items-center text-crypto-success mt-1">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>5.8% (24h)</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-crypto-card border-crypto-card">
              <CardContent className="p-6">
                {isLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div>
                    <h3 className="text-crypto-muted text-sm mb-1">BTC Dominance</h3>
                    <div className="text-2xl font-bold">52.4%</div>
                    <div className="flex items-center text-crypto-danger mt-1">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      <span>0.3% (24h)</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Featured Tokens */}
        <section>
          <TokenGrid 
            tokens={featuredTokens} 
            title="Featured Tokens"
            isLoading={isLoading}
          />
        </section>
        
        {/* Features Section */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">Platform Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-crypto-card border-crypto-card hover:border-crypto-accent/50 transition-all">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-crypto-accent/20 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-crypto-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">Real-time Analytics</h3>
                <p className="text-crypto-muted">
                  Track price movements, volume changes, and market trends with our advanced analytics tools.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-crypto-card border-crypto-card hover:border-crypto-accent/50 transition-all">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-crypto-accent/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-crypto-accent">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Portfolio Management</h3>
                <p className="text-crypto-muted">
                  Manage your crypto holdings, track performance, and analyze your investment strategy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-crypto-card border-crypto-card hover:border-crypto-accent/50 transition-all">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-crypto-accent/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-crypto-accent">
                    <path d="M2 9h4v11H2zm5-4h3v15H7zm5-5h2v20h-2zm5 8h2v12h-2zm5-3h2v15h-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Early Detection</h3>
                <p className="text-crypto-muted">
                  Discover promising tokens before they gain mainstream attention with Pump Vision technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
