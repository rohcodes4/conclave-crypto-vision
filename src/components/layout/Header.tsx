
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { useSearchSolanaTokens } from "@/services/solscanService";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOnClickOutside } from "@/hooks/use-click-outside";
import UserMenu from "../auth/UserMenu";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const { data: searchResults, isLoading } = useSearchSolanaTokens(searchQuery);
  
  useOnClickOutside(searchRef, () => setShowResults(false));
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 1) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSelectToken = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-crypto-card bg-crypto-bg/80 px-4 backdrop-blur-sm">
      {isMobile && (
        <Button variant="ghost" size="icon" className="mr-2" onClick={onMenuClick}>
          <Menu className="h-5 w-5 text-crypto-muted" />
        </Button>
      )}
      
      {/* Search component - hidden on mobile */}
      <div className={`flex ${isMobile ? 'w-full' : 'max-w-md'} items-center gap-2 relative`} ref={searchRef}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-crypto-muted" />
          <Input
            type="search"
            placeholder="Search token address..."
            className="pl-10 bg-crypto-card border-crypto-card"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.length > 1 && setShowResults(true)}
          />
        </div>
        
        {showResults && searchQuery.length > 1 && isLoading && (
          <div className="absolute top-full left-0 w-full mt-1 bg-crypto-card border border-crypto-card rounded-md shadow-lg z-40 p-4 text-center">
            <div className="text-crypto-muted">Searching...</div>
          </div>
        )}
        
        {showResults && searchQuery.length > 1 && searchResults && searchResults.length === 0 && !isLoading && (
          <div className="absolute top-full left-0 w-full mt-1 bg-crypto-card border border-crypto-card rounded-md shadow-lg z-40 p-4 text-center">
            <div className="text-crypto-muted">No tokens found</div>
          </div>
        )}
        
        {showResults && searchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-1 bg-crypto-card border border-crypto-card rounded-md shadow-lg z-40 max-h-80 overflow-auto">
            {searchResults.map((token) => (
              <Link 
                to={`/token/${token.id}`} 
                key={token.id} 
                className="flex items-center gap-3 p-3 hover:bg-crypto-bg/50 transition-colors"
                onClick={handleSelectToken}
              >
                <div className="h-8 w-8 rounded-full bg-crypto-card flex items-center justify-center overflow-hidden">
                  {token.logoUrl ? (
                    <img
                      src={token.logoUrl}
                      alt={`${token.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-crypto-accent/30 to-crypto-highlight/30" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{token.name}</div>
                  <div className="text-xs text-crypto-muted">{token.symbol}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
