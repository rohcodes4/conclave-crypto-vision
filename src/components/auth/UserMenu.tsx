
import React from "react";
import AccountMenu from "./AccountMenu";
import AccountSettings from "./AccountSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const UserMenu = () => {
  const { user } = useAuth();
  
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

  return (
    <div className="flex items-center gap-4 max-md:gap-2 ml-8 max-md:ml-2">
      <AccountSettings />
      <AccountMenu />
    </div>
  );
};

export default UserMenu;
