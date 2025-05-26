// We need to update the fetchPumpVisionTokens function to properly use the Bitquery API key

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const SOLSCAN_API_URL = "https://public-api.solscan.io/v2";
const SOLSCAN_PRO_API_URL = "https://pro-api.solscan.io/v2.0";
// export const SOLSCAN_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3MjM2Nzk3MDgxOTgsImVtYWlsIjoiZHJlYW15dGdib3RAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiYXBpVmVyc2lvbiI6InYyIiwiaWF0IjoxNzIzNjc5NzA4fQ.qEG3q2DSX_i60f8eNhAZ_XEQgmbRHZmQPgY4_7RhZQU";
export const SOLSCAN_API_KEY= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3MzkwNDI4NDY3MjQsImVtYWlsIjoicm9oaXRwYXJha2g0QGdtYWlsLmNvbSIsImFjdGlvbiI6InRva2VuLWFwaSIsImFwaVZlcnNpb24iOiJ2MiIsImlhdCI6MTczOTA0Mjg0Nn0.agSChroYiwNthnH9ER1UBNZUErAMXpiHTRcmMWKnYyM";
const DEXSCREENER_API_URL = "https://api.dexscreener.com";
const BITQUERY_API_URL = "https://graphql.bitquery.io";
const BITQUERY_API_KEY = "BQYoPCljQdkDjr3Dk7LkRdRrnFsYlkOQ";
const MORALIS_API_KEY = "L2RCjJqapuhCylzNb7esHJH18oXoNU0CLyNWKM9SwGeTOu3FAGDYe10GvctbWrSA";
// const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjAwYzM0YmQzLTI2MjAtNDVkNy1iMjY2LWFhYjY3M2I3NThlMSIsIm9yZ0lkIjoiNDk4NjYiLCJ1c2VySWQiOiI0OTUyNCIsInR5cGVJZCI6IjEyYTEwNmUyLWE5ODgtNGE2Ny04NTYzLWI2ZmJiMmVkNjU4MiIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNzM0NTkxODU3LCJleHAiOjQ4OTAzNTE4NTd9.x194htbKsuSEILxDdKfKlA7JYv0hkRm18jwM7Ir59VA";
// const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImVmYzkwNmU4LTA1NWUtNGE4OC04OWM4LWQ4NDgyOTA0YWVjNCIsIm9yZ0lkIjoiNDExMTIyIiwidXNlcklkIjoiNDIyNDg3IiwidHlwZUlkIjoiZTM1NGU1MWYtNzE1NS00YjU3LWI4YjMtN2EzOTlmM2E0NjQ0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mjg0OTQ4MjUsImV4cCI6NDg4NDI1NDgyNX0.xc_F5PAg6FEt-mqFxMfGw26hdiO5D5AnydK9qAq8yiw";
// const BITQUERY_API_KEY = "bd849c74-c73a-41b0-9ba3-7af18605db15";
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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImZhNGNmNTQ0LTQ1NmQtNGY3ZC04NTVlLTU0NzM4Y2Y5YjE5NSIsIm9yZ0lkIjoiNDQ4MzExIiwidXNlcklkIjoiNDYxMjU1IiwidHlwZUlkIjoiMDJlOTgzMzctMjQ2ZC00ZTY1LTg4ODktMTUyZmRmZWExYjRiIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDc4MjMyNTYsImV4cCI6NDkwMzU4MzI1Nn0.KRmgCll0KmX3pRyHYQRwldblvIMIZzdNaC8Z_z_xe8o",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImE5OGMwNzE0LTdhMDctNDJjZC05Y2IxLTU0MjJhNGVlZmMxZCIsIm9yZ0lkIjoiNDI1ODczIiwidXNlcklkIjoiNDM4MDM4IiwidHlwZUlkIjoiM2ZiYjNhNzctMjc2MS00Yzg1LWEzYjgtZDNmZWU0NDg2NTQ1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzY5MjUzMzQsImV4cCI6NDg5MjY4NTMzNH0.8ZK5a5-sAKR5oETgSajMpL2KiYmCWercrY6iHtfqcMM",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFkYmNiYTE5LTAyNjItNDFkOC1iOTAyLTc1NDZlZjdjODAzNiIsIm9yZ0lkIjoiNDEzMTYzIiwidXNlcklkIjoiNDI0NjAwIiwidHlwZUlkIjoiMGJiMzQ2M2EtNzY1YS00YjEzLWI1MWUtZWMxZTljNzE0NzI5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzA3ODAwMzUsImV4cCI6NDg4NjU0MDAzNX0.nsob2ZB0NJPk4a1dzG6NtDIqoOASrvltH1LRhOx22-8",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImIwNjFkNjc3LTM4ZDctNDgyYi05ZThjLWI0NTk1NDRhZjY3OCIsIm9yZ0lkIjoiMzQyODkwIiwidXNlcklkIjoiMzUyNDkzIiwidHlwZUlkIjoiYzVhYzdjZDMtY2MyOS00YmJhLWI5MjctYzI0YWQ5MTk1NWM0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODY1NzE2NzIsImV4cCI6NDg0MjMzMTY3Mn0.89-ku0zK8EoHQnb5IN4WGJ2H-eSLZy_w1Em_mYhsECk",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijc2NWIxN2NiLWE5ZjAtNDMwNC1iMzA2LWJhZWM2MGVjOTdmNiIsIm9yZ0lkIjoiMzcxNTc3IiwidXNlcklkIjoiMzgxODc2IiwidHlwZUlkIjoiYzBiN2JkMDctMjRiOS00YTY1LTlhM2UtZTc0YjQzMTAyMWNhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDQ4ODE3MzIsImV4cCI6NDg2MDY0MTczMn0.gXPvkRBFAw4WfSJrqVUgXmXHGWd6jjeSCRbzLiS-zgc",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjMxYjYzYWQ5LWFhNDgtNGZlYS05ZjZjLTZkMjc1ZmI4MDlhMiIsIm9yZ0lkIjoiMzcwMjU4IiwidXNlcklkIjoiMzgwNTI3IiwidHlwZUlkIjoiMDUzODFlMjYtMGRjZi00MDRmLTlkMTctYzNlMmQ2YjliYjJiIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDUzNDI3MTIsImV4cCI6NDg2MTEwMjcxMn0.dzr9g0VIgrbz7pe3ARK_njY1-6Le1skE3EfXLEvyLzY",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjkxNTg5ZGY2LTE0ZGMtNDYzNS05ODQyLTMwOTZjNmQzNmRjMSIsIm9yZ0lkIjoiNDQ4NzYyIiwidXNlcklkIjoiNDYxNzI3IiwidHlwZUlkIjoiMmNlN2MwNDktMDJlOS00M2Y5LWFiM2ItYjM5YjFiZmQ0MTMyIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDgwMDk5MzAsImV4cCI6NDkwMzc2OTkzMH0.Nl5-wqNt-eMNmcPCayO5luV4l3vmwgSceEu-9dJ4Gzk",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjlhZGNiMTZiLWEzYjEtNDdiYi05YjYyLWMzZDNjMTE1NzkzNyIsIm9yZ0lkIjoiNDQ4NzYzIiwidXNlcklkIjoiNDYxNzI4IiwidHlwZUlkIjoiNDY4MWM4OGItNzk4NS00NjAyLWEyNTItNjBhYTA2MzY4MzI2IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDgwMTAwMTQsImV4cCI6NDkwMzc3MDAxNH0.5jOnWVZVKMRPUEUPwcKaTV4sZGsWIAOgxg3NIY2moR8",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImExMTMzMWMzLTRlY2ItNGNiNS04NTRhLTM1ZWY5M2MwNzA2ZiIsIm9yZ0lkIjoiNDQ4NzY0IiwidXNlcklkIjoiNDYxNzI5IiwidHlwZUlkIjoiNTFiZmUxNGUtMmFlNy00ZDE3LWEzYjYtNWZiZTI1Y2E3ZGNhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDgwMTAxNTQsImV4cCI6NDkwMzc3MDE1NH0.oK3nryM9lzSfsJ3HABXkUc2quzi4aMqgDoQUZ3JRahk",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImM2Mjk2OTBmLTA2YjUtNDZjZS1iMWFjLTA3Y2EyYWNlNWQwNiIsIm9yZ0lkIjoiNDQ4NzY1IiwidXNlcklkIjoiNDYxNzMwIiwidHlwZUlkIjoiNzEwNTM3YjctOGJhMC00ZmQwLTkxMTMtOTE5Mjc1MGQ0MWU5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDgwMTAyODQsImV4cCI6NDkwMzc3MDI4NH0.sg6J1zr_4Is-zhjQ7KySLg9No31XlQBndCjsUcfvQFw",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjA5OTczOGE5LTI1NTEtNDBkMS04MWEyLTk4MGI3ODRiMjdlNyIsIm9yZ0lkIjoiNDQ4NzY2IiwidXNlcklkIjoiNDYxNzMxIiwidHlwZUlkIjoiYTMyYzgwYzQtZTc4OS00YzJhLTgyNDctMTVlNWE3NDFlNjdiIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDgwMTA0MDAsImV4cCI6NDkwMzc3MDQwMH0.JACKv4xo_p-KmX_FbmOFEWTc6igwolJKybz3X3Em-tI",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjRjNDk5NmJjLWZkMmUtNDkzZC1hZDAxLTQyZmYyMmM3NTU4MiIsIm9yZ0lkIjoiNDQ4NzY3IiwidXNlcklkIjoiNDYxNzMyIiwidHlwZUlkIjoiZjM2ZjdlZjEtM2E5Yi00ZGU3LWJmNGItZWEyMmMwZWQ1NmZiIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDgwMTA0NjEsImV4cCI6NDkwMzc3MDQ2MX0.zv8ZiTm8T7hoRg-Q7eMxKjQHnYQJtT1rCINuF8g-Kj8"
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
  website?:string,
  twitter?:string,
  telegram?:string
}

