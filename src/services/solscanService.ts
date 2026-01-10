import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// FREE API ENDPOINTS - NO SOLSCAN!
const JUPITER_API_URL = "https://price.jup.ag/v6";
const JUPITER_TOKENS_URL = "https://tokens.jup.ag/tokens?tags=verified";
const HELIUS_RPC_URL = "https://api.mainnet-beta.solana.com";
const DEXSCREENER_API_URL = "https://api.dexscreener.com";
const BIRDEYE_API_URL = "https://public-api.birdeye.so";

// Keep Moralis keys as they're already in use
const MORALIS_API_KEYS = [
  "L2RCjJqapuhCylzNb7esHJH18oXoNU0CLyNWKM9SwGeTOu3FAGDYe10GvctbWrSA",
  "GAPH7ZYe0ot9iqt0KmC5cq14K6VBPN96itxFuAvJHwSl5pcCilJCnbQ0gGwkVIy3",
  "92rRFPZnwy6iwGijbswgUMC8jcwzwalYEG9aB11EmuAK5MvnxyJ4QAFzFR30iAwb",
  "L4ZAvZj8RoWhRfTtCeW7nrJuIcQePWuzjAwrVcGl5Q6DJD4v1QxSH8N6aNch28aA",
  "c3sQueqHLlLn8b1AeJJHX9vMtiGYB2G6u1qSTWaRH6UN2m5SFoxzpduEJpKprjvi",
  "JmlhymUvtue4tIu5K8rC97STzgMwGjf9TwZQqS9GnqcHwbh5k9MIvxbbSB7B60HU",
  "nVIRy9wcNMTTPVMFtnMB0YEKC5VSKhB6fe1DERq3ujOtGq5byPaCtA1HM95LRLtq",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVmYzkwNmU4LTA1NWUtNGE4OC04OWM4LWQ4NDgyOTA0YWVjNCIsIm9yZ0lkIjoiNDExMTIyIiwidXNlcklkIjoiNDIyNDg3IiwidHlwZUlkIjoiZTM1NGU1MWYtNzE1NS00YjU3LWI4YjMtN2EzOTlmM2E0NjQ0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mjg0OTQ4MjUsImV4cCI6NDg4NDI1NDgyNX0.xc_F5PAg6FEt-mqFxMfGw26hdiO5D5AnydK9qAq8yiw",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijg5YjZhODAyLTc0M2QtNDYxNy04NGYzLWQyMThjNDk2YTUyOSIsIm9yZ0lkIjoiNDQ4MzEwIiwidXNlcklkIjoiNDYxMjU0IiwidHlwZUlkIjoiMWY2NzcyNGQtMDlmMy00MzEzLTg0NmUtYzRmOTYxYWZiM2UyIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDc4MjMxODEsImV4cCI6NDkwMzU4MzE4MX0.B-mcmTbxheNa_LMArPzNDWu_bw8_jZAPkjRoouvQaNg",
];

export interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  description?: string;
  logoUrl?: string;
  totalSupply?: number;
  launchDate: number;
  holder: number;
  fullyDilutedValuation?: number;
  circulatingSupply?: number;
  website?: string;
  twitter?: string;
  telegram?: string;
}

// Cache for Jupiter token list
let jupiterTokensCache: any[] | null = null;
let jupiterTokensCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch all Jupiter tokens (cached)
const fetchJupiterTokens = async () => {
  const now = Date.now();
  if (jupiterTokensCache && now - jupiterTokensCacheTime < CACHE_DURATION) {
    return jupiterTokensCache;
  }

  try {
    const response = await fetch(JUPITER_TOKENS_URL);
    if (response.ok) {
      jupiterTokensCache = await response.json();
      jupiterTokensCacheTime = now;
      return jupiterTokensCache;
    }
  } catch (error) {
    console.error("Error fetching Jupiter tokens:", error);
  }
  return [];
};

// Get token metadata from Jupiter token list
const getJupiterTokenMetadata = async (address: string) => {
  const tokens = await fetchJupiterTokens();
  return tokens.find((t: any) => t.address.toLowerCase() === address.toLowerCase());
};

// Get on-chain token data using Solana RPC
const getTokenSupplyData = async (address: string) => {
  try {
    const response = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenSupply",
        params: [address],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result?.value) {
        return {
          supply: parseFloat(data.result.value.amount),
          decimals: data.result.value.decimals,
        };
      }
    }
  } catch (error) {
    console.warn("RPC supply fetch failed:", error);
  }
  return null;
};

