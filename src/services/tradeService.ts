import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";

// Trade status enum
export enum TradeStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  FAILED = "failed"
}

// Trade type
export interface Trade {
  id: string;
  type: 'buy' | 'sell';
  token: string;
  symbol: string;
  name?: string;
  amount: number;
  price: number;
  total: number;
  date: string;
  status: TradeStatus;
}

// Holding type
export interface Holding {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  price: number; // Average purchase price
  currentPrice: number; // Current market price
  allocation?: number; // Percentage of portfolio
}

// Store interface
interface TradeState {
  balance: number;
  holdings: Holding[];
  trades: Trade[];
  executeTrade: (trade: Omit<Trade, 'id' | 'date' | 'status'>) => Promise<Trade>;
  calculatePortfolioValue: () => number;
  calculatePnL: () => { value: number, percentage: number };
  updateHoldingPrice: (id: string, currentPrice: number) => Promise<void>;
  loadUserData: () => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  isLoading: boolean;
}

// Check if a string is a valid UUID
const isValidUuid = (id: string): boolean => {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
};

// Check if a string is a valid Solana address (simplified)
const isValidSolanaAddress = (address: string): boolean => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

export const useTradeStore = create<TradeState>()(
  persist(
    (set, get) => ({
      balance: 10000, // Starting with $10,000
      holdings: [],
      trades: [],
      isLoading: false,
      
      loadUserData: async () => {
        const userData = await supabase.auth.getUser();
        if (!userData?.data?.user) {
          set({ isLoading: false });
          return;
        }
        
        set({ isLoading: true });
        
        try {
          // Fetch wallet balance
          const { data: walletData, error: walletError } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', userData.data.user.id)
            .single();
          
          if (walletError) throw walletError;
          
          // Fetch holdings
          const { data: holdingsData, error: holdingsError } = await supabase
            .from('holdings')
            .select(`
              id,
              amount,
              average_buy_price,
              tokens:token_id (
                id, 
                name, 
                symbol,
                price
              )
            `)
            .eq('user_id', userData.data.user.id);
          
          if (holdingsError) throw holdingsError;
          
          // Fetch trades
          const { data: tradesData, error: tradesError } = await supabase
            .from('trades')
            .select(`
              id,
              type,
              amount,
              price,
              total,
              status,
              created_at,
              tokens:token_id (
                id,
                name,
                symbol
              )
            `)
            .eq('user_id', userData.data.user.id)
            .order('created_at', { ascending: false });
          
          if (tradesError) throw tradesError;
          
          // Transform holdings data
          const formattedHoldings = holdingsData?.map((holding: any) => ({
            id: holding.tokens.id,
            name: holding.tokens.name,
            symbol: holding.tokens.symbol,
            amount: holding.amount,
            price: holding.average_buy_price,
            currentPrice: holding.tokens.price
          })) || [];
          
          // Transform trades data
          const formattedTrades = tradesData?.map((trade: any) => ({
            id: trade.id,
            type: trade.type,
            token: trade.tokens.id,
            name: trade.tokens.name,
            symbol: trade.tokens.symbol,
            amount: trade.amount,
            price: trade.price,
            total: trade.total,
            date: trade.created_at,
            status: trade.status as TradeStatus
          })) || [];
          
          // console.log("Formatted holdings:", formattedHoldings);
          // console.log("Formatted trades:", formattedTrades);
          
          // Update state
          set({
            balance: walletData?.balance || 10000,
            holdings: formattedHoldings,
            trades: formattedTrades,
            isLoading: false
          });
        } catch (error) {
          console.error('Error loading user data:', error);
          toast.error('Failed to load user data');
          set({ isLoading: false });
        }
      },
      
      updateBalance: async (amount: number) => {
        const userData = await supabase.auth.getUser();
        if (!userData?.data?.user) {
          toast.error('You must be logged in to update your balance');
          return;
        }
        
        try {
          const { error } = await supabase
            .from('wallets')
            .update({ balance: amount })
            .eq('user_id', userData.data.user.id);
            
          if (error) throw error;
          
          set({ balance: amount });
          toast.success('Balance updated successfully');
        } catch (error: any) {
          console.error('Error updating balance:', error);
          toast.error(`Failed to update balance: ${error.message}`);
        }
      },
      
      executeTrade: async (trade) => {
        const userData = await supabase.auth.getUser();
        if (!userData?.data?.user) {
          toast.error('You must be logged in to trade');
          throw new Error('User not authenticated');
        }
        
        // Start transaction
        try {
          // console.log("Executing trade with token:", trade.token);
          
          // First, check if the token exists in the database by address
          let { data: tokenData, error: tokenError } = await supabase
            .from('tokens')
            .select('*')
            .eq('id', trade.token)
            .maybeSingle();
            
          // console.log("Token data from DB:", tokenData, "Error:", tokenError);
          
          // Use the token address as the ID
          const tokenId = trade.token;
          
          // If token doesn't exist, create a new one
          if (tokenError || !tokenData) {
            // Token doesn't exist, create a new one
            // console.log("Creating new token:", trade.token, trade.symbol);
            
            const { data: newToken, error: newTokenError } = await supabase
              .from('tokens')
              .insert({
                id: tokenId,
                name: trade.name || trade.symbol,
                symbol: trade.symbol,
                price: trade.price,
              })
              .select()
              .single();
              
            if (newTokenError) {
              // If symbol constraint issue, find the token by symbol
              if (newTokenError.message.includes('tokens_symbol_key')) {
                // Get the existing token by symbol
                const { data: existingToken, error: existingTokenError } = await supabase
                  .from('tokens')
                  .select('*')
                  .eq('symbol', trade.symbol)
                  .single();
                  
                if (existingTokenError) throw existingTokenError;
                tokenData = existingToken;
              } else {
                throw newTokenError;
              }
            } else {
              tokenData = newToken;
            }
          }
          
          // Get current wallet balance
          const { data: walletData, error: walletError } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', userData.data.user.id)
            .single();
            
          if (walletError) throw walletError;
          
          const currentBalance = walletData?.balance ?? 0;
          
          // Validate the trade
          if (trade.type === 'buy' && trade.total > currentBalance) {
            toast.error("Insufficient balance for this trade");
            throw new Error("Insufficient balance");
          }
          
          if (trade.type === 'sell') {
            // Get current holding
            const { data: holdingData, error: holdingError } = await supabase
              .from('holdings')
              .select('amount')
              .eq('user_id', userData.data.user.id)
              .eq('token_id', trade.token)
              .maybeSingle();
              
            if (holdingError) throw holdingError;
            
            if (!holdingData || holdingData.amount < trade.amount) {
              toast.error("Insufficient tokens to sell");
              throw new Error("Insufficient tokens");
            }
          }
          
          // console.log("About to insert trade record for token:", tokenData);
          
          // Generate a new trade
          const newTrade = {
            user_id: userData.data.user.id,
            token_id: trade.token,
            type: trade.type,
            amount: trade.amount,
            price: trade.price,
            total: trade.total,
            status: TradeStatus.COMPLETED
          };
          
          // Insert trade record
          const { data: tradeResult, error: tradeError } = await supabase
            .from('trades')
            .insert(newTrade)
            .select()
            .single();
            
          if (tradeError) {
            console.error("Trade insert error:", tradeError);
            throw tradeError;
          }
          
          // console.log("Trade inserted successfully:", tradeResult);
          
          // Update balance
          const newBalance = trade.type === 'buy'
            ? currentBalance - trade.total
            : currentBalance + trade.total;
            
          const { error: updateBalanceError } = await supabase
            .from('wallets')
            .update({ balance: newBalance })
            .eq('user_id', userData.data.user.id);
            
          if (updateBalanceError) throw updateBalanceError;
          
          // Update holdings
          if (trade.type === 'buy') {
            // Check if holding exists
            const { data: existingHolding, error: holdingCheckError } = await supabase
              .from('holdings')
              .select('*')
              .eq('user_id', userData.data.user.id)
              .eq('token_id', trade.token)
              .maybeSingle();
              
            if (holdingCheckError) throw holdingCheckError;
            
            if (existingHolding) {
              // Update existing holding
              const newAmount = existingHolding.amount + trade.amount;
              const newAvgPrice = ((existingHolding.amount * existingHolding.average_buy_price) + (trade.amount * trade.price)) / newAmount;
              
              const { error: updateHoldingError } = await supabase
                .from('holdings')
                .update({
                  amount: newAmount,
                  average_buy_price: newAvgPrice
                })
                .eq('id', existingHolding.id);
                
              if (updateHoldingError) throw updateHoldingError;
            } else {
              // Create new holding
              const { error: newHoldingError } = await supabase
                .from('holdings')
                .insert({
                  user_id: userData.data.user.id,
                  token_id: trade.token,
                  amount: trade.amount,
                  average_buy_price: trade.price
                });
                
              if (newHoldingError) throw newHoldingError;
            }
          } else { // sell
            // Get current holding
            const { data: existingHolding, error: holdingError } = await supabase
              .from('holdings')
              .select('*')
              .eq('user_id', userData.data.user.id)
              .eq('token_id', trade.token)
              .single();
              
            if (holdingError) throw holdingError;
            
            const newAmount = existingHolding?.amount - trade.amount;
            
            if (newAmount <= 0) {
              // Remove holding if sold all
              const { error: deleteHoldingError } = await supabase
                .from('holdings')
                .delete()
                .eq('id', existingHolding?.id);
                
              if (deleteHoldingError) throw deleteHoldingError;
            } else {
              // Update holding
              const { error: updateHoldingError } = await supabase
                .from('holdings')
                .update({ amount: newAmount })
                .eq('id', existingHolding?.id);
                
              if (updateHoldingError) throw updateHoldingError;
            }
          }
          
          // Load updated data from database
          await get().loadUserData();
          
          toast.success(
            `${trade.type === 'buy' ? 'Bought' : 'Sold'} ${trade.amount} ${trade.symbol}`
          );
          
          // Return the formatted trade
          return {
            id: tradeResult?.id || '',
            type: trade.type,
            token: trade.token,
            name: tokenData?.name || trade.name || trade.symbol,
            symbol: trade.symbol,
            amount: trade.amount,
            price: trade.price,
            total: trade.total,
            date: tradeResult?.created_at || new Date().toISOString(),
            status: TradeStatus.COMPLETED
          };
        } catch (error: any) {
          console.error('Error executing trade:', error);
          toast.error(`Trade failed: ${error.message}`);
          throw error;
        }
      },
      
      calculatePortfolioValue: () => {
        const { balance, holdings } = get();
        const holdingsValue = holdings.reduce(
          (sum, holding) => sum + holding.amount * holding.currentPrice, 0
        );
        return balance + holdingsValue;
      },
      
      calculatePnL: () => {
        const { holdings } = get();
        let invested = 0;
        let currentValue = 0;
        
        holdings.forEach(holding => {
          invested += holding.amount * holding.price;
          currentValue += holding.amount * holding.currentPrice;
        });
        
        const pnlValue = currentValue - invested;
        const pnlPercentage = invested > 0 ? (pnlValue / invested) * 100 : 0;
        
        return {
          value: pnlValue,
          percentage: pnlPercentage
        };
      },
      
      updateHoldingPrice: async (tokenId: string, tokenPrice: number) => {
        try {
          const { data: holdings, error: fetchError } = await supabase
            .from('holdings')
            .select('id')
            .eq('token_id', tokenId);
            
          if (fetchError) {
            throw fetchError;
          }
          
          if (!holdings || holdings.length === 0) {
            // No holdings found for this token, nothing to update
            return Promise.resolve();
          }
          
          // Update the token price in the tokens table
          const { error: updateTokenError } = await supabase
            .from('tokens')
            .update({ price: tokenPrice })
            .eq('id', tokenId);
            
          if (updateTokenError) {
            throw updateTokenError;
          }
          
          // Also update the currentPrice in the local state
          set(state => ({
            holdings: state.holdings.map(holding => 
              holding.id === tokenId 
                ? { ...holding, currentPrice: tokenPrice }
                : holding
            )
          }));
          
          return Promise.resolve();
        } catch (error: any) {
          console.error("Error updating holding price:", error);
          // Don't show toast for this error as it's not critical to the user experience
          return Promise.resolve();
        }
      }
    }),
    {
      name: 'paper-trader-storage'
    }
  )
);

// Initialize user data when authenticated
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN') {
    useTradeStore.getState().loadUserData();
  }
});