// Fetch token details from Solscan
// export const fetchTokenDetails = async (address: string): Promise<TokenInfo> => {
//   try {
//     const response = await fetch(`${SOLSCAN_PRO_API_URL}/token/meta?address=${address}`, {
//       headers: {
//         "accept": "application/json",
//         "token": SOLSCAN_API_KEY
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch token details: ${response.statusText}`);
//     }
    
//     const data = (await response.json()).data;
//     const currentDate = new Date();
    
//     return {
//       id: data.address || address,
//       name: data.name || "Unknown Token",
//       symbol: data.symbol || "UNKNOWN",
//       price: data.price || 0,
//       change24h: data.price_change_24h || 0,
//       volume24h: data.volume_24h || 0,
//       marketCap: data.market_cap,
//       description: `${data?.metadata?.description != "" && data?.metadata?.description != undefined ? data?.metadata?.description : `${data.name || "Unknown"} (${data.symbol || "UNKNOWN"}) is a Solana token.`}`,
//       twitter: data?.metadata?.twitter?data?.metadata?.twitter:undefined,
//       website: data?.metadata?.website?data?.metadata?.website:undefined,
//       telegram: data?.metadata?.telegram?data?.metadata?.telegram:undefined,
//       logoUrl: data.icon,
//       totalSupply: data.supply ? parseFloat(data.supply) : undefined,
//       launchDate: data.created_time,
//       holder: data.holder,

//     };
//   } catch (error) {
//     console.error("Error fetching token details:", error);
//     throw error;
//   }
// };


// export const fetchTokenDetails = async (address: string): Promise<TokenInfo> => {
//   try {
//     const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/price`, {
//       headers: {
//         'accept': 'application/json',
//         'X-API-Key': MORALIS_API_KEY // Replace with your Moralis API key
//       }
//     });

//     if (response.ok) {
//       const data = await response.json();

//       return {
//         id: address,
//         name: data.name || "Unknown Token",
//         symbol: data.symbol || "UNKNOWN",
//         price: data.usdPrice || 0,
//         change24h: data.usdPrice_24hr_percent_change || 0,
//         volume24h: 0, // Not provided by Moralis
//         marketCap: data.usdPrice * 1000000000,
//         description: `${data.name || "Unknown"} (${data.symbol || "UNKNOWN"}) is a Solana token.`,
//         twitter: undefined,
//         website: undefined,
//         telegram: undefined,
//         logoUrl: data.logo || undefined,
//         totalSupply: data.totalSupply ? parseFloat(data.totalSupply) : undefined,
//         launchDate: undefined,
//         holder: undefined,
//       };
//     } else {
//       console.warn("Moralis API responded with error:", response.statusText);
//     }
//   } catch (e) {
//     console.warn("Moralis fetch failed, falling back to Solscan.", e);
//   }

//   // Fallback to Solscan
//   try {
//     const response = await fetch(`${SOLSCAN_PRO_API_URL}/token/meta?address=${address}`, {
//       headers: {
//         "accept": "application/json",
//         "token": SOLSCAN_API_KEY
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch token details from Solscan: ${response.statusText}`);
//     }

//     const data = (await response.json()).data;

//     return {
//       id: data.address || address,
//       name: data.name || "Unknown Token",
//       symbol: data.symbol || "UNKNOWN",
//       price: data.price || 0,
//       change24h: data.price_change_24h || 0,
//       volume24h: data.volume_24h || 0,
//       marketCap: data.market_cap,
//       description: data?.metadata?.description !== "" && data?.metadata?.description !== undefined
//         ? data.metadata.description
//         : `${data.name || "Unknown"} (${data.symbol || "UNKNOWN"}) is a Solana token.`,
//       twitter: data?.metadata?.twitter || undefined,
//       website: data?.metadata?.website || undefined,
//       telegram: data?.metadata?.telegram || undefined,
//       logoUrl: data.icon,
//       totalSupply: data.supply ? parseFloat(data.supply) : undefined,
//       launchDate: data.created_time,
//       holder: data.holder,
//     };
//   } catch (error) {
//     console.error("Error fetching token details from Solscan:", error);
//     throw error;
//   }
// };

// This is for single api keys for moralis 
// export const fetchTokenDetails = async (address: string): Promise<TokenInfo> => {
//   let moralisPrice: number | undefined;
//   let moralisMarketCap: number | undefined;
//   let moralisPriceChange: number | undefined;

//   // 1. Fetch from Moralis first
//   try {
//     const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/price`, {
//       headers: {
//         'accept': 'application/json',
//         'X-API-Key': MORALIS_API_KEY
//       }
//     });

//     if (response.ok) {
//       const data = await response.json();
//       moralisPrice = data.usdPrice || undefined;
//       moralisMarketCap = moralisPrice * 1000000000; // example multiplier
//       moralisPriceChange = data.usdPrice24hrPercentChange;
//     } else {
//       console.warn("Moralis API responded with error:", response.statusText);
//     }
//   } catch (e) {
//     console.warn("Moralis fetch failed.", e);
//   }

//   // 2. Always return Solscan response
//   try {
//     const response = await fetch(`${SOLSCAN_PRO_API_URL}/token/meta?address=${address}`, {
//       headers: {
//         "accept": "application/json",
//         "token": SOLSCAN_API_KEY
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch token details from Solscan: ${response.statusText}`);
//     }

//     const data = (await response.json()).data;

//     return {
//       id: data.address || address,
//       name: data.name || "Unknown Token",
//       symbol: data.symbol || "UNKNOWN",
//       price: moralisPrice ?? data.price ?? 0,
//       change24h: moralisPriceChange ?? data.price_change_24h ?? 0,
//       volume24h: data.volume_24h || 0,
//       marketCap: moralisMarketCap ?? data.market_cap,
//       description: data?.metadata?.description !== "" && data?.metadata?.description !== undefined
//         ? data.metadata.description
//         : `${data.name || "Unknown"} (${data.symbol || "UNKNOWN"}) is a Solana token.`,
//       twitter: data?.metadata?.twitter || undefined,
//       website: data?.metadata?.website || undefined,
//       telegram: data?.metadata?.telegram || undefined,
//       logoUrl: data.icon,
//       totalSupply: data.supply ? parseFloat(data.supply) : undefined,
//       launchDate: data.created_time,
//       holder: data.holder,
//     };
//   } catch (error) {
//     console.error("Error fetching token details from Solscan:", error);
//     throw error;
//   }
// };

// This is for multiple api keys for moralis 
export const fetchTokenDetails = async (address: string): Promise<TokenInfo> => {
  let moralisPrice: number | undefined;
  let moralisMarketCap: number | undefined;
  let moralisPriceChange: number | undefined;

  // Try each Moralis API key in order
  for (const key of MORALIS_API_KEYS) {
    try {
      const response = await fetch(`https://solana-gateway.moralis.io/token/mainnet/${address}/price`, {
        headers: {
          'accept': 'application/json',
          'X-API-Key': key
        }
      });

      if (response.ok) {
        const data = await response.json();
        moralisPrice = data.usdPrice || undefined;
        moralisMarketCap = moralisPrice * 1000000000; // example multiplier
        moralisPriceChange = data.usdPrice24hrPercentChange;
        break; // Stop after successful response
      } else {
        console.warn(`Moralis API key failed with status ${response.status}: ${response.statusText}`);
      }
    } catch (e) {
      console.warn("Error using Moralis key:", e);
    }
  }

  // Solscan fallback (always used)
  try {
    const response = await fetch(`${SOLSCAN_PRO_API_URL}/token/meta?address=${address}`, {
      headers: {
        "accept": "application/json",
        "token": SOLSCAN_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token details from Solscan: ${response.statusText}`);
    }

    const data = (await response.json()).data;

    return {
      id: data.address || address,
      name: data.name || "Unknown Token",
      symbol: data.symbol || "UNKNOWN",
      price: moralisPrice ?? data.price ?? 0,
      change24h: moralisPriceChange ?? data.price_change_24h ?? 0,
      volume24h: data.volume_24h || 0,
      marketCap: moralisMarketCap ?? data.market_cap,
      description: data?.metadata?.description !== "" && data?.metadata?.description !== undefined
        ? data.metadata.description
        : `${data.name || "Unknown"} (${data.symbol || "UNKNOWN"}) is a Solana token.`,
      twitter: data?.metadata?.twitter || undefined,
      website: data?.metadata?.website || undefined,
      telegram: data?.metadata?.telegram || undefined,
      logoUrl: data.icon,
      totalSupply: data.supply ? parseFloat(data.supply) : undefined,
      launchDate: data.created_time,
      holder: data.holder,
    };
  } catch (error) {
    console.error("Error fetching token details from Solscan:", error);
    throw error;
  }
};

export const searchSolanaTokens = async (query: string): Promise<TokenInfo[]> => {
  try {
    // Check if query looks like an address (simplified check)
    const isAddress = query.length > 30;
    let endpoint = isAddress 
      ? `${SOLSCAN_PRO_API_URL}/token/meta?address=${encodeURIComponent(query)}`
      : `${SOLSCAN_API_URL}/search/token?tokenName=${encodeURIComponent(query)}&offset=0&limit=10`;

    const headers: HeadersInit = {
      "accept": "application/json"
    };

    // Add API key for Pro endpoint
    if (isAddress) {
      headers.token = SOLSCAN_API_KEY;
    }

    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      throw new Error(`Failed to search tokens: ${response.statusText}`);
    }

    let data = await response.json();
    data= data.data

    if (isAddress) {
      // Single token result
      if (data.address) {
        return [{
          id: data.address,
          name: data.name || "Unknown Token",
          symbol: data.symbol || "UNKNOWN",
          price: data.price?.value || 0,
          change24h: data.price?.priceChange || 0,
          volume24h: data.volume24h || 0,
          marketCap: data.marketCap,
          logoUrl: data.icon,
          launchDate: data.created_time,
          holder: data.holder,
        }];
      }
      return [];
    } else {
      // Multiple token results
      return data.data?.map((token: any) => ({
        id: token.mintAddress,
        name: token.name || "Unknown Token",
        symbol: token.symbol || "UNKNOWN",
        price: token.price?.value || 0,
        change24h: token.price?.priceChange24h || 0,
        volume24h: token.volume24h || 0,
        marketCap: token.marketCap,
        logoUrl: `https://solscan.io/token/${token.mintAddress}/logo.png`
      })) || [];
    }
  } catch (error) {
    console.error("Error searching tokens:", error);
    return [];
  }
};


