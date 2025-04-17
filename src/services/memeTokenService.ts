
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Token } from "./tokenService";

// API endpoint for meme tokens
const MEME_API_BASE_URL = "https://api.coingecko.com/api/v3";

// Fetch meme tokens
export const fetchMemeTokens = async (): Promise<Token[]> => {
  try {
    // The category parameter filters for meme tokens
    const response = await fetch(
      `${MEME_API_BASE_URL}/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch meme tokens');
    }

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      price: item.current_price,
      change24h: item.price_change_percentage_24h || 0,
      volume24h: item.total_volume,
      marketCap: item.market_cap,
      logoUrl: item.image,
      // Additional meme token specific data
      fullyDilutedValuation: item.fully_diluted_valuation || 0,
      maxSupply: item.max_supply,
      circulatingSupply: item.circulating_supply,
      totalSupply: item.total_supply,
      ath: item.ath,
      athChangePercentage: item.ath_change_percentage,
      athDate: item.ath_date,
    }));
  } catch (error) {
    console.error('Error fetching meme tokens:', error);
    throw error;
  }
};

// New pairs - recently launched meme tokens (simulated by sorting by recent launch)
export const fetchNewMemeTokens = async (): Promise<Token[]> => {
  try {
    // Getting newest tokens by sorting differently and filtering for low market cap
    const response = await fetch(
      `${MEME_API_BASE_URL}/coins/markets?vs_currency=usd&category=meme-token&order=id_asc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch new meme tokens');
    }

    const data = await response.json();
    const sortedByNewest = data.sort((a: any, b: any) => new Date(b.genesis_date || 0).getTime() - new Date(a.genesis_date || 0).getTime());
    
    return sortedByNewest.slice(0, 10).map((item: any) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      price: item.current_price,
      change24h: item.price_change_percentage_24h || 0,
      volume24h: item.total_volume,
      marketCap: item.market_cap,
      logoUrl: item.image,
      launchDate: item.genesis_date || 'Unknown',
      fullyDilutedValuation: item.fully_diluted_valuation || 0,
    }));
  } catch (error) {
    console.error('Error fetching new meme tokens:', error);
    throw error;
  }
};

// Custom hooks
export const useMemeTokens = () => {
  return useQuery({
    queryKey: ['meme-tokens'],
    queryFn: fetchMemeTokens,
    refetchInterval: 60000, // Refetch every minute
    meta: {
      onError: () => {
        toast.error("Failed to load meme tokens");
      }
    }
  });
};

export const useNewMemeTokens = () => {
  return useQuery({
    queryKey: ['new-meme-tokens'],
    queryFn: fetchNewMemeTokens,
    refetchInterval: 60000, // Refetch every minute
    meta: {
      onError: () => {
        toast.error("Failed to load new meme tokens");
      }
    }
  });
};
