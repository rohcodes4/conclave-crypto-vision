
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, Link as LinkIcon, Share2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTradeStore, TradeStatus } from "@/services/tradeService";
import { useTrendingTokens } from "@/services/tokenService";
import { useTokenPricesBatch } from "@/services/solscanService";
import { toast } from "sonner";

const TRADES_PER_PAGE = 10;

// Interface for realized PnL
interface RealizedPnL {
  token: string;
  tokenId: string;
  symbol: string;
  buyTotal: number;
  sellTotal: number;
  pnl: number;
  pnlPercentage: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const Holdings = () => {
  const { holdings, trades, balance, calculatePortfolioValue, calculatePnL } = useTradeStore();
  const { data: trendingTokens } = useTrendingTokens();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState<"portfolio" | "history" | "realized" | "all" | "buy" | "sell">("portfolio");
  const [selectedTradeType, setSelectedTradeType] = useState<'all' | 'buy' | 'sell'>('all');

  // Get token addresses for price fetching
  const tokenAddresses = holdings.map(h => h.id);
  const { data: tokenPrices } = useTokenPricesBatch(tokenAddresses);
  
  // Update holdings with current prices
  useEffect(() => {
    if (tokenPrices && Object.keys(tokenPrices).length > 0) {
      holdings.forEach(holding => {
        if (tokenPrices[holding.id]) {
          holding.currentPrice = tokenPrices[holding.id];
        }
      });
    }
  }, [tokenPrices, holdings]);
  
  const totalPortfolioValue = calculatePortfolioValue();
  const pnl = calculatePnL();
  
  // Calculate allocations
  const holdingsWithAllocations = holdings.map(holding => {
    const tokenValue = holding.amount * holding.currentPrice;
    const allocation = totalPortfolioValue > 0 ? (tokenValue / totalPortfolioValue) * 100 : 0;
    return {
      ...holding,
      allocation: parseFloat(allocation.toFixed(2))
    };
  });
  
  // Calculate realized PnL from completed trades
  const [realizedPnL, setRealizedPnL] = useState<RealizedPnL[]>([]);
  
  useEffect(() => {
    if (!trades || trades.length === 0) return;
    
    // Group trades by token
    const tradesByToken: Record<string, any[]> = {};
    
    trades.forEach(trade => {
      if (!tradesByToken[trade.token]) {
        tradesByToken[trade.token] = [];
      }
      tradesByToken[trade.token].push(trade);
    });
    
    // Calculate realized PnL for each token
    const realizedPnLData: RealizedPnL[] = [];
    
    Object.keys(tradesByToken).forEach(tokenId => {
      const tokenTrades = tradesByToken[tokenId];
      
      // Skip tokens that still have holdings
      const hasHolding = holdings.some(h => h.id === tokenId);
      
      // Only calculate for tokens that have been fully sold
      if (!hasHolding && tokenTrades.some(t => t.type === 'sell')) {
        let buyTotal = 0;
        let sellTotal = 0;
        let lastSymbol = '';
        let lastName = '';
        
        tokenTrades.forEach(trade => {
          if (trade.type === 'buy') {
            buyTotal += trade.total;
          } else {
            sellTotal += trade.total;
          }
          lastSymbol = trade.symbol;
          lastName = trade.name || trade.symbol;
        });
        
        if (buyTotal > 0) {
          const pnl = sellTotal - buyTotal;
          const pnlPercentage = (pnl / buyTotal) * 100;
          
          realizedPnLData.push({
            token: lastName,
            tokenId,
            symbol: lastSymbol,
            buyTotal,
            sellTotal,
            pnl,
            pnlPercentage
          });
        }
      }
    });
    
    setRealizedPnL(realizedPnLData);
  }, [trades, holdings]);
  
  // Filter trades based on tab
  const filteredTrades = selectedTradeType === "all" 
    ? trades
    : selectedTradeType === "buy" || selectedTradeType === "sell"
      ? trades.filter(trade => trade.type === selectedTradeType)
      : trades;
      
  const totalPages = Math.ceil(filteredTrades.length / TRADES_PER_PAGE);
  const currentTrades = filteredTrades.slice(
    (currentPage - 1) * TRADES_PER_PAGE, 
    currentPage * TRADES_PER_PAGE
  );
  
  const handleTabChange = (value: "portfolio" | "history" | "realized" | "all" | "buy" | "sell") => {
    
    if(value==="all" || value==="buy" || value==="sell") setSelectedTradeType(value); else setCurrentTab(value);
    setCurrentPage(1);
  };
  
  const handleShare = (tokenId: string, name: string) => {
    const url = `${window.location.origin}/token/${tokenId}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Check out ${name} on Paper Trader`,
        text: `I'm trading ${name} on Paper Trader!`,
        url
      }).catch(err => {
        console.error('Error sharing:', err);
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  console.log(selectedTradeType)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Holdings</h1>
        <p className="text-crypto-muted">Track your paper trading portfolio</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-crypto-card border-crypto-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-crypto-muted">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
            <p className="text-sm text-crypto-muted flex items-center">
              <span className="text-crypto-success">Balance: ${balance.toLocaleString()}</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-crypto-card border-crypto-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-crypto-muted">Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${pnl.value >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
              {pnl.value >= 0 ? '+' : ''} ${pnl.value.toLocaleString()}
            </div>
            <p className={`text-sm flex items-center ${pnl.value >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
              {pnl.value >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {pnl.value >= 0 ? '+' : ''}{pnl.percentage.toFixed(2)}% Overall
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-crypto-card border-crypto-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-crypto-muted">Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdings.length}</div>
            <p className="text-sm text-crypto-muted">Different tokens</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="portfolio" value={currentTab} onValueChange={(value) => handleTabChange(value as any)}>
        <TabsList className="bg-crypto-card mb-6">
          <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white" value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white" value="history">Trade History</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white" value="realized">Realized PnL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio">
          <Card className="bg-crypto-card border-crypto-card overflow-hidden">
            <CardHeader className="bg-crypto-bg border-b border-crypto-card">
              <CardTitle>Portfolio Assets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {holdings.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-crypto-muted mb-4">You don't have any current assets yet.</p>
                  <Link to="/trending">
                    <button className="bg-crypto-accent hover:bg-crypto-highlight text-white px-4 py-2 rounded-md transition-colors">
                      Start Trading
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-crypto-bg">
                      <tr className="text-left text-xs text-crypto-muted">
                        <th className="px-4 py-3">Asset</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Value</th>
                        <th className="px-4 py-3">Allocation</th>
                        <th className="px-4 py-3">Avg. Price</th>
                        <th className="px-4 py-3">Current</th>
                        <th className="px-4 py-3">P&L</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-crypto-card">
                      {holdingsWithAllocations.map((token) => {
                        const value = token.amount * token.currentPrice;
                        const pnl = value - (token.amount * token.price);
                        const pnlPercentage = (token.currentPrice / token.price - 1) * 100;
                        
                        return (
                          <tr key={token.id} className="hover:bg-crypto-bg/50 transition-colors">
                            <td className="px-4 py-4">
                              <Link to={`/token/${token.id}`} className="flex items-center gap-2">
                                {/* <div className="h-8 w-8 rounded-full bg-gradient-to-br from-crypto-accent/30 to-crypto-highlight/30" /> */}
                                <div>
                                  <div className="font-medium">{token.symbol}</div>
                                  <div className="text-xs text-crypto-muted">{token.name}</div>
                                </div>
                              </Link>
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-mono">{token.amount.toLocaleString()}</div>
                              <div className="text-xs text-crypto-muted">{token.symbol}</div>
                            </td>
                            <td className="px-4 py-4 font-medium">
                              ${value.toLocaleString()}
                            </td>
                            <td className="px-4 py-4">
                              <div className="w-full flex items-center">
                                <div className="w-24 mr-2">
                                  <Progress value={token.allocation} className="h-2" />
                                </div>
                                <span className="text-xs text-crypto-muted">{token.allocation}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              ${token.price.toFixed(8)}
                            </td>
                            <td className="px-4 py-4">
                              ${token.currentPrice.toFixed(8)}
                            </td>
                            <td className="px-4 py-4">
                              <div className={pnl >= 0 ? "text-crypto-success" : "text-crypto-danger"}>
                                {pnl >= 0 ? "+" : ""} ${Math.abs(pnl).toLocaleString()} 
                                <span className="text-xs ml-1">
                                  ({pnl >= 0 ? "+" : ""}{pnlPercentage.toFixed(2)}%)
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-1">
                                {/* <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleShare(token.id, token.name)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button> */}
                                <Link to={`/token/${token.id}`}>
                                  <Button variant="ghost" size="sm">
                                    <LinkIcon className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card className="bg-crypto-card border-crypto-card overflow-hidden">
            <CardHeader>
              <CardTitle>Trading Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="history" value="history" onValueChange={(value) => handleTabChange(value as any)}>
              <TabsList className="bg-crypto-bg mb-6">
  <TabsTrigger
    value="all"
    onClick={() => setSelectedTradeType('all')}
    data-state={selectedTradeType === 'all' ? 'active' : undefined}
    className="data-[state=active]:bg-crypto-border data-[state=active]:text-white"
  >
    All Trades
  </TabsTrigger>
  <TabsTrigger
    value="buy"
    onClick={() => setSelectedTradeType('buy')}
    data-state={selectedTradeType === 'buy' ? 'active' : undefined}
    className="data-[state=active]:bg-crypto-border data-[state=active]:text-white"
  >
    Buys
  </TabsTrigger>
  <TabsTrigger
    value="sell"
    onClick={() => setSelectedTradeType('sell')}
    data-state={selectedTradeType === 'sell' ? 'active' : undefined}
    className="data-[state=active]:bg-crypto-border data-[state=active]:text-white"
  >
    Sells
  </TabsTrigger>
</TabsList>
                {trades.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-crypto-muted mb-4">You haven't made any trades yet.</p>
                    <Link to="/trending">
                      <Button variant="outline">Start Trading</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-crypto-muted border-b border-crypto-card">
                          <th className="pb-3 px-4">Type</th>
                          <th className="pb-3 px-4">Token</th>
                          <th className="pb-3 px-4">Price</th>
                          <th className="pb-3 px-4">Amount</th>
                          <th className="pb-3 px-4">Total</th>
                          <th className="pb-3 px-4">Date</th>
                          <th className="pb-3 px-4">Status</th>
                          <th className="pb-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTrades.map((trade) => (
                          <tr key={trade.id} className="border-b border-crypto-card last:border-0">
                            <td className="py-4 px-4">
                              <span className={`py-1 px-3 rounded-full text-xs font-medium ${
                                trade.type === 'buy' ? 'bg-crypto-success/20 text-crypto-success' : 'bg-crypto-danger/20 text-crypto-danger'
                              }`}>
                                {trade.type === 'buy' ? 'BUY' : 'SELL'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <Link to={`/token/${trade.token}`} className="hover:underline">
                                <div className="font-medium">{trade.name || trade.symbol}</div>
                                <div className="text-xs text-crypto-muted">{trade.symbol}</div>
                              </Link>
                            </td>
                            <td className="py-4 px-4">${trade.price.toFixed(8)}</td>
                            <td className="py-4 px-4">
                              <div className="font-mono">{trade.amount.toLocaleString()}</div>
                              <div className="text-xs text-crypto-muted">{trade.symbol}</div>
                            </td>
                            <td className="py-4 px-4 font-medium">${trade.total.toLocaleString()}</td>
                            <td className="py-4 px-4 text-crypto-muted whitespace-pre">{formatDate(trade.date)}</td>
                            <td className="py-4 px-4">
                              <span className={`text-xs py-1 px-2 rounded ${
                                trade.status === TradeStatus.COMPLETED 
                                  ? 'bg-crypto-success/20 text-crypto-success' 
                                  : trade.status === TradeStatus.PENDING 
                                  ? 'bg-crypto-accent/20 text-crypto-accent'
                                  : 'bg-crypto-danger/20 text-crypto-danger'
                              }`}>
                                {trade.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleShare(trade.token, trade.name || trade.symbol)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Link to={`/token/${trade.token}`}>
                                  <Button variant="ghost" size="sm">
                                    <LinkIcon className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-crypto-muted">
                      Showing {(currentPage - 1) * TRADES_PER_PAGE + 1}-{Math.min(currentPage * TRADES_PER_PAGE, filteredTrades.length)} of {filteredTrades.length} trades
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="realized">
          <Card className="bg-crypto-card border-crypto-card overflow-hidden">
            <CardHeader className="bg-crypto-bg border-b border-crypto-card">
              <CardTitle>Realized Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {realizedPnL.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-crypto-muted mb-4">No realized profits or losses yet.</p>
                  <p className="text-crypto-muted mb-4">When you sell all of your holdings for a token, your PnL will show here.</p>
                  <Link to="/trending">
                    <button className="bg-crypto-accent hover:bg-crypto-highlight text-white px-4 py-2 rounded-md transition-colors">
                      Start Trading
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-crypto-bg">
                      <tr className="text-left text-xs text-crypto-muted">
                        <th className="px-4 py-3">Asset</th>
                        <th className="px-4 py-3">Buy Total</th>
                        <th className="px-4 py-3">Sell Total</th>
                        <th className="px-4 py-3">Profit/Loss</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-crypto-card">
                      {realizedPnL.map((item) => (
                        <tr key={item.tokenId} className="hover:bg-crypto-bg/50 transition-colors">
                          <td className="px-4 py-4">
                            <Link to={`/token/${item.tokenId}`} className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-crypto-accent/30 to-crypto-highlight/30" />
                              <div>
                                <div className="font-medium">{item.token}</div>
                                <div className="text-xs text-crypto-muted">{item.symbol}</div>
                              </div>
                            </Link>
                          </td>
                          <td className="px-4 py-4 font-medium">
                            ${item.buyTotal.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 font-medium">
                            ${item.sellTotal.toLocaleString()}
                          </td>
                          <td className="px-4 py-4">
                            <div className={item.pnl >= 0 ? "text-crypto-success" : "text-crypto-danger"}>
                              {item.pnl >= 0 ? "+" : ""} ${Math.abs(item.pnl).toLocaleString()} 
                              <span className="text-xs ml-1">
                                ({item.pnl >= 0 ? "+" : ""}{item.pnlPercentage.toFixed(2)}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleShare(item.tokenId, item.token)}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Link to={`/token/${item.tokenId}`}>
                                <Button variant="ghost" size="sm">
                                  <LinkIcon className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Holdings;
