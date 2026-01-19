import React, { useState, useEffect } from 'react';

interface PriceChartProps {
  tokenAddress: string;
  height?: string;
}

const PriceChartMoralis: React.FC<PriceChartProps> = ({ 
  tokenAddress, 
  height = '500px' 
}) => {
  const [chartUrl, setChartUrl] = useState('');

  useEffect(() => {
    if (!tokenAddress) return;

    // Priority 1: Birdeye (direct token chart)
    // setChartUrl(`https://public-api.birdeye.so/defi/chart/apollo?address=${tokenAddress}&type=1D`);

    // Fallback: GeckoTerminal (auto-find DEX pool)
    const findPool = async () => {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
        const data = await res.json();
        if (data.pairs?.[0]?.pairAddress) {
          setChartUrl(`https://www.dextools.io/widget-chart/en/solana/pe-light/${tokenAddress}?theme=dark&chartType=0&chartResolution=1&drawingToolbars=true&tvPlatformColor=1f2128&tvPaneColor=1f2128&headerColor=1f2128&chartInUsd=true`);
        }
      } catch {}
    };
    findPool();
  }, [tokenAddress]);

  if (!chartUrl) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-900 rounded-xl border border-gray-800">
        <div className="text-gray-400 animate-pulse text-lg">Loading chart...</div>
      </div>
    );
  }

  return (
    <iframe
      src={chartUrl}
      className="w-full rounded-xl border-0 bg-black shadow-2xl"
      style={{ height }}
      title="Price Chart"
      allowTransparency
      sandbox="allow-scripts allow-same-origin allow-popups"
      loading="lazy"
    />
  );
};

export default PriceChartMoralis;
