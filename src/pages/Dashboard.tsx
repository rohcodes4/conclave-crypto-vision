
import React, { useEffect, useState } from "react";
import TokenGrid from "@/components/tokens/TokenGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Wallet, LineChart, ArrowDownUp } from "lucide-react";
import { useTrendingSolanaTokens } from "@/services/solscanService";
import { useTrendingTokens } from "@/services/tokenService";
import { useTradeStore } from "@/services/tradeService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // const { data: trendingTokens, isLoading: isLoadingTokens } = useTrendingSolanaTokens();
  const queryResult = useTrendingSolanaTokens();
  const trendingTokens = queryResult.data ?? [];  // ✅ Safe default
  const isLoadingTokens = queryResult.isLoading;
  console.log("useTrendingSolanaTokens full result:", queryResult);
  console.log("useTrendingSolanaTokens trendingTokens (safe):", trendingTokens);
  console.log("useTrendingSolanaTokens isLoadingTokens:", isLoadingTokens);
  const { balance, trades, holdings, calculatePortfolioValue, calculatePnL } = useTradeStore();
  
  const portfolioValue = calculatePortfolioValue();
  const pnl = calculatePnL();

  const dashTokens = trendingTokens?.filter(Boolean);
  
  // Find market trend (bullish if more than 50% of trending tokens are up)
  const marketTrend = trendingTokens ? 
    trendingTokens.filter(token => token.change24h > 0).length > (trendingTokens.length / 2) ? 
      "Bullish" : "Bearish"
    : "Neutral";
  
  // Calculate fear and greed index (simple version: average of % changes, normalized to 0-100)
  // const fearAndGreedScore = trendingTokens ? 
  //   Math.min(100, Math.max(0, 50 + (trendingTokens.reduce((sum, token) => sum + token.change24h, 0) / trendingTokens.length))) 
  //   : 50;
  const fearAndGreedScore = trendingTokens ? (() => {
    const validTokens = trendingTokens.filter(token => typeof token.change24h === 'number');
    const avgChange = validTokens.length
      ? validTokens.reduce((sum, token) => sum + token.change24h, 0) / validTokens.length
      : 0;
    return Math.min(100, Math.max(0, 50 + avgChange));
  })() : 50;

      const [sortBy, setSortBy] = useState<"marketCap" | "change24h" | "volume24h">("marketCap");
      const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    
      const toggleSort = (field: "marketCap" | "change24h" | "volume24h") => {
        if (sortBy === field) {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortBy(field);
          setSortOrder("desc");
        }
      };
    
      const sortedTokens = React.useMemo(() => {
        if (!trendingTokens) return [];
        
        return [...trendingTokens].sort((a, b) => {
          if (sortOrder === "asc") {
            return (a[sortBy] || 0) - (b[sortBy] || 0);
          }
          return (b[sortBy] || 0) - (a[sortBy] || 0);
        });
      }, [trendingTokens, sortBy, sortOrder]);

  return (
    <div className="space-y-8">
      {/* <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>       
      </div> */}
      {isLoadingTokens? <div className="flex flex-col items-center justify-center h-screen bg-crypto-bg">
        <div className="w-16 h-16 border-4 border-crypto-accent border-t-transparent rounded-full animate-spin mb-8"></div>
        <p className="text-crypto-muted">Loading...</p>
      </div>:
      <div>
        <div className="">
        <h1 className="text-3xl font-bold mb-2">Trending Tokens</h1>
        <p className="text-crypto-muted">Trending Tokens on Solana</p>
      </div>
      <Card className="rounded-lg bg-crypto-card mt-6">
      <div className="flex gap-2 mb-0 overflow-x-auto py-2 no-scrollbar mt-4 ml-6">
        <Button
          variant={sortBy === "marketCap" ? "default" : "outline"}
          size="sm"
          onClick={() => toggleSort("marketCap")}
          className="flex items-center gap-1"
        >
          Market Cap {sortBy === "marketCap" && <ArrowDownUp className="h-3 w-3" />}
        </Button>
        <Button
          variant={sortBy === "change24h" ? "default" : "outline"}
          size="sm"
          onClick={() => toggleSort("change24h")}
          className="flex items-center gap-1"
        >
          24h % {sortBy === "change24h" && <ArrowDownUp className="h-3 w-3" />}
        </Button>
        <Button
          variant={sortBy === "volume24h" ? "default" : "outline"}
          size="sm"
          onClick={() => toggleSort("volume24h")}
          className="flex items-center gap-1"
        >
          Volume {sortBy === "volume24h" && <ArrowDownUp className="h-3 w-3" />}
        </Button>
      </div>
        <CardContent className="p-0">
        <TokenGrid 
        tokens={trendingTokens} 
        title="" 
        isLoading={isLoadingTokens}
        shouldCreateHasMoreData={false}
      />
      </CardContent>
      </Card>
      </div>}
      <div className="flex justify-center">
                  <Link to="/trending" className="mr-4 flex items-center">
        
        <Button variant="outline" >View More</Button>
        </Link>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-crypto-card border-crypto-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-crypto-muted">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioValue.toLocaleString()}</div>
              <p className={`text-sm flex items-center ${pnl.value >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                {pnl.value >= 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" /> 
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                {pnl.value >= 0 ? '+' : ''}{pnl.percentage.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-crypto-card border-crypto-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-crypto-muted">Trading P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${pnl.value >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                {pnl.value >= 0 ? '+' : '-'}${Math.abs(pnl.value).toLocaleString()}
              </div>
              <p className={`text-sm flex items-center ${pnl.value >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                {pnl.value >= 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                {pnl.value >= 0 ? '+' : ''}{pnl.percentage.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-crypto-card border-crypto-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-crypto-muted">Active Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{holdings.length}</div>
              <p className="text-sm text-crypto-muted">
                {holdings.length > 0 
                  ? `Across ${holdings.length} token${holdings.length !== 1 ? 's' : ''}` 
                  : 'No active positions'
                }
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-crypto-card border-crypto-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-crypto-muted">Market Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${marketTrend === "Bullish" ? "text-crypto-success" : marketTrend === "Bearish" ? "text-crypto-danger" : ""}`}>
                {marketTrend}
              </div>
              <p className="text-sm text-crypto-muted">Fear & Greed: {Math.round(fearAndGreedScore)}</p>
            </CardContent>
          </Card>
        </div>
      
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-crypto-card border-crypto-card overflow-hidden">
          <CardHeader className="bg-crypto-bg border-b border-crypto-card">
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" /> Recent Trades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-crypto-card">
              {trades.length > 0 ? (
                trades.slice(0, 3).map((trade) => {
                  // Format date
                  const date = new Date(trade.date);
                  const timeAgo = Math.round((Date.now() - date.getTime()) / (1000 * 60));
                  const timeDisplay = timeAgo < 60 
                    ? `${timeAgo} min ago` 
                    : `${Math.round(timeAgo / 60)} hours ago`;
                  
                  return (
                    <div key={trade.id} className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {trade.type === 'buy' ? "Buy" : "Sell"} {trade.symbol}
                        </div>
                        <div className="text-sm text-crypto-muted">{timeDisplay}</div>
                      </div>
                      <div className="text-right">
                        <div className={trade.type === 'buy' ? "text-crypto-success" : "text-crypto-danger"}>
                          {trade.type === 'buy' ? "+" : "-"}{trade.amount.toLocaleString()} {trade.symbol}
                        </div>
                        <div className="text-sm text-crypto-muted">${trade.total.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <p className="text-crypto-muted">No trades yet</p>
                  <Link to="/trending">
                    <button className="mt-2 text-sm text-crypto-accent hover:underline">
                      Start Trading
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-crypto-card border-crypto-card overflow-hidden">
          <CardHeader className="bg-crypto-bg border-b border-crypto-card">
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2" /> Top Holdings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-crypto-card">
              {holdings.length > 0 ? (
                holdings.slice(0, 3).map((holding) => {
                  const value = holding.amount * holding.currentPrice;
                  const profitLoss = (holding.currentPrice / holding.price - 1) * 100;
                  
                  return (
                    <Link to={`/token/${holding.id}`} key={holding.id}>
                      <div className="p-4 hover:bg-crypto-bg/30 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">
                            {holding.name}
                          </div>
                          <div className={profitLoss >= 0 ? "text-crypto-success" : "text-crypto-danger"}>
                            {profitLoss >= 0 ? "+" : ""}{profitLoss.toFixed(2)}%
                          </div>
                        </div>
                        <div className="text-sm text-crypto-muted mt-1 flex justify-between">
                          <span>{holding.amount.toLocaleString()} {holding.symbol}</span>
                          <span>${value.toLocaleString()}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <p className="text-crypto-muted">No holdings yet</p>
                  <Link to="/trending">
                    <button className="mt-2 text-sm text-crypto-accent hover:underline">
                      Start Trading
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
