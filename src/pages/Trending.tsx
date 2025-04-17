
import React, { useState } from "react";
import TokenGrid from "@/components/tokens/TokenGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrendingSolanaTokens } from "@/services/solscanService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";

const Trending = () => {
  const { data, isLoading, error } = useTrendingSolanaTokens();
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
    if (!data) return [];
    
    return [...data].sort((a, b) => {
      if (sortOrder === "asc") {
        return (a[sortBy] || 0) - (b[sortBy] || 0);
      }
      return (b[sortBy] || 0) - (a[sortBy] || 0);
    });
  }, [data, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trending on Solana</h1>
          <p className="text-crypto-muted">Most popular tokens by market activity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trending on Solana</h1>
          <p className="text-crypto-muted">Most popular tokens by market activity</p>
        </div>
        <Card className="bg-crypto-card border-crypto-card">
          <CardContent className="flex justify-center items-center p-6">
            <p className="text-crypto-muted">Error loading trending tokens. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Trending on Solana</h1>
        <p className="text-crypto-muted">Most popular tokens by market activity</p>
      </div>
      
      <div className="flex gap-2 mb-4 overflow-x-auto py-2 no-scrollbar">
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
      
      <Card className="rounded-lg bg-crypto-card border-crypto-card max-md:border-[1px] max-md:border-[#ff7229]">
        {/* <CardHeader>
          <CardTitle>Trending Solana Tokens</CardTitle>
        </CardHeader> */}
        <CardContent>
          <TokenGrid tokens={sortedTokens} title="" />
        </CardContent>
      </Card>
    </div>
  );
};

export default Trending;
