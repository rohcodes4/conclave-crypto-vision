
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Settings, User, CreditCard, Shield } from "lucide-react";
import { getAvatar, getDisplayName } from "@/lib/utils";

export function formatUserIdentifier(input: string): string {
  if(!input) return null;
  if (input.startsWith('wallet-') && input.endsWith('@walletuser.com')) {
    const address = input.replace('wallet-', '').replace('@walletuser.com', '');
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  if (input.startsWith('telegram-') && input.endsWith('@telegramuser.com')) {
    return input.replace('telegram-', 'TG-').replace('@telegramuser.com', '');
  }

  return input; // Regular email
}

const AccountMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // console.log("getDisplayName")
  // console.log(getDisplayName())

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        className="bg-crypto-accent hover:bg-crypto-highlight text-white border-none"
        onClick={() => navigate("/auth")}
      >
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden p-0 border-2 border-crypto-accent ">
          <div className="flex h-full w-full items-center justify-center rounded-full text-white" dangerouslySetInnerHTML={{ __html: getAvatar() }} >
          {/* <User className="h-5 w-5" /> */}
            {/* {(!user.email.includes("telegram") || !user.email.includes("wallet") )&& user.email? user.email[0].toUpperCase() : <User className="h-5 w-5" />} */}
            {/* {getAvatar()} */}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-crypto-card border-crypto-accent shadow-2xl w-56">
        <DropdownMenuLabel className="text-crypto-muted">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-crypto-card" />
        
        <DropdownMenuItem 
          className="cursor-pointer text-crypto-muted hover:text-white hover:bg-crypto-bg flex items-center"
          onClick={() => navigate("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        {/* <DropdownMenuItem 
          className="cursor-pointer text-crypto-muted hover:text-white hover:bg-crypto-bg flex items-center"
          onClick={() => navigate("/settings?tab=subscription")}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Subscription</span>
        </DropdownMenuItem> */}
        
        <DropdownMenuItem 
          className="cursor-pointer text-crypto-muted hover:text-white hover:bg-crypto-bg flex items-center"
          onClick={() => navigate("/settings?tab=security")}
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Security</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-crypto-card" />
        
        <DropdownMenuItem className="cursor-pointer text-crypto-muted hover:bg-crypto-bg">
          {getDisplayName()}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-crypto-card" />
        
        <DropdownMenuItem
          className="cursor-pointer text-crypto-danger hover:text-white hover:bg-crypto-bg flex items-center"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountMenu;
