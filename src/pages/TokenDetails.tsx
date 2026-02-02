import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Copy, DollarSign, TrendingUp, Landmark, Users, Coins, Clock, Globe, Shield, AlertTriangle, ShieldAlert, BarChart3 } from "lucide-react";
import PriceChartMoralis from "@/components/tokens/PriceChartMoralis";
import TradeForm from "@/components/trade/TradeForm";
import { useTokenDetail } from "@/services/solscanService";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeStore } from "@/services/tradeService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY || '9d1898dc-11bc-4367-b34f-7cb58ef29d76';

interface HeliusTokenData {
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
  liquidity?: number;
  holders?: number;
}

interface RugcheckData {
  score?: number;
  score_normalised?: number;
  price?: number;
  totalHolders?: number;
  totalMarketLiquidity?: number;
  creator?: string;
  creatorBalance?: number;
  topHolders?: Array<{
    address: string;
    pct: number;
    uiAmount: number;
    owner: string;
  }>;
  risks?: Array<{ name: string; description: string; level: string }>;
  markets?: Array<any>;
  rugged: boolean;
  launchpad?: { name: string; platform: string };
}

const TokenDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: token, isLoading, error } = useTokenDetail(id || "");
  console.log('lcc',token)
  const { holdings } = useTradeStore();
  const [heliusData, setHeliusData] = useState<HeliusTokenData>({});
  const [rugcheckData, setRugcheckData] = useState<RugcheckData>({ rugged: false });
  const [heliusLoading, setHeliusLoading] = useState(false);
  const [rugcheckLoading, setRugcheckLoading] = useState(false);
  const [dexData, setDexData] = useState<any>(token);
  const [dexLoading, setDexLoading] = useState(false);

  const currentHolding = holdings.find(h => h.id === id);

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === 0) return 'N/A';
    if (num >= 1_000_000_000_000) {
      return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
    } else if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(2)}K`;
    }
    return `$${num.toFixed(8)}`;
  };
  
  const formatNumberWithoutCurrency = (num: number | undefined) => {
    if (num === undefined || num === 0) return 'N/A';
    if (num >= 1_000_000_000_000) {
      return `${(num / 1_000_000_000_000).toFixed(2)}T`;
    } else if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    }
    return `${num.toFixed(8)}`;
  };

  const formatPercentage = (pct: number) => {
    return `${(pct).toFixed(2)}%`;
  };

  const fetchDexData = async (tokenAddress: string) => {
    if (!tokenAddress) return;
    if(token?.pairs) {
      setDexData(token.pairs)
      return;
    };
    
    setDexLoading(true);
    try {
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setDexData(data);
        console.log('DexScreener data loaded:', data);
      }
    } catch (error) {
      console.error('DexScreener fetch failed:', error);
    } finally {
      setDexLoading(false);
    }
  };

  const fetchRugcheckData = async (tokenAddress: string) => {
    if (!tokenAddress) return;
    setRugcheckLoading(true);
    try {
      const response = await fetch(
        `https://api.rugcheck.xyz/v1/tokens/${tokenAddress}/report`,
        { headers: { 'accept': 'application/json' } }
      );
      if (response.ok) {
        const data = await response.json();
        setRugcheckData(data);
        console.log('Rugcheck data loaded:', data);
      }
    } catch (error) {
      console.error('Rugcheck fetch failed:', error);
    } finally {
      setRugcheckLoading(false);
    }
  };

  const fetchHeliusData = async (tokenAddress: string) => {
    try {
      setHeliusLoading(true);
      
      const priceData = null;

      const metadataResponse = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'get-asset',
            method: 'getAsset',
            params: {
              id: tokenAddress,
              displayOptions: { showFungible: true }
            }
          })
        }
      );
      const metadataData = await metadataResponse.json();

      setHeliusData({
        price: priceData?.data?.[tokenAddress]?.price || token?.price || 0,
        priceChange24h: priceData?.data?.[tokenAddress]?.price24hChange || token?.change24h || 0,
        marketCap: priceData?.data?.[tokenAddress]?.marketcap || token?.marketCap || 0,
        volume24h: priceData?.data?.[tokenAddress]?.volume?.h24 || token?.volume24h || 0,
        liquidity: priceData?.data?.[tokenAddress]?.liquidity || 0,
        holders: token?.holder?.totalHolders || 0,
      });
    } catch (error) {
      console.error('Helius API error:', error);
    } finally {
      setHeliusLoading(false);
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchDexData(id);
      fetchHeliusData(id);
      fetchRugcheckData(id);
    }
  }, [id, token]);

  if (isLoading || heliusLoading || rugcheckLoading) {
    return <TokenDetailsSkeleton />;
  }
  
  if (error || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Token not found</h2>
        <p className="text-crypto-muted mb-4">We couldn't find details for this token.</p>
        <Link to="/dashboard">
          <Button variant="outline">Go back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const primaryPairAddress = dexData?.pairs?.[0]?.pairAddress;
  const getRiskColor = (score?: number) => {
    if (!score) return 'text-crypto-muted';
    if (score >= 800) return 'text-crypto-success';
    if (score >= 500) return 'text-crypto-warning';
    return 'text-crypto-danger';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Link to="/dashboard">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          {token.logoUrl && (
            <img 
              src={token.logoUrl} 
              alt={token.name} 
              className="h-6 w-6 rounded-full"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
          <span>{token.name} ({token.symbol})</span>
        </h1>
        <div className="mt-0 pt-1">
          <div className="flex items-center gap-2">
            <code className="bg-[#14100d] p-2 rounded text-xs w-max overflow-x-auto whitespace-nowrap">
              {token.id.slice(0,4)}...{token.id.slice(-4)}
            </code>
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0" 
              onClick={() => {
                navigator.clipboard.writeText(token.id);
                toast.success("Copied to clipboard!");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="md:ml-auto flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-crypto-muted"
            onClick={() => window.open(`https://dexscreener.com/solana/${token.id}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" /> DexScreener
          </Button>          
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PriceChartMoralis 
            tokenAddress={token.id}
            pairAddress={primaryPairAddress} 
          />
          
          <Tabs defaultValue="overview" className="w-full">
            <div className="rounded-md mb-4">
              <TabsList className="w-full bg-crypto-card flex">
                <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-crypto-border data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-crypto-border data-[state=active]:text-white">Details</TabsTrigger>
                <TabsTrigger value="security" className="flex-1 data-[state=active]:bg-crypto-border data-[state=active]:text-white">Security</TabsTrigger>
                <TabsTrigger value="holders" className="flex-1 data-[state=active]:bg-crypto-border data-[state=active]:text-white">Holders</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="mt-0">
              <Card className="bg-crypto-card">
                <CardHeader>
                  <CardTitle>Token Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start text-xs text-crypto-muted mb-2">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Price
                      </div>
                      <div className="text-2xl font-bold">
                        {formatNumber(heliusData.price)}
                      </div>
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start text-xs text-crypto-muted mb-2">
                        <Landmark className="h-4 w-4 mr-1" />
                        Market Cap
                      </div>
                      <div className="text-xl font-bold text-[#438fff]">
                        {formatNumber(heliusData.marketCap)}
                      </div>
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start text-xs text-crypto-muted mb-2">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        24h Change
                      </div>
                      <div className={`text-xl font-bold ${heliusData.priceChange24h! >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                        {heliusData.priceChange24h! >= 0 ? '+' : ''}{heliusData.priceChange24h?.toFixed(2)}%
                      </div>
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start text-xs text-crypto-muted mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        24h Volume
                      </div>
                      <div className="text-xl font-bold">
                        {formatNumber(heliusData.volume24h)}
                      </div>
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start text-xs text-crypto-muted mb-2">
                        <Users className="h-4 w-4 mr-1" />
                        Holders
                      </div>
                      <div className="text-xl font-bold text-[#42b192]">
                        {(rugcheckData.totalHolders || heliusData.holders)?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start text-xs text-crypto-muted mb-2">
                        <Coins className="h-4 w-4 mr-1" />
                        Liquidity
                      </div>
                      <div className="text-xl font-bold text-crypto-success">
                        {dexData?.pairs?.[0]?.liquidity?.usd 
                            ? formatNumber(dexData.pairs[0].liquidity.usd) 
                            : rugcheckData.totalMarketLiquidity 
                              ? formatNumber(rugcheckData.totalMarketLiquidity) 
                              : heliusData.liquidity 
                                ? formatNumber(heliusData.liquidity) 
                                : 'N/A'
                        }
                      </div>
                    </div>
                  </div>

                  {rugcheckData.score && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-crypto-bg to-crypto-card border border-crypto-card rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <ShieldAlert className="h-6 w-6 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-lg">RugCheck Score</div>
                          <div className={`text-3xl font-black ${getRiskColor(rugcheckData.score)}`}>
                            {rugcheckData.score_normalised || rugcheckData.score} / 100
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-crypto-muted">
                        Raw Score: {rugcheckData.score}/1000 | {rugcheckData.rugged ? 'RUGGED' : 'Not rugged'}
                      </div>
                    </div>
                  )}

                  {(token.twitter || token.telegram || token.website) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-6 border-t border-crypto-card">
                      <div>
                        <div className="flex items-center mb-4">
                          <Globe className="h-5 w-5 text-crypto-accent mr-2" />
                          <div className="text-sm font-medium text-crypto-muted">Social Links</div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {token.twitter && (
                            <a 
                              href={token.twitter.startsWith('http') ? token.twitter : `https://twitter.com/${token.twitter}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 bg-crypto-bg border border-crypto-card rounded-lg text-sm hover:bg-crypto-border transition-all"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Twitter
                            </a>
                          )}
                          {token.telegram && (
                            <a 
                              href={token.telegram.startsWith('http') ? token.telegram : `https://t.me/${token.telegram}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 bg-crypto-bg border border-crypto-card rounded-lg text-sm hover:bg-crypto-border transition-all"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Telegram
                            </a>
                          )}
                          {token.website && (
                            <a 
                              href={token.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 bg-crypto-bg border border-crypto-card rounded-lg text-sm hover:bg-crypto-border transition-all"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-crypto-muted mb-2 flex items-center">
                            <Coins className="h-4 w-4 mr-2" />
                            Total Supply
                          </div>
                          <div className="font-medium text-lg">
                            {formatNumber(token.totalSupply)} {token.symbol}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-crypto-muted mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Your Holdings
                          </div>
                          <div className="font-medium text-lg">
                            {currentHolding 
                              ? `${currentHolding.amount.toLocaleString()} ${token.symbol} (Value: ${formatNumber(currentHolding.amount * (heliusData.price || token.price))})` 
                              : "No position"
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <Card className="bg-crypto-card">
                <CardHeader>
                  <CardTitle>Token Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {token.description && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-crypto-muted">Description</div>
                      <p className="text-sm leading-relaxed">{token.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium text-crypto-muted mb-4">Token Metrics</div>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-crypto-card">
                          <span className="text-sm text-crypto-muted">Price</span>
                          <span className="font-medium">${(heliusData.price || token.price)?.toLocaleString(undefined, {maximumFractionDigits: 8})}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-crypto-card">
                          <span className="text-sm text-crypto-muted">Market Cap</span>
                          <span className="font-medium text-[#438fff]">{formatNumber(heliusData.marketCap || token.marketCap)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-crypto-card">
                          <span className="text-sm text-crypto-muted">24h Volume</span>
                          <span className="font-medium">{formatNumber(heliusData.volume24h || token.volume24h)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-crypto-muted">Liquidity</span>
                          <span className="font-medium text-crypto-success">{dexData?.pairs?.[0]?.liquidity?.usd 
                            ? formatNumber(dexData.pairs[0].liquidity.usd) 
                            : rugcheckData.totalMarketLiquidity 
                              ? formatNumber(rugcheckData.totalMarketLiquidity) 
                              : heliusData.liquidity 
                                ? formatNumber(heliusData.liquidity) 
                                : 'N/A'
                          }</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-crypto-muted mb-4">Network Data</div>
                      <div className="space-y-3">
                        {token.totalSupply && (
                          <div className="flex justify-between py-2 border-b border-crypto-card">
                            <span className="text-sm text-crypto-muted">Total Supply</span>
                            <span className="font-medium">{formatNumber(token.totalSupply)} {token.symbol}</span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 border-b border-crypto-card">
                          <span className="text-sm text-crypto-muted">Holders</span>
                          <span className="font-medium text-[#42b192]">
                            {(rugcheckData.totalHolders || heliusData.holders || token.holder || 0).toLocaleString()}
                          </span>
                        </div>
                        {token.launchDate && token.launchDate > 0 && (
                          <div className="flex justify-between py-2">
                            <span className="text-sm text-crypto-muted">Launch Date</span>
                            <span className="font-medium">{new Date(token.launchDate).toLocaleString()}</span>
                          </div>
                        )}
                        {rugcheckData.launchpad && (
                          <div className="flex justify-between py-2">
                            <span className="text-sm text-crypto-muted">Launchpad</span>
                            <span className="font-medium">{rugcheckData.launchpad.name} ({rugcheckData.launchpad.platform})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-crypto-card">
                    <div className="text-sm font-medium text-crypto-muted mb-4 flex items-center">
                      Contract Address
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-crypto-bg p-3 rounded-lg text-xs w-full overflow-x-auto whitespace-nowrap border border-crypto-card">
                        {token.id}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="shrink-0 h-10 w-10"
                        onClick={() => {
                          navigator.clipboard.writeText(token.id);
                          toast.success("Copied to clipboard!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => window.open(`https://dexscreener.com/solana/${token.id}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on DexScreener
                    </Button>                    
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card className="bg-crypto-card">
                <CardHeader>
                  <CardTitle>Security Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-400/30 rounded-xl">
                        <AlertTriangle className="h-6 w-6 text-orange-500" />
                        <div>
                          <div className="font-bold text-lg">Risk Score</div>
                          <div className={`text-3xl font-black ${getRiskColor(rugcheckData.score)}`}>
                            {rugcheckData.score_normalised || rugcheckData.score || 'N/A'} / 100
                          </div>
                        </div>
                      </div>
                      {rugcheckData.risks && rugcheckData.risks.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-crypto-muted mb-3">Risks Found</div>
                          <div className="space-y-2">
                            {rugcheckData.risks.map((risk, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-crypto-bg border border-crypto-card rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">{risk.name}</div>
                                  <div className="text-sm text-crypto-muted">{risk.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-crypto-muted mb-4">Creator Info</div>
                      {rugcheckData.creator && (
                        <div className="space-y-3 p-4 bg-crypto-bg border border-crypto-card rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-sm text-crypto-muted">Creator Address</span>
                            <code className="text-xs bg-crypto-card px-2 py-1 rounded">
                              {rugcheckData.creator.slice(0,8)}...{rugcheckData.creator.slice(-8)}
                            </code>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-crypto-muted">Creator Balance</span>
                            <span className="font-medium">{formatPercentage((rugcheckData.creatorBalance || 0) / 1e13)} of supply</span>
                          </div>
                        </div>
                      )}
                      {rugcheckData.markets && rugcheckData.markets.length > 0 && (
                        <div className="mt-6">
                          <div className="text-sm font-medium text-crypto-muted mb-3">Liquidity Pools</div>
                          <div className="space-y-3">
                            {rugcheckData.markets.slice(0, 2).map((market: any, index: number) => (
                              <div key={index} className="p-3 bg-crypto-bg border border-crypto-card rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{market.marketType}</div>
                                    <div className="text-xs text-crypto-muted">{market.pubkey.slice(0,8)}...</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold">{formatNumber(market.lp?.baseUSD || 0)}</div>
                                    <div className="text-xs text-crypto-muted">
                                      {market.lp?.lpLockedPct || 0}% LP Locked
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="holders" className="mt-0">
              <Card className="bg-crypto-card">
                <CardHeader>
                  <CardTitle>Top Holders</CardTitle>
                </CardHeader>
                <CardContent>
                  {rugcheckData.topHolders && rugcheckData.topHolders.length > 0 ? (
                    <div className="space-y-3">
                      {rugcheckData.topHolders.slice(0, 10).map((holder: any, index: number) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-crypto-card last:border-b-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="font-bold text-sm">{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium">{holder.address.slice(0,6)}...{holder.address.slice(-4)}</div>
                              <div className="text-xs text-crypto-muted">{holder.owner.slice(0,6)}...</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatPercentage(holder.pct)}</div>
                            <div className="text-sm">{formatNumberWithoutCurrency(holder.uiAmount)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-crypto-muted">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <div>No holder data available</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <TradeForm 
            tokenId={token.id}
            tokenName={token.name}
            tokenSymbol={token.symbol}
            currentPrice={heliusData.price || token.price || rugcheckData.price}
          />
        </div>
      </div>
    </div>
  );
};

const TokenDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <div className="h-9 w-9">
        <Skeleton className="h-full w-full rounded-md" />
      </div>
      <Skeleton className="h-8 w-48" />
      <div className="ml-auto flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <div className="space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
      <div className="lg:col-span-1">
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export default TokenDetails;
