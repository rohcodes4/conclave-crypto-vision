import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface PriceChartProps {
  tokenName: string;
  tokenSymbol: string;
  currentPrice: number;
  priceChange: number;
}

interface PriceData {
  time: string;
  price: number;
}

// Function to fetch price data using FREE APIs
const fetchPriceData = async (tokenAddress: string, interval: string): Promise<PriceData[]> => {
  try {
    // Try Birdeye first (has free tier with real historical data)
    const timeFrom = Math.floor(Date.now() / 1000) - 86400; // 24 hours ago
    const timeTo = Math.floor(Date.now() / 1000);
    
    const birdeyeResponse = await fetch(
      `https://public-api.birdeye.so/defi/history_price?address=${tokenAddress}&address_type=token&type=1H&time_from=${timeFrom}&time_to=${timeTo}`
    );
    
    if (birdeyeResponse.ok) {
      const birdeyeData = await birdeyeResponse.json();
      if (birdeyeData.data?.items && birdeyeData.data.items.length > 0) {
        return birdeyeData.data.items.map((item: any) => ({
          time: new Date(item.unixTime * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          price: item.value,
        }));
      }
    }
  } catch (birdeyeError) {
    console.warn("Birdeye fetch failed, trying DexScreener:", birdeyeError);
  }

  // Fallback to DexScreener (will generate approximate data)
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch price data from DexScreener");
    }

    const data = await response.json();

    if (data && data.pairs && data.pairs.length > 0) {
      const pair = data.pairs[0];
      
      const currentPrice = parseFloat(pair.priceUsd);
      const priceChange24h = parseFloat(pair.priceChange?.h24 || 0);
      
      // Generate approximate hourly data for last 24 hours
      const dataPoints = 24;
      const priceData: PriceData[] = [];
      
      for (let i = dataPoints; i >= 0; i--) {
        const hourAgo = new Date(Date.now() - i * 3600000);
        // Approximate price based on 24h change with some variance
        const changeRatio = priceChange24h / 100;
        const variance = (Math.random() - 0.5) * 0.02; // +/- 1% random variance
        const approximatePrice = currentPrice / (1 + changeRatio * (1 - i / dataPoints) + variance);
        
        priceData.push({
          time: hourAgo.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          price: approximatePrice,
        });
      }
      
      return priceData;
    }
    
    throw new Error("No pair data available");
  } catch (error) {
    console.error("Error fetching price data:", error);
    return [];
  }
};

const PriceChart = ({
  tokenName,
  tokenSymbol,
  currentPrice,
  priceChange,
}: PriceChartProps) => {
  const [data, setData] = useState<PriceData[]>([]);
  const [interval, setInterval] = useState<string>("1h");
  const [loading, setLoading] = useState(true);

  const isPositive = priceChange >= 0;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const pathname = window.location.pathname;
      const tokenAddress = pathname.split("/")[2];
      
      if (tokenAddress) {
        const priceData = await fetchPriceData(tokenAddress, interval);
        setData(priceData);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [interval]);

  return (
    <Card className="bg-crypto-card border-crypto-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>
            {tokenName} ({tokenSymbol})
          </CardTitle>
          <div>
            <div className="text-xl font-semibold">${currentPrice.toFixed(8)}</div>
            <div
              className={`text-sm ${
                isPositive ? "text-crypto-success" : "text-crypto-danger"
              }`}
            >
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full text-sm text-slate-400">
              Loading chart data...
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-slate-400">
              No chart data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value}
                />
                <YAxis
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value.toFixed(8)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "0.375rem",
                  }}
                  labelStyle={{ color: "#F8FAFC" }}
                  formatter={(value: number) => [`$${value.toFixed(8)}`, "Price"]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#10B981" : "#EF4444"}
                  fill={isPositive ? "url(#colorPositive)" : "url(#colorNegative)"}
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-2 text-xs text-slate-500 text-center">
          24-hour approximate price movement
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;