// Fetch token details using FREE APIs ONLY
export const fetchTokenDetails = async (address: string): Promise<TokenInfo> => {
  let price: number | undefined;
  let marketCap: number | undefined;
  let priceChange: number | undefined;
  let volume24h: number | undefined;
  let metadata: any = {};
  let supply: number | undefined;
  let decimals: number | undefined;

  // 1. Get metadata from Jupiter token list
  try {
    metadata = await getJupiterTokenMetadata(address);
  } catch (e) {
    console.warn("Jupiter metadata fetch failed:", e);
  }

  // 2. Try DexScreener first (most reliable free source)
  try {
    const dexResponse = await fetch(`${DEXSCREENER_API_URL}/latest/dex/tokens/${address}`);
    if (dexResponse.ok) {
      const dexData = await dexResponse.json();
      if (dexData.pairs && dexData.pairs.length > 0) {
        const pair = dexData.pairs[0];
        price = parseFloat(pair.priceUsd) || undefined;
        marketCap = parseFloat(pair.fdv || pair.marketCap) || undefined;
        priceChange = parseFloat(pair.priceChange?.h24) || undefined;
        volume24h = parseFloat(pair.volume?.h24) || undefined;
        
        // Get token info from pair if metadata is missing
        if (!metadata?.name) {
          metadata = {
            name: pair.baseToken?.name,
            symbol: pair.baseToken?.symbol,
            logoURI: pair.info?.imageUrl,
          };
        }
      }
    }
  } catch (e) {
    console.warn("DexScreener fetch failed:", e);
  }

  // 3. Get price from Jupiter if DexScreener failed
  if (!price) {
    try {
      const priceResponse = await fetch(`${JUPITER_API_URL}/price?ids=${address}`);
      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        if (priceData.data && priceData.data[address]) {
          price = priceData.data[address].price;
        }
      }
    } catch (e) {
      console.warn("Jupiter price fetch failed:", e);
    }
  }

  // 4. Fallback to Moralis if still no price
  if (!price) {
    for (const key of MORALIS_API_KEYS) {
      try {
        const response = await fetch(
          `https://solana-gateway.moralis.io/token/mainnet/${address}/price`,
          {
            headers: {
              accept: "application/json",
              "X-API-Key": key,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          price = data.usdPrice || price;
          priceChange = data.usdPrice24hrPercentChange;
          break;
        }
      } catch (e) {
        continue;
      }
    }
  }

  // 5. Get on-chain supply data
  const supplyData = await getTokenSupplyData(address);
  if (supplyData) {
    supply = supplyData.supply;
    decimals = supplyData.decimals;
  }

  // Calculate market cap if we have price and supply
  if (!marketCap && price && supply && decimals != null) {
    marketCap = price * (supply / Math.pow(10, decimals));
  }

  return {
    id: address,
    name: metadata?.name || "Unknown Token",
    symbol: metadata?.symbol || "UNKNOWN",
    price: price || 0,
    change24h: priceChange || 0,
    volume24h: volume24h || 0,
    marketCap: marketCap,
    description: metadata?.description || `${metadata?.name || "Unknown"} (${metadata?.symbol || "UNKNOWN"}) is a Solana token.`,
    twitter: metadata?.extensions?.twitter,
    website: metadata?.extensions?.website,
    telegram: metadata?.extensions?.telegram,
    logoUrl: metadata?.logoURI || metadata?.image,
    totalSupply: supply && decimals != null ? supply / Math.pow(10, decimals) : undefined,
    launchDate: Date.now(),
    holder: 0,
  };
};

// Search tokens using Jupiter token list
export const searchSolanaTokens = async (query: string): Promise<TokenInfo[]> => {
  try {
    const isAddress = query.length > 30;

    if (isAddress) {
      const details = await fetchTokenDetails(query);
      return [details];
    }

    const tokens = await fetchJupiterTokens();
    const searchLower = query.toLowerCase();
    
    const filtered = tokens
      .filter((t: any) => 
        t.name?.toLowerCase().includes(searchLower) ||
        t.symbol?.toLowerCase().includes(searchLower)
      )
      .slice(0, 10);

    const results = await Promise.all(
      filtered.map(async (token: any) => {
        try {
          const details = await fetchTokenDetails(token.address);
          return details;
        } catch {
          return {
            id: token.address,
            name: token.name || "Unknown",
            symbol: token.symbol || "UNKNOWN",
            price: 0,
            change24h: 0,
            volume24h: 0,
            logoUrl: token.logoURI,
            launchDate: 0,
            holder: 0,
          };
        }
      })
    );

    return results;
  } catch (error) {
    console.error("Error searching tokens:", error);
    return [];
  }
};

// Fetch trending tokens using DexScreener boosted tokens
export const fetchTrendingTokens = async (limit: number = 72): Promise<TokenInfo[]> => {
  try {
    // Use DexScreener's boosted/trending tokens
    const response = await fetch(`${DEXSCREENER_API_URL}/token-boosts/top/v1`);

    if (!response.ok) {
      throw new Error("Failed to fetch trending tokens");
    }

    const data = await response.json();
    const solanaPairs = data
      .filter((item: any) => item.chainId === "solana")
      .slice(0, limit);

    const results = await Promise.all(
      solanaPairs.map(async (item: any) => {
        try {
          const details = await fetchTokenDetails(item.tokenAddress);
          return details;
        } catch {
          return {
            id: item.tokenAddress,
            name: item.description || "Unknown",
            symbol: "UNKNOWN",
            price: 0,
            change24h: 0,
            volume24h: 0,
            logoUrl: item.icon,
            launchDate: 0,
            holder: 0,
          };
        }
      })
    );

    // Filter out stablecoins and very large cap tokens
    return results.filter((token) => 
      token.name !== "USDT" &&
      token.name !== "USDC" &&
      token.name !== "Wrapped SOL" &&
      (!token.marketCap || token.marketCap <= 15000000000)
    );
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    
    // Fallback: try DexScreener's latest tokens
    try {
      const fallbackResponse = await fetch(
        `${DEXSCREENER_API_URL}/latest/dex/tokens/solana`
      );
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const pairs = fallbackData.pairs?.slice(0, limit) || [];
        
        return await Promise.all(
          pairs.map(async (pair: any) => {
            try {
              return await fetchTokenDetails(pair.baseToken.address);
            } catch {
              return {
                id: pair.baseToken.address,
                name: pair.baseToken.name || "Unknown",
                symbol: pair.baseToken.symbol || "UNKNOWN",
                price: parseFloat(pair.priceUsd) || 0,
                change24h: parseFloat(pair.priceChange?.h24) || 0,
                volume24h: parseFloat(pair.volume?.h24) || 0,
                marketCap: parseFloat(pair.fdv || pair.marketCap) || 0,
                logoUrl: pair.info?.imageUrl,
                launchDate: 0,
                holder: 0,
              };
            }
          })
        );
      }
    } catch (fallbackError) {
      console.error("Fallback trending tokens failed:", fallbackError);
    }
    
    throw error;
  }
};

