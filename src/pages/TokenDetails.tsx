
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Share2, Link2, Clock, Users, Landmark, Coins, DollarSign, TrendingUp, Clipboard, Globe } from "lucide-react";
import PriceChart from "@/components/tokens/PriceChart";
import TradeForm from "@/components/trade/TradeForm";
import { useTokenDetail } from "@/services/solscanService";
import { Skeleton } from "@/components/ui/skeleton";
import { useTradeStore } from "@/services/tradeService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PriceChartMoralis } from "@/components/tokens/PriceChartMoralis";

const TokenDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: token, isLoading, error } = useTokenDetail(id || "");
  const { holdings } = useTradeStore();
  
  // Find current holding for this token
  const currentHolding = holdings.find(h => h.id === id);

  const formatNumber = (num: number | undefined) => {
  if (num === undefined) return 'N/A';

  if (num >= 1_000_000_000_000) {
    return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  } else if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  }

  return `$${num.toFixed(2)}`;
};

  
  if (isLoading) {
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
            />
          )}
          <span>{token.name} ({token.symbol})</span>
        </h1>
        <div className="md:ml-auto flex gap-2">
          {/* <Button variant="ghost" size="sm" className="text-crypto-muted">
            <Share2 className="h-4 w-4 mr-2" /> Share
          </Button> */}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-crypto-muted"
            onClick={() => window.open(`https://solscan.io/token/${token.id}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" /> View on Explorer
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* <PriceChart 
            tokenName={token.name} 
            tokenSymbol={token.symbol} 
            currentPrice={token.price} 
            priceChange={token.change24h} 
          /> */}
    <PriceChartMoralis tokenAddress={token.id} />
          {/* <PriceChartMoralis tokenAddress={token.id}/> */}
          
          <Tabs defaultValue="overview" className="w-full">
            <div className="border border-[#ff7229] rounded-md mb-4">
              <TabsList className="w-full bg-crypto-card flex">
                <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-crypto-border data-[state=active]:text-white">Overview</TabsTrigger>
                <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-crypto-border data-[state=active]:text-white">Details</TabsTrigger>
                {/* {token.description && <TabsTrigger value="about" className="flex-1">About</TabsTrigger>} */}
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="mt-0">
              <Card className="bg-crypto-card border-crypto-card border-[1px] border-[#ff7229]">
                <CardHeader>
                  <CardTitle>Token Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-crypto-accent mr-2" />
                        <div>
                          <div className="text-sm text-crypto-muted mb-1">Price</div>
                          <div className="font-medium">${token.price.toLocaleString(undefined, {maximumFractionDigits: 6})}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Link2 className="h-5 w-5 text-crypto-accent mr-2" />
                        <div>
                          <div className="text-sm text-crypto-muted mb-1">Market Cap</div>
                          <div className="font-medium text-[#438fff]">{formatNumber(token.marketCap) || "N/A"}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-crypto-accent mr-2" />
                        <div>
                          <div className="text-sm text-crypto-muted mb-1">24h Change</div>
                          <div className={token.change24h >= 0 ? "text-crypto-success" : "text-crypto-danger"}>
                            {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Landmark className="h-5 w-5 text-crypto-accent mr-2" />
                        <div>
                          <div className="text-sm text-crypto-muted mb-1">24h Volume</div>
                          <div className="font-medium">{token.volume24h>0?formatNumber(token.volume24h):"N/A"}</div>
                        </div>
                      </div>
                     
                    </div>
                    <div className="space-y-4">
                    
                      { (token.twitter || token.telegram || token.website)  && <div className="flex items-center">
                        <Globe className="h-5 w-5 text-crypto-accent mr-2" />
                        <div>
                          <div className="text-sm text-crypto-muted mb-1">Links</div>
                          <div className="flex gap-2">
                         {token.twitter && <a href={token.twitter} target="_blank" className="font-medium flex">
                            <ExternalLink ></ExternalLink>Twitter
                          </a>}
                         {token.telegram && <a href={token.telegram} target="_blank" className="font-medium flex">
                            <ExternalLink ></ExternalLink>Telegram
                          </a>}
                         {token.website && <a href={token.website} target="_blank" className="font-medium flex">
                            <ExternalLink ></ExternalLink>Website
                          </a>}
                          </div>
                        </div>
                      </div>}
                      <div className="flex items-center">
                        <Coins className="h-5 w-5 text-crypto-accent mr-2" />
                        <div>
                          <div className="text-sm text-crypto-muted mb-1">Total Supply</div>
                          <div className="font-medium">
                            {token.totalSupply ? `${formatNumber(token.totalSupply)} ${token.symbol}` : "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-crypto-accent mr-2" />
                        <div>
                          <div className="text-sm text-crypto-muted mb-1">Your Holdings</div>
                          <div className="font-medium">
                            {currentHolding ? 
                              `${currentHolding.amount.toLocaleString()} ${token.symbol} (Value: $${(currentHolding.amount * token.price).toLocaleString()})` : 
                              "None"
                            }
                          </div>
                        </div>
                      </div>
                    
                     
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <Card className="bg-crypto-card border-crypto-card border-[1px] border-[#ff7229]">
                <CardHeader>
                  <CardTitle>Detailed Information</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="prose prose-invert max-w-none mb-4">
                <div className="text-sm text-crypto-muted mb-1">Description</div>
                      <p>{token.description}</p>
                    </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    
                    {/* {token.fullyDilutedValuation && (
                      <div>
                        <div className="text-sm text-crypto-muted mb-1">Fully Diluted Valuation</div>
                        <div className="font-medium">{formatNumber(token.fullyDilutedValuation)}</div>
                      </div>
                    )} */}
                    
                    {token.totalSupply && (
                      <div>
                        <div className="text-sm text-crypto-muted mb-1">Total Supply</div>
                        <div className="font-medium">{formatNumber(token.totalSupply)} {token.symbol}</div>
                      </div>
                    )}
                    
                    {token.holder && (
                      <div>
                        <div className="text-sm text-crypto-muted mb-1">Holders</div>
                        <div className="font-medium text-[#42b192]">{token.holder.toLocaleString()}</div>
                      </div>
                    )}
                    
                    {token.launchDate && (
                      <div>
                        <div className="text-sm text-crypto-muted mb-1">Launch Date</div>
                        <div className="font-medium">{new Date(token.launchDate * 1000).toLocaleDateString()}</div>
                      </div>
                    )}
                    
                    {/* <div>
                      <div className="text-sm text-crypto-muted mb-1">All-Time High</div>
                      <div className="font-medium">Coming soon</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-crypto-muted mb-1">All-Time Low</div>
                      <div className="font-medium">Coming soon</div>
                    </div>*/}
                  </div> 
                  
                  <div className="mt-6 border-t border-crypto-card pt-4">
                    <div className="text-sm text-crypto-muted mb-2">Contract Address</div>
                    <div className="flex items-center gap-2">
                      <code className="bg-crypto-bg p-2 rounded text-xs w-full overflow-x-auto whitespace-nowrap">
                        {token.id}
                      </code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="shrink-0" 
                        onClick={() => {
                          navigator.clipboard.writeText(token.id);
                          toast.success("Copied to clipboard!");
                          // You could add a toast notification here
                        }}
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
               
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* {token.description && (
              <TabsContent value="about" className="mt-0">
                <Card className="bg-crypto-card border-crypto-card border-[1px] border-[#ff7229]">
                  <CardHeader>
                    <CardTitle>About {token.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <p>{token.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )} */}
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <TradeForm 
            tokenId={token.id}
            tokenName={token.name}
            tokenSymbol={token.symbol}
            currentPrice={token.price}
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
        <Skeleton className="h-[300px] w-full rounded-xl" />
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export default TokenDetails;