// Fetch trending tokens on Solana using Solscan Pro API
export const fetchTrendingTokens = async (limit:number=20): Promise<TokenInfo[]> => {
  try {
    const response = await fetch(`${SOLSCAN_PRO_API_URL}/token/trending?limit=72`, {
      headers: {
        "accept": "application/json",
        "token": SOLSCAN_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trending tokens: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid response format from Solscan");
    }
    
    // Extract token addresses for batch details fetching
    const tokenAddresses = data.data.map((token: any) => token.address || token.mintAddress).filter(Boolean);
    
    // Batch addresses in chunks to avoid URL length limits
    const chunkSize = 10;
    const tokenDetailsMap: Record<string, any> = {};
    
    // Fetch detailed data for trending tokens in batches
    for (let i = 0; i < tokenAddresses.length; i += chunkSize) {
      const addressChunk = tokenAddresses.slice(i, i + chunkSize);
      const addressParams = addressChunk.map(addr => `address[]=${addr}`).join('&');
      
      const detailsResponse = await fetch(`${SOLSCAN_PRO_API_URL}/token/meta/multi?${addressParams}`, {
        headers: {
          "accept": "application/json",
          "token": SOLSCAN_API_KEY
        }
      });
      
      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        if (detailsData && Array.isArray(detailsData.data)) {
          detailsData.data.forEach((tokenDetail: any) => {
            if (tokenDetail && tokenDetail.address) {
              tokenDetailsMap[tokenDetail.address] = tokenDetail;
            }
          });
        }
      }
    }
    
    return data.data.map((token: any) => {
      if(token.name=="USDT" || token.name=="USDC" || token.name=="Wrapped SOL") return false;
      const address = token.address || token.mintAddress;
      const tokenDetails = tokenDetailsMap[address] || {};
      if(tokenDetails.market_cap>15000000000) return false;
      return {
        id: address,
        name: token.name || tokenDetails.name || "Unknown Token",
        symbol: token.symbol || tokenDetails.symbol || "UNKNOWN",
        price: tokenDetails.price || token.price?.value || 0,
        change24h: tokenDetails.price_change_24h || token.price?.priceChange || 0,
        volume24h: tokenDetails.volume_24h || token.volume24h || 0,
        marketCap: tokenDetails.market_cap || token.marketCap || 0,
        logoUrl: tokenDetails.icon,
        holder: tokenDetails.holder,
      };
    });
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    throw error;
  }
};


// Fetch token prices in batch for holdings
// export const fetchTokenPricesBatch = async (addresses: string[]): Promise<Record<string, number>> => {
//   if (!addresses || addresses.length === 0) return {};
  
//   try {
//     const addressParams = addresses.map(addr => `address[]=${addr}`).join('&');
    
//     const response = await fetch(`${SOLSCAN_PRO_API_URL}/token/meta/multi?${addressParams}`, {
//       headers: {
//         "accept": "application/json",
//         "token": SOLSCAN_API_KEY
//       }
//     });
    
//     if (!response.ok) {
//       throw new Error(`Failed to fetch token prices: ${response.statusText}`);
//     }
    
//     const data = await response.json();
    
//     if (!data.data || !Array.isArray(data.data)) {
//       return {};
//     }
    
//     const pricesMap: Record<string, number> = {};
    
//     data.data.forEach((token: any) => {
//       if (token && token.address && token.price) {
//         pricesMap[token.address] = token.price;
//       }
//     });
    
//     return pricesMap;
//   } catch (error) {
//     console.error("Error fetching token prices:", error);
//     return {};
//   }
// };

// This is for single api keys for moralis 
// export const fetchTokenPricesBatch = async (addresses: string[]): Promise<Record<string, number>> => {
//   if (!addresses || addresses.length === 0) return {};

//   const pricesMap: Record<string, number> = {};

//   // Fetch from Solscan first
//   try {
//     const addressParams = addresses.map(addr => `address[]=${addr}`).join('&');
//     const response = await fetch(`${SOLSCAN_PRO_API_URL}/token/meta/multi?${addressParams}`, {
//       headers: {
//         "accept": "application/json",
//         "token": SOLSCAN_API_KEY
//       }
//     });

//     if (response.ok) {
//       const data = await response.json();
//       if (data.data && Array.isArray(data.data)) {
//         data.data.forEach((token: any) => {
//           if (token && token.address && token.price) {
//             pricesMap[token.address] = token.price;
//           }
//         });
//       }
//     } else {
//       console.warn("Solscan API error:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error fetching from Solscan:", error);
//   }

//   // Fetch from Moralis and override
//   try {
//     const moralisResponse = await fetch(`https://solana-gateway.moralis.io/token/mainnet/prices`, {
//       method: 'POST',
//       headers: {
//         'accept': 'application/json',
//         'content-type': 'application/json',
//         'X-API-Key': MORALIS_API_KEY
//       },
//       body: JSON.stringify({ addresses })
//     });

//     console.log("Moralis status:", moralisResponse.status);

//     const moralisRaw = await moralisResponse.text();
//     console.log("Raw Moralis response:", moralisRaw);

//     let moralisData: any;
//     try {
//       moralisData = JSON.parse(moralisRaw);
//     } catch (jsonErr) {
//       console.error("Failed to parse Moralis JSON:", jsonErr);
//       return pricesMap;
//     }

//     if (moralisData && typeof moralisData === 'object') {
//       for (const [address, token] of Object.entries<any>(moralisData)) {
//         if (token && typeof token.usdPrice === 'number') {
//           console.log(`Overriding price for ${token.tokenAddress} with Moralis price:`, token.usdPrice);
//           pricesMap[token.tokenAddress] = token.usdPrice;
//         }
//       }
//     } else {
//       console.warn("Unexpected Moralis data shape:", moralisData);
//     }
//   } catch (error) {
//     console.error("Error fetching from Moralis:", error);
//   }
//   console.log("priceMap", pricesMap)
//   return pricesMap;
// };

// This is for multiple api keys for moralis 
export const fetchTokenPricesBatch = async (addresses: string[]): Promise<Record<string, number>> => {
  if (!addresses || addresses.length === 0) return {};

  const pricesMap: Record<string, number> = {};

  // Fetch from Solscan first
  try {
    const addressParams = addresses.map(addr => `address[]=${addr}`).join('&');
    const response = await fetch(`${SOLSCAN_PRO_API_URL}/token/meta/multi?${addressParams}`, {
      headers: {
        "accept": "application/json",
        "token": SOLSCAN_API_KEY
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((token: any) => {
          if (token && token.address && token.price) {
            pricesMap[token.address] = token.price;
          }
        });
      }
    } else {
      console.warn("Solscan API error:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching from Solscan:", error);
  }

  // Try each Moralis key in order until success
  for (const apiKey of MORALIS_API_KEYS) {
    try {
      const moralisResponse = await fetch(`https://solana-gateway.moralis.io/token/mainnet/prices`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ addresses })
      });

      // console.log("Moralis status:", moralisResponse.status);

      if (moralisResponse.status !== 200) {
        continue;
      }

      const moralisRaw = await moralisResponse.text();
      let moralisData: any;
      try {
        moralisData = JSON.parse(moralisRaw);
      } catch (jsonErr) {
        console.error("Failed to parse Moralis JSON:", jsonErr);
        return pricesMap;
      }

      if (moralisData && typeof moralisData === 'object') {
        for (const [address, token] of Object.entries<any>(moralisData)) {
          if (token && typeof token.usdPrice === 'number') {
            // console.log(`Overriding price for ${token.tokenAddress} with Moralis price:`, token.usdPrice);
            pricesMap[token.tokenAddress] = token.usdPrice;
          }
        }
      } else {
        console.warn("Unexpected Moralis data shape:", moralisData);
      }

      break; // Exit loop on successful response

    } catch (error) {
      console.error("Error fetching from Moralis with key:", apiKey, error);
    }
  }

  // console.log("priceMap", pricesMap);
  return pricesMap;
};