// Fetch token prices in batch
export const fetchTokenPricesBatch = async (
  addresses: string[]
): Promise<Record<string, number>> => {
  if (!addresses || addresses.length === 0) return {};

  const pricesMap: Record<string, number> = {};

  // 1. Try Jupiter API (supports batch)
  try {
    const ids = addresses.join(",");
    const response = await fetch(`${JUPITER_API_URL}/price?ids=${ids}`);

    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        for (const [address, priceInfo] of Object.entries<any>(data.data)) {
          if (priceInfo && typeof priceInfo.price === "number") {
            pricesMap[address] = priceInfo.price;
          }
        }
      }
    }
  } catch (error) {
    console.error("Jupiter batch fetch failed:", error);
  }

  // 2. Fill gaps with Moralis
  const missingAddresses = addresses.filter((addr) => !pricesMap[addr]);
  
  if (missingAddresses.length > 0) {
    for (const apiKey of MORALIS_API_KEYS) {
      try {
        const moralisResponse = await fetch(
          `https://solana-gateway.moralis.io/token/mainnet/prices`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "X-API-Key": apiKey,
            },
            body: JSON.stringify({ addresses: missingAddresses }),
          }
        );

        if (moralisResponse.ok) {
          const moralisData = await moralisResponse.json();
          if (moralisData && typeof moralisData === "object") {
            for (const [address, token] of Object.entries<any>(moralisData)) {
              if (token && typeof token.usdPrice === "number") {
                pricesMap[token.tokenAddress] = token.usdPrice;
              }
            }
          }
          break;
        }
      } catch (error) {
        continue;
      }
    }
  }

  return pricesMap;
};

