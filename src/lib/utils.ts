import { useAuth } from "@/contexts/AuthContext"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDisplayName=()=>{
  const { user } = useAuth();
  const email = user?.email;
  const displayName = user.user_metadata.full_name;
  if (email.startsWith('wallet-') && email.endsWith('@walletuser.com')) {
    const address = email.replace('wallet-', '').replace('@walletuser.com', '');
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  if (email.startsWith('telegram-') && email.endsWith('@telegramuser.com')) {
    let result = displayName.replace("undefined", "").trim();
    return result;
    // return input.replace('telegram-', 'TG-').replace('@telegramuser.com', '');
  }
  if(user.app_metadata.provider=="discord"){
    let result = displayName.replace("undefined", "").trim();
    return result;
  }
  return email;
}