import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {SOLSCAN_API_KEY} from "@/services/solscanService";
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

const dateStrToTime = (dateStr)=>{
  console.log("dateStr")
  console.log(dateStr)
 // Convert number to string
const dateAsString = dateStr.toString();

// Extract parts
const year = parseInt(dateAsString.substring(0, 4));
const month = parseInt(dateAsString.substring(4, 6)) - 1; // JS months are 0-indexed
const day = parseInt(dateAsString.substring(6, 8));

// Create date object
const date = new Date(year, month, day);

// Format to readable string
return date.toDateString(); // Example: "Sat Apr 12 2025"

}
// Function to fetch price data from Solscan API
const fetchPriceData = async (tokenAddress: string, interval: string): Promise<PriceData[]> => {
  try {
    // Fetch data from Solscan API
    const response = await fetch(`https://pro-api.solscan.io/v2.0/token/price?address=${tokenAddress}`, {
      headers: {
        "accept": "application/json",
        "token": SOLSCAN_API_KEY
      }
    });

    const data = await response.json();
    // console.log("data")
    // console.log(data)
    

    // Check if the response is valid and process the data
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        time: dateStrToTime(item.date), // Convert timestamp to readable time
        price: item.price,
      }));
    } else {
      throw new Error("Invalid data format or API response");
    }
  } catch (error) {
    console.error("Error fetching price data:", error);
    return []; // Return an empty array if the API call fails
  }
};

const PriceChart = ({
  tokenName,
  tokenSymbol,
  currentPrice,
  priceChange,
}: PriceChartProps) => {
  console.log(tokenName)
  console.log(tokenSymbol)
  console.log(currentPrice)
  console.log(priceChange)
  const [data, setData] = useState<PriceData[]>([]);
  const [interval, setInterval] = useState<string>("1h");

  const isPositive = priceChange >= 0;

  useEffect(() => {
    // Fetch price data whenever the interval changes
    // Get the current pathname from the browser's URL
const pathname = window.location.pathname;

// Split the pathname and extract the token address (assuming the URL structure is consistent)
const tokenAddress = pathname.split("/")[2];
    fetchPriceData(tokenAddress, interval).then(setData);
  }, [interval]);
  console.log("data")
console.log(data)

  return (
    <Card className="bg-crypto-card border-crypto-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{tokenName} ({tokenSymbol})</CardTitle>
          <div>
            <div className="text-xl font-semibold">${currentPrice.toFixed(8)}</div>
            <div className={`text-sm ${isPositive ? "text-crypto-success" : "text-crypto-danger"}`}>
              {isPositive ? "+" : ""}{priceChange.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* <Tabs defaultValue="1h" className="mb-4">
          <TabsList className="bg-crypto-bg">
            <TabsTrigger value="1h" onClick={() => setInterval("1h")}>1H</TabsTrigger>
            <TabsTrigger value="4h" onClick={() => setInterval("4h")}>4H</TabsTrigger>
            <TabsTrigger value="1d" onClick={() => setInterval("1d")}>1D</TabsTrigger>
            <TabsTrigger value="1w" onClick={() => setInterval("1w")}>1W</TabsTrigger>
            <TabsTrigger value="1m" onClick={() => setInterval("1m")}>1M</TabsTrigger>
          </TabsList>
        </Tabs> */}
        
        <div className="h-64 w-full">
        {data.length === 0 ? (
  <div className="text-center text-sm text-slate-400">No data available</div>
) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="time" 
                tick={{ fill: "#94A3B8", fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                // tickFormatter={() => ""}
                tickFormatter={(value) => value}
              />
              <YAxis 
                tick={{ fill: "#94A3B8", fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(8)}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderRadius: "0.375rem" }}
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
      </CardContent>
    </Card>
  );
};

export default PriceChart;


// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // Simulated price data
// const generateData = (points = 50, baseValue = 1000, volatility = 0.02) => {
//   const data = [];
//   let currentValue = baseValue;
  
//   for (let i = 0; i < points; i++) {
//     const change = currentValue * volatility * (Math.random() * 2 - 1);
//     currentValue += change;
    
//     data.push({
//       time: new Date(Date.now() - (points - i) * 3600000).toLocaleString(),
//       price: currentValue,
//     });
//   }
  
//   return data;
// };

// interface PriceChartProps {
//   tokenName: string;
//   tokenSymbol: string;
//   currentPrice: number;
//   priceChange: number;
// }

// const PriceChart = ({ tokenName, tokenSymbol, currentPrice, priceChange }: PriceChartProps) => {
//   const data = generateData();
//   const isPositive = priceChange >= 0;
  
//   return (
//     <Card className="bg-crypto-card border-crypto-card">
//       <CardHeader className="pb-2">
//         <div className="flex items-center justify-between">
//           <CardTitle>{tokenName} ({tokenSymbol})</CardTitle>
//           <div>
//             <div className="text-xl font-semibold">${currentPrice.toLocaleString()}</div>
//             <div className={`text-sm ${isPositive ? "text-crypto-success" : "text-crypto-danger"}`}>
//               {isPositive ? "+" : ""}{priceChange.toFixed(2)}%
//             </div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue="1d" className="mb-4">
//           <TabsList className="bg-crypto-bg">
//             <TabsTrigger value="1h">1H</TabsTrigger>
//             <TabsTrigger value="4h">4H</TabsTrigger>
//             <TabsTrigger value="1d">1D</TabsTrigger>
//             <TabsTrigger value="1w">1W</TabsTrigger>
//             <TabsTrigger value="1m">1M</TabsTrigger>
//           </TabsList>
//         </Tabs>
        
//         <div className="h-64 w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
//               <XAxis 
//                 dataKey="time" 
//                 tick={{ fill: "#94A3B8", fontSize: 12 }} 
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={() => ""}
//               />
//               <YAxis 
//                 tick={{ fill: "#94A3B8", fontSize: 12 }} 
//                 tickLine={false}
//                 axisLine={false}
//                 domain={['auto', 'auto']}
//                 tickFormatter={(value) => `$${value.toLocaleString()}`}
//               />
//               <Tooltip 
//                 contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderRadius: "0.375rem" }}
//                 labelStyle={{ color: "#F8FAFC" }}
//                 formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
//               />
//               <Area 
//                 type="monotone" 
//                 dataKey="price" 
//                 stroke={isPositive ? "#10B981" : "#EF4444"} 
//                 fill={isPositive ? "url(#colorPositive)" : "url(#colorNegative)"} 
//                 strokeWidth={2}
//               />
//               <defs>
//                 <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
//                 </linearGradient>
//                 <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PriceChart;
