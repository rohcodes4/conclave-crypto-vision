import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// FREE API ENDPOINTS - NO SOLSCAN!
const JUPITER_API_URL = "https://price.jup.ag/v6";
const JUPITER_TOKENS_URL = "https://api.jup.ag/tokens/v2/tag?query=verified";
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=030284bd-e184-40c2-a80e-2b0b3cd57667`;
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
  pairs?: object;
  description?: string;
  logoUrl?: string;
  totalSupply?: number;
  launchDate: number;
  holder: object;
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
  console.log("[fetchTokenDetails] start", { address });

  let price: number | undefined;
  let marketCap: number | undefined;
  let priceChange: number | undefined;
  let volume24h: number | undefined;
  let metadata: any = {};
  let supply: number | undefined;
  let decimals: number | undefined;
  let pairs: any = null;  // ✅ DexScreener full data
  let holders: object = null;  // ✅ Holders count

  // 2. DexScreener (price + metadata + pairs)
  let dexResponseData: any = null;
  try {
    const url = `${DEXSCREENER_API_URL}/latest/dex/tokens/${address}`;
    console.log("[fetchTokenDetails] DexScreener URL:", url);

    const dexResponse = await fetch(url);
    console.log("[fetchTokenDetails] DexScreener status:", dexResponse.status);

    if (!dexResponse.ok) {
      const text = await dexResponse.text().catch(() => "");
      console.warn("[fetchTokenDetails] DexScreener not ok", {
        status: dexResponse.status,
        body: text,
      });
    } else {
      dexResponseData = await dexResponse.json();
      pairs = dexResponseData;  // ✅ Full pairs data
      console.log("[fetchTokenDetails] DexScreener raw data:", dexResponseData);

      if (dexResponseData.pairs && dexResponseData.pairs.length > 0) {
        const pair = dexResponseData.pairs[0];
        console.log("[fetchTokenDetails] DexScreener using pair:", pair);

        price = pair?.priceUsd ? parseFloat(pair.priceUsd) : undefined;
        marketCap = pair?.fdv
          ? parseFloat(pair.fdv)
          : pair?.marketCap
          ? parseFloat(pair.marketCap)
          : undefined;
        priceChange = pair?.priceChange?.h24
          ? parseFloat(pair.priceChange.h24)
          : undefined;
        volume24h = pair?.volume?.h24
          ? parseFloat(pair.volume.h24)
          : undefined;

        console.log("[fetchTokenDetails] Dex parsed", {
          price,
          marketCap,
          priceChange,
          volume24h,
        });

        // Metadata + launchDate from DexScreener
        if (!metadata?.name) {
          metadata = {
            name: pair.baseToken?.name,
            symbol: pair.baseToken?.symbol,
            logoURI: pair.info?.imageUrl,
            launchDate: pair?.pairCreatedAt ? pair.pairCreatedAt / 1000 : Date.now() / 1000,  // ✅ Unix timestamp
          };
          console.log("[fetchTokenDetails] metadata from DexScreener:", metadata);
        }
      } else {
        console.warn("[fetchTokenDetails] No DexScreener pairs:", address);
      }
    }
  } catch (e) {
    console.warn("[fetchTokenDetails] DexScreener fetch failed:", e);
  }

  // 3. Moralis price fallback (unchanged)
  if (!price) {
    console.log("[fetchTokenDetails] No price from DexScreener, trying Moralis");
    for (const key of MORALIS_API_KEYS) {
      console.log("[fetchTokenDetails] Trying Moralis key");
      try {
        const url = `https://solana-gateway.moralis.io/token/mainnet/${address}/price`;
        console.log("[fetchTokenDetails] Moralis URL:", url);

        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            "X-API-Key": key,
          },
        });

        console.log("[fetchTokenDetails] Moralis status:", response.status);

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          console.warn("[fetchTokenDetails] Moralis not ok", {
            status: response.status,
            body: text,
          });
          continue;
        }

        const data = await response.json();
        console.log("[fetchTokenDetails] Moralis raw data:", data);

        if (typeof data.usdPrice === "number") {
          price = data.usdPrice;
          priceChange =
            typeof data.usdPrice24hrPercentChange === "number"
              ? data.usdPrice24hrPercentChange
              : priceChange;
          console.log("[fetchTokenDetails] Moralis parsed", {
            price,
            priceChange,
          });
          break;
        } else {
          console.warn(
            "[fetchTokenDetails] Moralis returned no numeric usdPrice"
          );
        }
      } catch (e) {
        console.warn("[fetchTokenDetails] Moralis fetch error, trying next key:", e);
        continue;
      }
    }
  }

  // 4. On-chain supply (unchanged)
  try {
    const supplyData = await getTokenSupplyData(address);
    if (supplyData) {
      supply = supplyData.supply;
      decimals = supplyData.decimals;
    }
  } catch (e) {
    console.warn("[fetchTokenDetails] supply failed:", e);
  }

  // 5. Market cap calculation (unchanged)
  if (!marketCap && price && supply && decimals != null) {
    marketCap = price * (supply / Math.pow(10, decimals));
  }

  // ✅ 6. Helius holders (getAsset RPC)
  try {
    console.log("[fetchTokenDetails] Fetching holders via Helius");
    const response = await fetch(
      `https://solana-gateway.moralis.io/token/mainnet/holders/${address}`,
      {
      headers: { 'X-API-Key': MORALIS_API_KEYS[0] }
      }
      );
      // const data = await response.json();
      console.log('[fetch] data',response)
    if (response) {
      const holderData = await response.json();
      holders = holderData;
      console.log("[fetchTokenDetails] Helius holders:", holderData);
    } else {
      console.warn("[fetchTokenDetails] Helius holders failed");
    }
  } catch (e) {
    console.warn("[fetchTokenDetails] Helius holders error:", e);
  }

  const result: TokenInfo = {
    id: address,
    name: metadata?.name || "Unknown Token",
    symbol: metadata?.symbol || "UNKNOWN",
    price: price || 0,
    change24h: priceChange || 0,
    volume24h: volume24h || 0,
    marketCap: marketCap,
    description: metadata?.description ||
      `${metadata?.name || "Unknown"} (${metadata?.symbol || "UNKNOWN"}) is a Solana token.`,
    twitter: metadata?.extensions?.twitter,
    website: metadata?.extensions?.website,
    telegram: metadata?.extensions?.telegram,
    logoUrl: metadata?.logoURI || metadata?.image,
    totalSupply: supply && decimals != null ? supply / Math.pow(10, decimals) : undefined,
    launchDate: metadata.launchDate || Date.now() / 1000,  // ✅ From DexScreener pairCreatedAt
    holder: holders,  // ✅ Dynamic from Helius
    pairs: pairs      // ✅ Full DexScreener data
  };

  console.log("[fetchTokenDetails] final result:", result);
  return result;
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
    // Rotate through Moralis API keys for better reliability
    for (const apiKey of MORALIS_API_KEYS) {
      try {
        const options = {
          method: 'GET' as const,
          headers: {
            accept: 'application/json',
            'X-API-Key': apiKey,
          },
        };

        const res = await fetch(
          `https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=solana&limit=${Math.min(limit, 50)}`, // Respect likely limits
          options
        );

        if (!res.ok) {
          console.warn(`Moralis key failed (${apiKey.slice(0, 20)}...): ${res.status}`);
          continue;
        }

        const response = await res.json();
        
        // Handle response structure - direct array as shown in your network response
        if (!Array.isArray(response)) {
          console.warn("Moralis response not array:", response);
          continue;
        }

        console.log(`Moralis trending fetched ${response.length} tokens`);

        const solanaTokens = response
          .filter((item: any) => item.chainId === "solana" && item.tokenAddress)
          .slice(0, limit);

        const results = await Promise.all(
          solanaTokens.map(async (item: any) => {
            try {
              return {
                id: item.tokenAddress,
                name: item.name || item.description || "Unknown",
                symbol: item.symbol || "UNKNOWN",
                price: item.usdPrice || 0,
                change24h: item.pricePercentChange?.['24h'] || 0,
                volume24h: item.totalVolume?.['24h'] || 0,
                marketCap: item.marketCap || undefined,
                logoUrl: item.logo,
                launchDate: item.createdAt || Date.now() / 1000,
                holder: { total: item.holders || 0 },
                pairs: null,
              } as TokenInfo;
            } catch (detailError) {
              console.warn("Token enrichment failed:", item.tokenAddress, detailError);
              return null; // ✅ Return null instead of undefined
            }
          })
        );

        // Filter out stablecoins and very large cap tokens
        const filtered = results.filter((token) => 
          !['USDT', 'USDC', 'Wrapped SOL', 'WSOL', 'SOL'].includes(token.symbol?.toUpperCase()) &&
          (!token.marketCap || token.marketCap <= 15000000000)
        );

        console.log(`Returning ${filtered.length} filtered trending tokens`);
        console.log(`Returning filtered trending tokens: ${filtered}`);
        return filtered;
      } catch (keyError) {
        console.warn("Moralis key error, trying next:", keyError);
        continue;
      }
    }

    // If all Moralis keys fail, throw to trigger fallback
    throw new Error('All Moralis keys failed for trending tokens');
    
  } catch (error) {
    console.error("Primary Moralis trending failed:", error);
    
    // Fallback: DexScreener latest Solana tokens (high volume = trending proxy)
    try {
      console.log("Falling back to DexScreener latest");
      const fallbackResponse = await fetch(
        `${DEXSCREENER_API_URL}/latest/dex/tokens/solana`
      );
      
      if (!fallbackResponse.ok) throw new Error('DexScreener fallback failed');
      
      const fallbackData = await fallbackResponse.json();
      const pairs = fallbackData.pairs?.slice(0, limit) || [];
      
      const results = await Promise.all(
        pairs.map(async (pair: any) => {
          try {
            // return await fetchTokenDetails(pair.baseToken.address);
            return {
              id: pair.baseToken.address,
              name: pair.baseToken.name || "Unknown",
              symbol: pair.baseToken.symbol || "UNKNOWN",
              price: parseFloat(pair.priceUsd || "0") || 0,
              change24h: parseFloat(pair.priceChange?.h24 || "0") || 0,
              volume24h: parseFloat(pair.volume?.h24 || "0") || 0,
              marketCap: parseFloat(pair.fdv || pair.marketCap || "0") || undefined,
              logoUrl: pair.info?.imageUrl || pair.baseToken?.logoURI,
              launchDate: pair.pairCreatedAt ? parseInt(pair.pairCreatedAt) / 1000 : Date.now() / 1000,
              holder: null,
            } as TokenInfo;
          } catch {
            
          }
        })
      );

      // Apply same filtering
      return results.filter((token) => 
        !['USDT', 'USDC', 'Wrapped SOL', 'WSOL'].includes(token.symbol?.toUpperCase()) &&
        (!token.marketCap || token.marketCap <= 15000000000)
      );
    } catch (fallbackError) {
      console.error("DexScreener fallback failed:", fallbackError);
      return []; // Graceful empty return instead of throw
    }
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
    queryFn: () => fetchTrendingTokens(30),
    refetchInterval: 6000,
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
    // refetchInterval: 5000,
    refetchInterval: false,
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