// Fetch new pairs from DexScreener token profiles API
export const fetchNewPairs = async (): Promise<TokenInfo[]> => {
  try {
    const response = await fetch(
      `${DEXSCREENER_API_URL}/token-profiles/latest/v1?metadataOnly=false&chain=solana&limit=72`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch new pairs: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid response format from DexScreener token profiles API");
    }

    const solanaPairs = data.filter((pair: any) => pair.chainId === "solana");
    const tokenAddresses = solanaPairs
      .map((pair: any) => pair.tokenAddress)
      .filter((addr: string) => typeof addr === "string" && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr));

    let tokenDetailsMap: Record<string, any> = {};

    if (tokenAddresses.length > 0) {
      try {
        const chunkSize = 10;
        for (let i = 0; i < tokenAddresses.length; i += chunkSize) {
          const addressChunk = tokenAddresses.slice(i, i + chunkSize);
          const addressParams = addressChunk.map(addr => `address[]=${addr}`).join("&");

          const detailsResponse = await fetch(
            `${SOLSCAN_PRO_API_URL}/token/meta/multi?${addressParams}`,
            {
              headers: {
                accept: "application/json",
                token: SOLSCAN_API_KEY
              }
            }
          );

          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();

            // console.log("📦 Solscan tokenDetails response:", detailsData);

            if (Array.isArray(detailsData.data)) {
              detailsData.data.forEach((tokenDetail: any) => {
                if (tokenDetail?.address) {
                  tokenDetailsMap[tokenDetail.address.toLowerCase()] = tokenDetail;
                }
              });
            }
            // console.log("⚠️ Solscan details fetch success with status:", tokenDetailsMap);

          } else {
            console.warn("⚠️ Solscan details fetch failed with status:", detailsResponse.status);
            console.warn("⚠️ Solscan details fetch failed with status:", tokenDetailsMap);
          }
        }
      } catch (detailsError) {
        console.error("❌ Error fetching token details:", detailsError);
      }
    }
    
    return solanaPairs.map((pair: any) => {
      const address = pair.tokenAddress.toLowerCase();
      const tokenDetails = tokenDetailsMap[address] || {};
      // console.log("tokenDetails")
      // console.log(tokenDetails)
      return {
        id: pair.tokenAddress,
        name: tokenDetails.name || "Unknown Token",
        symbol: tokenDetails.symbol || "UNKNOWN",
        price: tokenDetails.price || 0,
        change24h: tokenDetails.price_change_24h || 0,
        volume24h: tokenDetails.volume_24h || 0,
        marketCap: tokenDetails.market_cap || 0,
        logoUrl: pair.icon || `https://solscan.io/token/${pair.tokenAddress}/logo.png`,
        description: pair.description || "",
        links: pair.links || [],
        chainId: "solana",
        holder: tokenDetails.holder,
        launchDate: tokenDetails.created_time,


      };
    });
  } catch (error) {
    console.error("❌ Error fetching new pairs:", error);
    throw error;
  }
};

