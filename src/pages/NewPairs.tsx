
import React, { useState, useEffect } from "react";
import TokenGrid from "@/components/tokens/TokenGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewPairs } from "@/services/solscanService";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TOKENS_PER_PAGE = 72;

const NewPairs = () => {
  const [selectedChain, setSelectedChain] = useState("solana");
  const [page, setPage] = useState(1);
  const [displayedTokens, setDisplayedTokens] = useState<any[]>([]);
  const { data: newTokens, isLoading, error } = useNewPairs();

  // console.log("newTokens")
  console.log(newTokens)
  // Filter tokens if needed
  const allTokens = newTokens || [];
  const hasMore = displayedTokens.length < allTokens.length;

  useEffect(() => {
    if (allTokens.length > 0 && page === 1) {
      // Initial load
      setDisplayedTokens(allTokens.slice(0, TOKENS_PER_PAGE));
    }
  }, [allTokens, page]);

  useEffect(() => {
    // Reset pagination when chain changes
    setPage(1);
    if (allTokens.length > 0) {
      setDisplayedTokens(allTokens.slice(0, TOKENS_PER_PAGE));
    } else {
      setDisplayedTokens([]);
    }
  }, [selectedChain, allTokens]);

  const loadMoreTokens = () => {
    const nextPage = page + 1;
    const nextTokens = allTokens.slice(0, nextPage * TOKENS_PER_PAGE);
    setDisplayedTokens(nextTokens);
    setPage(nextPage);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">New Pairs</h1>
        <p className="text-crypto-muted">Recently launched tokens on DEXes</p>
      </div>
      
      {/* <div className="flex gap-2 md:gap-4 overflow-x-auto py-2 no-scrollbar">
        <button 
          className={`${selectedChain === 'solana' ? 'bg-crypto-accent' : 'bg-crypto-bg hover:bg-crypto-card'} px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${selectedChain !== 'solana' ? 'text-crypto-muted' : ''}`}
          onClick={() => setSelectedChain('solana')}
        >
          Solana
        </button>
      </div> */}
      
      {isLoading && page === 1 ? (
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        //   {Array(8).fill(0).map((_, i) => (
        //     <Skeleton key={i} className="h-32 w-full rounded-lg" />
        //   ))}
        // </div>
        <div className="flex flex-col items-center justify-center h-screen bg-crypto-bg">
             <div className="w-16 h-16 border-4 border-crypto-accent border-t-transparent rounded-full animate-spin mb-8"></div>
             <p className="text-crypto-muted">Loading...</p>
           </div>
      ) : error ? (
        <Card className="bg-crypto-card border-crypto-card">
          <CardContent className="flex justify-center items-center p-6">
            <p className="text-crypto-muted">Error loading new token pairs. Please try again later.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-crypto-card border-crypto-card rounded-lg">
          {/* <CardHeader>
            <CardTitle>New Token Pairs on Solana</CardTitle>
          </CardHeader> */}
          <CardContent className="max-md:p-0">
            <TokenGrid 
              tokens={displayedTokens} 
              title="" 
              // title="Latest Pairs" 
              isLoading={isLoading}
              onLoadMore={loadMoreTokens}
              hasMoreData={hasMore}
            />
            
            {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-crypto-bg border-crypto-card">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Average Launch Price</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xl font-bold">
                    ${allTokens.length > 0 
                      ? (allTokens.reduce((acc, token) => acc + (token.price || 0), 0) / allTokens.length).toFixed(6)
                      : "0.00"}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-crypto-bg border-crypto-card">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Average 24h Change</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xl font-bold">
                    {allTokens.length > 0 
                      ? `${(allTokens.reduce((acc, token) => acc + (token.change24h || 0), 0) / allTokens.length).toFixed(2)}%`
                      : "0.00%"}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-crypto-bg border-crypto-card">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Total New Tokens</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xl font-bold">{allTokens.length}</p>
                </CardContent>
              </Card>
            </div> */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewPairs;
