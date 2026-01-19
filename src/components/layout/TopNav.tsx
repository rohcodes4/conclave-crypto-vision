
import React, { useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Sparkles,
  Wallet,
  Menu,
  LineChart,
  Settings,
  Search,
  X,
  Clipboard,
  ChartColumnIncreasing,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchSolanaTokens } from "@/services/solscanService";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOnClickOutside } from "@/hooks/use-click-outside";
import UserMenu from "../auth/UserMenu";
import { toast } from "sonner";

interface TopNavProps {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}

const TopNav = ({ navOpen, setNavOpen }: TopNavProps) => {
  const { user } = useAuth();
  // console.log("user")
  // console.log(user)
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showAppMenu, setShowAppMenu] = useState(false);
  const appMenuRef = useRef<HTMLDivElement>(null);

  const handleRugCheckerClick = () => {
    navigate("/rug");
    setShowAppMenu(false);
  };

  const navItems = [
    { name: "Explore", path: "/", icon: Search },
    { name: "New Pairs", path: "/new-pairs", icon: Sparkles },
    { name: "Pump Vision", path: "/pump-vision", icon: LineChart },
    { name: "Leaderboard", path: "/leaderboard", icon: ChartColumnIncreasing },
    { name: "Holdings", path: "/holdings", icon: Wallet },
    { name: "Settings", path: "/settings", icon: Settings },
  ];
  
  const { data: searchResults, isLoading } = useSearchSolanaTokens(searchQuery);
  
  useOnClickOutside(searchRef, () => {
    setShowResults(false);
    if (isMobile) {
      setShowSearch(false);
    }
  });
  
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
    if (isMobile) {
      setShowSearch(false);
    }
  };

  const toggleMobileSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      }, 100);
    }
  };

  const handleBuyToken = () =>{
    // window.open("https://dexscreener.com/solana/7offdxsklazhfbzz1mmbmzuybvgqmvjmsijgb8hjcwp", "_blank");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-44 md:h-[8.5rem] border-b border-crypto-card bg-crypto-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={appMenuRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 mr-2"
              onClick={() => setShowAppMenu(!showAppMenu)}
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
            
            {showAppMenu && (
              <div className="absolute top-full left-0 mt-1 bg-crypto-card border border-crypto-card rounded-md shadow-xl z-50 min-w-[250px]">
                <Link 
                  to="/rug-check" 
                  className="flex items-center gap-3 p-4 hover:bg-crypto-bg/50 transition-colors w-full text-left"
                  onClick={handleRugCheckerClick}
                >
                  <ShieldAlert className="h-5 w-5 flex-shrink-0 text-crypto-warning" />
                  <div>
                    <div className="font-medium">Token Rug Checker</div>
                    <div className="text-xs text-crypto-muted">Audit & risk analysis</div>
                  </div>
                </Link>
                <Link 
                  to="/wallet-analysis" 
                  className="flex items-center gap-3 p-4 hover:bg-crypto-bg/50 transition-colors w-full text-left"
                  onClick={() => setShowAppMenu(false)}
                >
                  <ShieldCheck className="h-5 w-5 flex-shrink-0 text-crypto-success" />
                  <div>
                    <div className="font-medium">Wallet Analysis</div>
                    <div className="text-xs text-crypto-muted">Portfolio & holdings</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center">
          
       
          <Link to="/" className="mr-4 flex items-center">
            <h1 className="text-md font-bold text-gradient whitespace-pre font-pixel">PAPER TRADER</h1>
          </Link>
          {/* {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => setNavOpen(!navOpen)}
            >
              {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )} */}
        </div>


        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex whitespace-pre items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? " text-crypto-accent"
                    : "text-crypto-muted hover:text-crypto-text"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
        

        {/* Search and User Menu */}
        <div className="flex items-center md:gap-2">
          {/* Mobile Search Toggle */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-1"
              onClick={toggleMobileSearch}
            >
              {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>
          )}
          
          {/* Search Bar - Hidden on mobile unless toggled */}
          <div 
            className={cn(
              "relative",
              isMobile ? (showSearch ? "w-full absolute top-16 left-0 right-0 z-50 bg-crypto-bg border-b border-crypto-card p-3" : "hidden") : "w-64"
            )} 
            ref={searchRef}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-crypto-muted" />
              <Input
                type="search"
                placeholder="Search CA..."
                className="pl-10 bg-crypto-card border-crypto-card h-9"
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
              <div className="absolute top-full left-0 w-full max-md:mt-0 mt-1 bg-crypto-card border border-crypto-card rounded-md shadow-lg z-40 max-h-80 overflow-auto">
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
          
          <UserMenu />
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobile && navOpen && (
        <div className="md:hidden absolute left-0 right-0 top-16 bg-crypto-bg border-b border-crypto-card z-30">
          <nav className="container mx-auto py-2 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setNavOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 py-3 px-4 rounded-md mb-1 transition-colors",
                    isActive
                      ? "bg-crypto-accent text-white"
                      : "text-crypto-muted hover:bg-crypto-card hover:text-crypto-text"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
       <div className="flex md:hidden items-center space-x-1 flex-1 justify-start overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex whitespace-pre items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? " text-crypto-accent"
                    : "text-crypto-muted hover:text-crypto-text"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex justify-center items-center pt-4 pb-4 border-white border-[1px] rounded-md w-max mx-auto px-4">
          <Button variant="link" className="bg-crypto-border font-black" onClick={handleBuyToken}>BUY $TBD</Button>
          <div className="flex items-center gap-0 ml-2">
                                <code className="bg-black p-2 rounded-lg text-xs w-full overflow-x-auto whitespace-nowrap">
                                TBD...TBD
                                </code>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="shrink-0" 
                                  onClick={() => {
                                    navigator.clipboard.writeText("TBD........TBD");
                                    toast.success("Copied to clipboard!");
                                    // You could add a toast notification here
                                  }}
                                >
                                  <Clipboard className="h-4 w-4" />
                                </Button>
                              </div>
        </div>
    </header>
  );
};

export default TopNav;
