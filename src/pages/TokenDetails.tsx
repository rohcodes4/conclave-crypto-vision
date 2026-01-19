import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Copy, DollarSign, TrendingUp, Landmark, Users, Coins, Clock, Globe } from "lucide-react";
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

const TokenDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: token, isLoading, error } = useTokenDetail(id || "");
  const { holdings } = useTradeStore();
  const [heliusData, setHeliusData] = useState<HeliusTokenData>({});
  const [heliusLoading, setHeliusLoading] = useState(false);
  
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

  const fetchHeliusData = async (tokenAddress: string) => {
    try {
      setHeliusLoading(true);
      
      // const priceResponse = await fetch(
      //   `https://api.helius.xyz/v0/prices?api-key=${HELIUS_API_KEY}&ids=${tokenAddress}`
      // );
      // const priceData = await priceResponse.json();
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
        holders: metadataData.result?.ownership?.ownerAccounts?.length || token?.holder || 0,
      });
    } catch (error) {
      console.error('Helius API error:', error);
    } finally {
      setHeliusLoading(false);
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchHeliusData(id);
    }
  }, [id, token]);

  if (isLoading || heliusLoading) {
    return <TokenDetailsSkeleton />;
  }
  
  if (error || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Token not found</h2>
        <p className="text-crypto-muted mb-4">We couldn't find details for this token.</p>
        <Link to="/">
          <Button variant="outline">Go back to dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Link to="/">
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
            <code className="bg-[#14100d] border-[1px] border-[#ff7229] p-2 rounded text-xs w-max overflow-x-auto whitespace-nowrap">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="text-crypto-muted"
            onClick={() => window.open(`https://birdeye.so/token/${token.id}?chain=solana`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" /> Birdeye
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PriceChartMoralis tokenAddress={token.id} />
          
          <Tabs defaultValue="overview" className="w-full">
            <div className="border border-[#ff7229] rounded-md mb-4">
              <TabsList className="w-full bg-crypto-card flex">
                <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-crypto-border data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-crypto-border data-[state=active]:text-white">Details</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="mt-0">
              <Card className="bg-crypto-card border-crypto-card border-[1px] border-[#ff7229]">
                <CardHeader>
                  <CardTitle>Token Overview (Helius Enhanced)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start text-xs text-crypto-muted mb-2">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Price (Helius)
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
                        Holders (Helius)
                      </div>
                      <div className="text-xl font-bold text-[#42b192]">
                        {heliusData.holders?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                    <div className="space-y-2 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start text-xs text-crypto-muted mb-2">
                        <Coins className="h-4 w-4 mr-1" />
                        Liquidity
                      </div>
                      <div className="text-xl font-bold text-crypto-success">
                        {formatNumber(heliusData.liquidity)}
                      </div>
                    </div>
                  </div>

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
              <Card className="bg-crypto-card border-crypto-card border-[1px] border-[#ff7229]">
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
                          <span className="font-medium text-crypto-success">{formatNumber(heliusData.liquidity)}</span>
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
                            {(heliusData.holders || token.holder || 0).toLocaleString()}
                          </span>
                        </div>
                        {token.launchDate && token.launchDate > 0 && (
                          <div className="flex justify-between py-2">
                            <span className="text-sm text-crypto-muted">Launch Date</span>
                            <span className="font-medium">{new Date(token.launchDate * 1000).toLocaleDateString()}</span>
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
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => window.open(`https://birdeye.so/token/${token.id}?chain=solana`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Birdeye
                    </Button>
                  </div>
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
            currentPrice={heliusData.price || token.price}
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
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <div className="space-y-2">
          <div className="flex gap-2">
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