// Fetch data for PumpVision using Bitquery API
export const fetchPumpVisionTokens = async (): Promise<{
  // newTokens: TokenInfo[],
  aboutToMigrate: TokenInfo[],
  migrated: TokenInfo[]
}> => {
  try {
    // Define the GraphQL queries for the different categories
    // const newTokensQuery = `
    //   {
    //     ethereum(network: solana) {
    //       smartContractCalls(
    //         options: {desc: "block.timestamp", limit: 10}
    //         date: {since: "2023-04-01"}
    //       ) {
    //         smartContract {
    //           address {
    //             address
    //           }
    //           contractType
    //           currency {
    //             name
    //             symbol
    //           }
    //         }
    //         block {
    //           timestamp {
    //             time
    //           }
    //         }
    //       }
    //     }
    //   }
    // `;

    // const aboutToMigrateQuery = `
    //   {
    //     ethereum(network: solana) {
    //       dexTrades(
    //         options: {desc: "tradeAmount", limit: 10}
    //         exchangeName: {is: "pump.fun"}
    //       ) {
    //         tokenAddress: seller {
    //           address
    //           annotation
    //           smartContract {
    //             currency {
    //               name
    //               symbol
    //             }
    //           }
    //         }
    //         tradeAmount
    //         block {
    //           timestamp {
    //             time
    //           }
    //         }
    //       }
    //     }
    //   }
    // `;

    // const migratedQuery = `
    //   {
    //     ethereum(network: solana) {
    //       dexTrades(
    //         options: {desc: "tradeAmount", limit: 10}
    //         exchangeName: {in: ["pump.fun", "raydium"]}
    //       ) {
    //         tokenAddress: buyer {
    //           address
    //           annotation
    //           smartContract {
    //             currency {
    //               name
    //               symbol
    //             }
    //           }
    //         }
    //         tradeAmount
    //         block {
    //           timestamp {
    //             time
    //           }
    //         }
    //       }
    //     }
    //   }
    // `;

    const executeMoralisQuery = async (url: string) => {
      for (const apiKey of MORALIS_API_KEYS) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'X-API-Key': apiKey,
            }
          });
    
          if (response.ok) {
            return await response.json();
          } else {
            console.log(`${apiKey} failed`)
            console.warn(`Moralis API key failed (status ${response.status}): ${response.statusText}`);
          }
        } catch (error) {
          console.warn(`Error with Moralis API key:`, error);
        }
      }
    
      throw new Error("All Moralis API keys failed to fetch data.");
    };
    
    const fetchSolscanData = async (tokenAddress: string) => {
      try {
        const res = await fetch(`https://pro-api.solscan.io/v2.0/token/meta?address=${tokenAddress}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'token': SOLSCAN_API_KEY
          }
        });
    
        if (!res.ok) {
          console.warn(`Solscan error for ${tokenAddress}: ${res.status}`);
          return null;
        }
    
        return await res.json();
      } catch (error) {
        console.error(`Error fetching Solscan data for ${tokenAddress}:`, error);
        return null;
      }
    };
    
    const enrichTokensWithSolscan = async (tokens: any[]) => {
      return await Promise.all(tokens.map(async (item) => {
        if(item.market_cap>15000000000) return false;
        const address = item.tokenAddress;
        let solscanData = await fetchSolscanData(address);
        solscanData = solscanData.data;
    // console.log(solscanData)
        return {
          id: address || crypto.randomUUID(),
          name: item.name || solscanData?.name || "Unknown Token",
          symbol: item.symbol || solscanData?.symbol || "UNKNOWN",
          price: parseFloat(item.priceUsd || 0),
          logoUrl: item.logo || solscanData?.icon,
          description: solscanData?.description || "",
          website: solscanData?.website || "",
          tags: solscanData?.tags || [],
          change24h: solscanData.price_change_24h, // or Math.random() * 100
      volume24h: solscanData?.volume_24h,
      marketCap: solscanData?.market_cap,
      holder: solscanData.holder,      
        launchDate: solscanData.created_time,
        };
      }));
    };
    
    // Run everything
    const [aboutToMigrateData, migratedData] = await Promise.all([
      executeMoralisQuery("https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/bonding?limit=36"),
      executeMoralisQuery("https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/graduated?limit=36")
    ]);
    
    const aboutToMigrate: TokenInfo[] = await enrichTokensWithSolscan(aboutToMigrateData?.result || []);
    const migrated: TokenInfo[] = await enrichTokensWithSolscan(migratedData?.result || []);

    return {
      // newTokens,
      aboutToMigrate,
      migrated
    };
  } catch (error) {
    console.error("Error fetching pump vision tokens:", error);
    
    // Return fallback data in case of error
    const fallbackData = (count: number): TokenInfo[] => {
      return Array(count).fill(0).map((_, i) => ({
        id: `fallback-${i}`,
        name: `Pump Token ${i + 1}`,
        symbol: `PUMP${i + 1}`,
        price: Math.random() * 0.001,
        change24h: Math.random() * 100,
        volume24h: Math.random() * 1000000,
        marketCap: Math.random() * 5000000,
        holder: Math.random() * 50000,
        launchDate: Math.random() * 5000000,
      }));
    };
    
    return {
      // newTokens: fallbackData(10),
      aboutToMigrate: fallbackData(10),
      migrated: fallbackData(10)
    };
  }
};

// Custom hooks
export const useTrendingSolanaTokens = () => {
  return useQuery({
    queryKey: ['trending-solana-tokens'],
    // @ts-ignore
    queryFn: fetchTrendingTokens,
    refetchInterval: 60000, // Refetch every minute
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
    meta: {
      onError: () => {
        toast.error("Failed to load trending tokens");
      }
    }
  });
};

export const useTokenDetail = (address: string) => {
  return useQuery({
    queryKey: ['solana-token-detail', address],
    queryFn: () => fetchTokenDetails(address),
    enabled: !!address && address.length > 10, // Only fetch for valid-looking addresses
    refetchInterval: 5000, // Fetch every 5 seconds
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
    meta: {
      onError: () => {
        toast.error("Failed to load token details");
      }
    }
  });
};

export const useTokenPricesBatch = (addresses: string[]) => {
  return useQuery({
    queryKey: ['token-prices-batch', addresses],
    queryFn: () => fetchTokenPricesBatch(addresses),
    enabled: !!addresses && addresses.length > 0,
    refetchInterval: 5000, // Refetch every minute
    retry: 3,
    meta: {
      onError: () => {
        toast.error("Failed to fetch token prices");
      }
    }
  });
};

export const useNewPairs = () => {
  return useQuery({
    queryKey: ['new-pairs'],
    queryFn: () => fetchNewPairs(),
    refetchInterval: 120000, // Refetch every 2 minutes
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
    meta: {
      onError: () => {
        toast.error("Failed to load new pairs");
      }
    }
  });
};

export const usePumpVisionTokens = () => {
  return useQuery({
    queryKey: ['pump-vision-tokens'],
    queryFn: fetchPumpVisionTokens,
    refetchInterval: 300000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
    meta: {
      onError: () => {
        toast.error("Failed to load pump vision data");
      }
    }
  });
};

export const useSearchSolanaTokens = (query: string) => {
  return useQuery({
    queryKey: ['search-solana-tokens', query],
    queryFn: () => searchSolanaTokens(query),
    enabled: query.length > 1,
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
    meta: {
      onError: () => {
        toast.error("Search failed");
      }
    }
  });
};
