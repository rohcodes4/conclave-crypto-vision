
import React, { useEffect, useRef, useState } from "react";
import TokenCard from "./TokenCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  logoUrl?: string;
  marketCap?: number;
  fullyDilutedValuation?: number;
  totalSupply?: number;
  circulatingSupply?: number;
  launchDate?: string;
  holder?: number;
}

interface TokenGridProps {
  tokens: Token[];
  title: string;
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMoreData?: boolean;
}

const TokenGrid = ({ 
  tokens, 
  title, 
  isLoading = false, 
  onLoadMore,
  hasMoreData = false
}: TokenGridProps) => {
  // console.log("TOKENS: ",tokens)
  const [displayedTokens, setDisplayedTokens] = useState<Token[]>([]);
  const loaderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Ensure we're getting a valid tokens array
    if (Array.isArray(tokens)) {
      const validTokens = tokens.filter(token =>
        token && typeof token === 'object' && token.id && token.name && token.symbol && token.holder>-1 && token.marketCap>-1
      );
      
      // const visible = validTokens.filter(token => token.holder && token.marketCap );
      // const hidden = validTokens.filter(token => !(token.holder > 0 && token.marketCap > 0));
  
      // setDisplayedTokens(visible); // Or however many to show initially
      setDisplayedTokens(validTokens)
    }else {
      console.error("Invalid tokens data:", tokens);
      setDisplayedTokens([]);
    }
    // if (Array.isArray(tokens)) {
    //   // Filter out any invalid tokens
    //   const validTokens = tokens.filter(token => 
    //     token && typeof token === 'object' && token.id && token.name && token.symbol
    //   );
    //   setDisplayedTokens(validTokens.filter((token)=>  token && typeof token === 'object' && token.holder>0 && token.marketCap>0));      
    // } else {
    //   console.error("Invalid tokens data:", tokens);
    //   setDisplayedTokens([]);
    // }
    
  }, [tokens]);

  useEffect(() => {
    if (!onLoadMore || !hasMoreData) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMoreData) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [onLoadMore, isLoading, hasMoreData]);
  
  // Debug display tokens
  useEffect(() => {
    // console.log("TokenGrid displayedTokens:", displayedTokens);
  }, [displayedTokens]);

  return (
    <div className="w-full">
    {title!="" && <h2 className="mt-4 ml-4 text-xl md:text-2xl font-bold mb-6">{title}</h2>}
      <div className={`${title!=""?"":"mt-2 md:mt-6"} rounded-lg overflow-hidden grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-0 md:gap-0`}>
        {displayedTokens && displayedTokens.length > 0 ? (
          // Show tokens
          displayedTokens.map((token, index) => {
            if(index>=20) return;
        return(    <TokenCard 
              key={token.id} 
              {...token}
            />)
        })
        ) : !isLoading ? (
          // Show empty state
          <div className="col-span-full text-center py-8">
            <p className="text-crypto-muted">No tokens found</p>
          </div>
        ) : null}
        
        {/* Loading indicators */}
        {isLoading && (
          <>
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={`loading-${index}`} className="h-32 w-full rounded-lg" />
            ))}
          </>
        )}
        
        {/* Intersection observer target */}
        {hasMoreData && !isLoading && (
          <div ref={loaderRef} className="col-span-full h-20 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-crypto-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenGrid;
