import React, { useState, useEffect, useCallback } from 'react';

interface PriceChartProps {
  tokenAddress: string;
  pairAddress?: string;
  height?: string;
}

const PriceChartMoralis: React.FC<PriceChartProps> = ({ 
  tokenAddress,
  pairAddress,
  height = '500px' 
}) => {
  const [chartUrl, setChartUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPairAndEmbed = useCallback(async (tokenAddr: string) => {
    try {
      console.log('Fetching DexScreener pairs (fallback):', tokenAddr);
      
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddr}`
      );
      
      if (!response.ok) return null;

      const data = await response.json();
      const primaryPair = data.pairs?.[0];
      
      return primaryPair?.pairAddress || null;
    } catch (error) {
      console.error('DexScreener error:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeChart = async () => {
      if (!tokenAddress) {
        setChartUrl('');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      let finalPairAddress: string | null = null;

      // ✅ PRIORITY 1: Use pairAddress if provided (NO API CALL)
      if (pairAddress) {
        console.log('Using provided pairAddress (no API):', pairAddress);
        finalPairAddress = pairAddress;
      } 
      // ✅ PRIORITY 2: Fetch pairs ONLY if no pairAddress
      // else if (tokenAddress) {
      //   console.log('No pairAddress → fetching DexScreener');
      //   finalPairAddress = await fetchPairAndEmbed(tokenAddress);
      // }

      if (finalPairAddress) {
        const widgetUrl = `https://www.dextools.io/widget-chart/en/solana/pe-light/${finalPairAddress}?theme=dark&chartType=0&chartResolution=1&drawingToolbars=true&tvPlatformColor=1f2128&tvPaneColor=1f2128&headerColor=1f2128&chartInUsd=true`;
        setChartUrl(widgetUrl);
        console.log('DexTools widget:', widgetUrl);
      } else {
        // Fallback
        const fallbackUrl = `https://www.dextools.io/widget-chart/en/solana/pe-light/search?q=${tokenAddress}&theme=dark&chartType=0&chartResolution=1`;
        setChartUrl(fallbackUrl);
        console.log('DexTools fallback:', fallbackUrl);
      }

      setIsLoading(false);
    };

    initializeChart();
  }, [tokenAddress, pairAddress, fetchPairAndEmbed]);

  if (isLoading) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-xl border border-orange-500/50 shadow-2xl backdrop-blur-sm"
        style={{ height }}
      >
        <div className="text-orange-300 text-lg animate-pulse">
          <div>📈 Loading DexTools</div>
          <div className="text-sm mt-1 opacity-80">Chart Widget</div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={chartUrl}
      className="w-full rounded-xl border-0 bg-gray-900 shadow-2xl"
      style={{ height }}
      title="DexTools Chart Widget"
      allowTransparency
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      loading="lazy"
    />
  );
};

export default PriceChartMoralis;