// Fetch new pairs from DexScreener
export const fetchNewPairs = async (): Promise<TokenInfo[]> => {
  try {
    const response = await fetch(
      `${DEXSCREENER_API_URL}/token-profiles/latest/v1?chain=solana`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch new pairs");
    }

    const data = await response.json();
    const solanaPairs = data
      .filter((pair: any) => pair.chainId === "solana")
      .slice(0, 72);

    const results = await Promise.all(
      solanaPairs.map(async (pair: any) => {
        try {
          const details = await fetchTokenDetails(pair.tokenAddress);
          return {
            ...details,
            description: pair.description || details.description,
            logoUrl: pair.icon || details.logoUrl,
          };
        } catch {
          return {
            id: pair.tokenAddress,
            name: "Unknown",
            symbol: "UNKNOWN",
            price: 0,
            change24h: 0,
            volume24h: 0,
            logoUrl: pair.icon,
            description: pair.description,
            launchDate: 0,
            holder: 0,
          };
        }
      })
    );

    return results;
  } catch (error) {
    console.error("Error fetching new pairs:", error);
    throw error;
  }
};

// Fetch PumpVision tokens
export const fetchPumpVisionTokens = async (): Promise<{
  aboutToMigrate: TokenInfo[];
  migrated: TokenInfo[];
}> => {
  try {
    const executeMoralisQuery = async (url: string) => {
      for (const apiKey of MORALIS_API_KEYS) {
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              accept: "application/json",
              "X-API-Key": apiKey,
            },
          });

          if (response.ok) {
            return await response.json();
          }
        } catch (error) {
          continue;
        }
      }
      throw new Error("All Moralis keys failed");
    };

    const enrichTokens = async (tokens: any[]) => {
      return await Promise.all(
        tokens.map(async (item) => {
          try {
            const details = await fetchTokenDetails(item.tokenAddress);
            return {
              ...details,
              logoUrl: item.logo || details.logoUrl,
            };
          } catch {
            return {
              id: item.tokenAddress,
              name: item.name || "Unknown",
              symbol: item.symbol || "UNKNOWN",
              price: parseFloat(item.priceUsd || 0),
              change24h: 0,
              volume24h: 0,
              logoUrl: item.logo,
              launchDate: 0,
              holder: 0,
            };
          }
        })
      );
    };

    const [aboutToMigrateData, migratedData] = await Promise.all([
      executeMoralisQuery(
        "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/bonding?limit=36"
      ),
      executeMoralisQuery(
        "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/graduated?limit=36"
      ),
    ]);

    const aboutToMigrate = await enrichTokens(aboutToMigrateData?.result || []);
    const migrated = await enrichTokens(migratedData?.result || []);

    return {
      aboutToMigrate: aboutToMigrate.filter(t => !t.marketCap || t.marketCap <= 15000000000),
      migrated: migrated.filter(t => !t.marketCap || t.marketCap <= 15000000000),
    };
  } catch (error) {
    console.error("Error fetching pump vision tokens:", error);
    return {
      aboutToMigrate: [],
      migrated: [],
    };
  }
};

// Custom hooks
export const useTrendingSolanaTokens = () => {
  return useQuery({
    queryKey: ["trending-solana-tokens"],
    queryFn: fetchTrendingTokens,
    refetchInterval: 60000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    meta: {
      onError: () => {
        toast.error("Failed to load trending tokens");
      },
    },
  });
};

export const useTokenDetail = (address: string) => {
  return useQuery({
    queryKey: ["solana-token-detail", address],
    queryFn: () => fetchTokenDetails(address),
    enabled: !!address && address.length > 10,
    refetchInterval: 5000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    meta: {
      onError: () => {
        toast.error("Failed to load token details");
      },
    },
  });
};

export const useTokenPricesBatch = (addresses: string[]) => {
  return useQuery({
    queryKey: ["token-prices-batch", addresses],
    queryFn: () => fetchTokenPricesBatch(addresses),
    enabled: !!addresses && addresses.length > 0,
    refetchInterval: 5000,
    retry: 3,
    meta: {
      onError: () => {
        toast.error("Failed to fetch token prices");
      },
    },
  });
};

export const useNewPairs = () => {
  return useQuery({
    queryKey: ["new-pairs"],
    queryFn: () => fetchNewPairs(),
    refetchInterval: 120000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    meta: {
      onError: () => {
        toast.error("Failed to load new pairs");
      },
    },
  });
};

export const usePumpVisionTokens = () => {
  return useQuery({
    queryKey: ["pump-vision-tokens"],
    queryFn: fetchPumpVisionTokens,
    refetchInterval: 300000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    meta: {
      onError: () => {
        toast.error("Failed to load pump vision data");
      },
    },
  });
};

export const useSearchSolanaTokens = (query: string) => {
  return useQuery({
    queryKey: ["search-solana-tokens", query],
    queryFn: () => searchSolanaTokens(query),
    enabled: query.length > 1,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    meta: {
      onError: () => {
        toast.error("Search failed");
      },
    },
  });
};