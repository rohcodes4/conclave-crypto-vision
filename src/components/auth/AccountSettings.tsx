
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTradeStore } from "@/services/tradeService";
import { toast } from "sonner";
import { Wallet, Mail, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserIdentifier } from "./AccountMenu";

const AccountSettings = () => {
  const { balance, updateBalance } = useTradeStore();
  const { user } = useAuth();
  const [newBalance, setNewBalance] = useState("10000");
  const [isOpen, setIsOpen] = useState(false);
  
  // Get login provider
  const getLoginProvider = () => {
    if (!user) return "Not logged in";
    
    if (user.app_metadata?.provider === "discord") {
      return "Discord";
    } else if (user.email) {
      return "Email";
    }
    
    return "Unknown";
  };
  
  // Get first letter of email or username for avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };
  
  // Get avatar URL from user metadata if available
  const getAvatarUrl = () => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || null;
  };

  const handleBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Only allow numeric input with up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setNewBalance(value);
    }
  };

  const handleSave = async () => {
    try {
      const balanceValue = parseFloat(newBalance);
      
      if (isNaN(balanceValue) || balanceValue < 0) {
        toast.error("Please enter a valid balance amount");
        return;
      }
      
      await updateBalance(balanceValue);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating balance:", error);
      toast.error("Failed to update balance");
    }
  };

  return (
    <>
      <Button variant="ghost" className="md:p-0 md:pr-4" onClick={() => setIsOpen(true)}>
        <Wallet className="h-4 w-4 text-crypto-border" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-m bg-[rgba(0,0,0,1)]">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Adjust your account settings and trading parameters.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 rounded-full bg-crypto-accent overflow-hidden border border-crypto-card">
                <AvatarImage src={getAvatarUrl() || ""} alt="User avatar" className="h-full w-full object-cover" />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{formatUserIdentifier(user?.email) || formatUserIdentifier(user?.user_metadata?.full_name) || "User"}</div>
                <div className="text-xs text-crypto-muted flex items-center">
                  {user.email.includes("telegram") && <>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Connected with Telegram
                    </>}
                  {user.email.includes("wallet") && <>
                      <Wallet className="h-3 w-3 mr-1" />
                      Connected with Wallet
                    </>}
                  {!user.email.includes("telegram") && !user.email.includes("wallet")  && <>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Connected with Discord
                    </>}
                  {/* {getLoginProvider() === "Discord" ? (
                    <>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Connected with Discord
                    </>
                  ) : (
                    <>
                      <Mail className="h-3 w-3 mr-1" />
                      Connected with Email
                    </>
                  )} */}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="balance">Current Balance:</Label>
              {/* <div className="flex items-center gap-2">
                <Input
                  id="balance"
                  value={newBalance}
                  onChange={handleBalanceChange}
                  placeholder="Enter balance amount"
                  type="text"
                  inputMode="decimal"
                  className="text-black"
                />
                <span className="text-sm text-crypto-muted">USD</span>
              </div> */}
              <p className="pb-4">${balance.toLocaleString()}</p>
              <p className="text-xs text-crypto-muted">
                This will reset your paper trading balance to $10,000.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button onClick={handleSave} className="bg-crypto-accent hover:bg-crypto-highlight text-white">
              Reset Balance
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountSettings;
