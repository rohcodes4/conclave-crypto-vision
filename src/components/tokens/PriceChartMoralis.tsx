import React, { useState, useEffect } from 'react';

interface PriceChartProps {
  tokenAddress: string;
  height?: string;
}

const PriceChartMoralis: React.FC<PriceChartProps> = ({ 
  tokenAddress, 
  height = '500px' 
}) => {
  const [chartUrl, setChartUrl] = useState<string>('');

  useEffect(() => {
    if (!tokenAddress) {
      setChartUrl('');
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const fetchPairAndEmbed = async () => {
      try {
        console.log('Fetching DexScreener data for DexTools chart:', tokenAddress);
        
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
        );
        
        if (!response.ok) {
          console.warn('DexScreener API failed:', response.status);
          return;
        }

        const data = await response.json();
        console.log('DexScreener pairs:', data.pairs);

        // ✅ Use first pair (most liquid) → DexTools Solana chart
        const primaryPair = data.pairs?.[0];
        if (primaryPair?.pairAddress) {
          // DexTools Solana pair chart embed
          const dextoolsUrl = `https://www.dextools.io/app/en/solana/pair-explorer/${primaryPair.pairAddress}`;
          setChartUrl(dextoolsUrl);
          console.log('Using DexTools embed:', dextoolsUrl);
          return;
        }

        // Fallback: DexTools token search page
        setChartUrl(`https://www.dextools.io/app/en/solana/pair-explorer/search?q=${tokenAddress}`);
      } catch (error) {
        console.error('DexTools chart fetch error:', error);
        // Final fallback: DexTools Solana search
        setChartUrl(`https://www.dextools.io/app/en/solana/pair-explorer/search?q=${tokenAddress}`);
      }
    };

    fetchPairAndEmbed();

    // 10s timeout 
    timeoutId = setTimeout(() => {
      if (!chartUrl) {
        setChartUrl(`https://www.dextools.io/app/en/solana/pair-explorer/search?q=${tokenAddress}`);
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [tokenAddress]);

  if (!chartUrl) {
    return (
      <div 
        className="w-full flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-xl border border-orange-500/50 shadow-2xl backdrop-blur-sm"
        style={{ height }}
      >
        <div className="text-orange-300 text-lg animate-pulse">
          <div>📈 Loading DexTools Chart</div>
          <div className="text-sm mt-1 opacity-80">Fetching pair data...</div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={chartUrl}
      className="w-full rounded-xl border-0 bg-gray-900 shadow-2xl"
      style={{ height }}
      title={`DexTools Chart for ${tokenAddress.slice(0, 8)}...`}
      allowTransparency
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation"
      loading="lazy"
    />
  );
};

export default PriceChartMoralis;
