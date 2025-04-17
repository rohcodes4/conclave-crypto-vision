
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  totalSupply?: number;
  description?: string;
  logoUrl?: string;
}

// Base API URL for Solana token data
const API_BASE_URL = "https://api.coingecko.com/api/v3";

// Helper function to handle fetch with retries
const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        // If we get rate limited, wait longer before retry
        if (response.status === 429) {
          await new Promise(resolve => setTimeout(resolve, delay * 2));
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      
      // Wait before retrying
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff
        delay *= 2;
      }
    }
  }
  
  throw lastError;
};

// Fetch trending tokens
export const fetchTrendingTokens = async (): Promise<Token[]> => {
  try {
    const data = await fetchWithRetry(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      price: item.current_price,
      change24h: item.price_change_percentage_24h || 0,
      volume24h: item.total_volume,
      marketCap: item.market_cap,
      logoUrl: item.image,
    }));
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    throw error;
  }
};

// Fetch token detail by ID
export const fetchTokenDetail = async (id: string): Promise<Token> => {
  try {
    const data = await fetchWithRetry(
      `${API_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      price: data.market_data?.current_price?.usd || 0,
      change24h: data.market_data?.price_change_percentage_24h || 0,
      volume24h: data.market_data?.total_volume?.usd || 0,
      marketCap: data.market_data?.market_cap?.usd,
      totalSupply: data.market_data?.total_supply,
      description: data.description?.en?.replace(/<\/?[^>]+(>|$)/g, "") || "", // Remove HTML tags
      logoUrl: data.image?.large,
    };
  } catch (error) {
    console.error('Error fetching token details:', error);
    throw error;
  }
};

// Search tokens
export const searchTokens = async (query: string): Promise<Token[]> => {
  try {
    if (!query || query.trim() === '') return [];
    
    const data = await fetchWithRetry(
      `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
    );
    
    return data.coins.slice(0, 5).map((item: any) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      logoUrl: item.large,
      // These values will be populated with real data when viewing details
      price: 0,
      change24h: 0,
      volume24h: 0,
    }));
  } catch (error) {
    console.error('Error searching tokens:', error);
    throw error;
  }
};

// Custom hooks
export const useTrendingTokens = () => {
  return useQuery({
    queryKey: ['trending-tokens'],
    queryFn: fetchTrendingTokens,
    refetchInterval: 60000, // Refetch every minute
    retry: 3, // Retry 3 times on failure
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    meta: {
      onError: () => {
        toast.error("Failed to load trending tokens");
      }
    }
  });
};

export const useTokenDetail = (id: string) => {
  return useQuery({
    queryKey: ['token-detail', id],
    queryFn: () => fetchTokenDetail(id),
    enabled: !!id,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3, // Retry 3 times on failure
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    meta: {
      onError: () => {
        toast.error("Failed to load token details");
      }
    }
  });
};

export const useSearchTokens = (query: string) => {
  return useQuery({
    queryKey: ['search-tokens', query],
    queryFn: () => searchTokens(query),
    enabled: query.length > 1,
    retry: 3, // Retry 3 times on failure
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    meta: {
      onError: () => {
        toast.error("Search failed");
      }
    }
  });
};
