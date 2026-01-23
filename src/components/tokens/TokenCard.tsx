
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TokenCardProps {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  logoUrl?: string;
  marketCap?: number;
  fullyDilutedValuation?: number;
  holder?: object;
  totalSupply?: number;
  circulatingSupply?: number;
  launchDate?: string;
  
}

const TokenCard = ({
  id,
  name,
  symbol,
  price,
  change24h,
  volume24h,
  logoUrl,
  marketCap,
  fullyDilutedValuation,
  holder,
  totalSupply,
  circulatingSupply,
  launchDate,
}: TokenCardProps) => {
  const isPositive = change24h >= 0;

  // Format number with appropriate suffix
  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return 'N/A';
    
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `$${(num / 1_000).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <Link to={`/token/${id}`}>
      <Card className="overflow-hidden bg-crypto-card transition-all h-full p-6 ">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-crypto-card flex items-center justify-center overflow-hidden flex-shrink-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`${name} logo`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-crypto-accent/30 to-crypto-highlight/30" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-sm sm:text-base md:text-lg line-clamp-1">{name}</h3>
                <p className="text-crypto-muted text-xs sm:text-sm">{symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm sm:text-base">
                ${price < 0.01 ? price.toFixed(6) : price.toLocaleString()}
              </p>
              {/* <div
                className={cn(
                  "flex items-center justify-end text-xs sm:text-sm",
                  isPositive ? "text-crypto-success" : "text-crypto-danger"
                )}
              >
                {isPositive ? (
                  <ArrowUp className="h-3 w-3 mr-1 flex-shrink-0" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1 flex-shrink-0" />
                )}
                {Math.abs(change24h).toFixed(2)}%
              </div> */}
            </div>
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs sm:text-sm">
            {marketCap >= 0 && (
              <div className="flex text-[#438fff]">
                <span className="mr-2">MC:</span>
                <span>{marketCap==0?"N/A":formatNumber(marketCap)}</span>
              </div>
            )}
            
            {(holder.totalHolders >= 0 || holder.total >= 0) && <div className={`flex ${marketCap >= 0 ? "justify-end" : ""} text-[#42b192]`}>
              <span className="mr-2">Holders:</span>
              <span>{holder.totalHolders || holder.total}</span>
            </div>}
            
            {/* {launchDate && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-between items-center cursor-help">
                      <span className="text-crypto-muted flex items-center">
                        Launch <Info className="h-3 w-3 ml-1" />
                      </span>
                      <span>{launchDate.split('T')[0] || 'New'}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Token launch date</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )} */}
            
            {/* {fullyDilutedValuation && (
              <div className="flex justify-between">
                <span className="text-crypto-muted">FDV:</span>
                <span>{formatNumber(fullyDilutedValuation)}</span>
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TokenCard;
