
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Sparkles,
  Wallet,
  LogOut,
  Settings,
  LineChart,
  Search
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { user, signOut } = useAuth();
  
  const navItems = [
    { name: "Explore", path: "/", icon: Search },
    { name: "New Pairs", path: "/new-pairs", icon: Sparkles },
    { name: "Pump Vision", path: "/pump-vision", icon: LineChart },
    { name: "Holdings", path: "/holdings", icon: Wallet },
    { name: "Account Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r border-crypto-card bg-crypto-bg transition-transform md:translate-x-0",
        className
      )}
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="h-16 flex items-center justify-center border-b border-crypto-card">
          <h1 className="text-2xl font-bold text-gradient">PAPER TRADER</h1>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
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
        </ScrollArea>

        <div className="border-t border-crypto-card p-4">
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-8 w-8 bg-crypto-accent overflow-hidden">
                  <AvatarFallback className="bg-crypto-accent text-white">
                    {user.email ? user.email[0].toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <div className="font-medium text-sm">{user.email || "User"}</div>
                  <div className="text-xs text-crypto-muted">Connected via Discord</div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-crypto-danger border-crypto-card"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 border-crypto-card"
              onClick={() => window.location.href = '/auth'}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
