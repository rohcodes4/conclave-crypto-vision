// services/heliusService.ts
import { createClient } from 'viem';
import { mainnet } from 'viem/chains';

const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY || '9d1898dc-11bc-4367-b34f-7cb58ef29d76';

export interface HeliusTokenData {
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
  liquidity?: number;
  holders?: number;
  dexPairs?: Array<{
    pairAddress: string;
    baseToken: string;
    quoteToken: string;
    priceNative: number;
    volume24h: number;
  }>;
  topHolders?: Array<{
    address: string;
    amount: number;
    percentage: number;
  }>;
}

export const useHeliusTokenData = (tokenAddress: string) => {
  const fetchHeliusData = async (): Promise<HeliusTokenData> => {
    try {
      // Helius Price API
      const priceResponse = await fetch(
        `https://api.helius.xyz/v0/prices?api-key=${HELIUS_API_KEY}&ids=${tokenAddress}`
      );
      
      // Helius Token Metadata
      const metadataResponse = await fetch(
        `https://api.helius.xyz/v0/tokens/metadata?api-key=${HELIUS_API_KEY}&mintAccounts=${tokenAddress}`
      );
      
      // Helius DEX Data (via RPC)
      const dexDataResponse = await fetch(
        `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: '1',
            method: 'getTokenAccountsByOwner',
            params: [tokenAddress, { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' }]
          })
        }
      );

      const priceData = await priceResponse.json();
      const metadataData = await metadataResponse.json();
      const dexData = await dexDataResponse.json();

      return {
        price: priceData.data?.[tokenAddress]?.price || 0,
        priceChange24h: priceData.data?.[tokenAddress]?.price24hChange || 0,
        marketCap: priceData.data?.[tokenAddress]?.marketCap || 0,
        volume24h: priceData.data?.[tokenAddress]?.volume24h || 0,
        liquidity: priceData.data?.[tokenAddress]?.liquidity || 0,
        holders: metadataData.data?.[0]?.holders || 0,
        dexPairs: [], // Parse from dexData
        topHolders: [] // Parse from dexData
      };
    } catch (error) {
      console.error('Helius API error:', error);
      return {};
    }
  };

  return { fetchHeliusData };
};
