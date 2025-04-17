import React, { useEffect, useRef } from 'react';

const PRICE_CHART_ID = 'price-chart-widget-container';

interface PriceChartProps {
  tokenAddress: string;
}

export const PriceChartMoralis: React.FC<PriceChartProps> = ({ tokenAddress }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadWidget = () => {
      if (typeof (window as any).createMyWidget === 'function') {
        (window as any).createMyWidget(PRICE_CHART_ID, {
          autoSize: true,
          chainId: 'solana',
          tokenAddress: tokenAddress,
          showHoldersChart: false,
          defaultInterval: '1D',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Etc/UTC',
          theme: 'moralis',
          locale: 'en',
          backgroundColor: '#071321',
          gridColor: '#0d2035',
          textColor: '#68738D',
          candleUpColor: '#4CE666',
          candleDownColor: '#E64C4C',
          hideLeftToolbar: false,
          hideTopToolbar: false,
          hideBottomToolbar: false
        });
      } else {
        console.error('createMyWidget function is not defined.');
      }
    };

    let script: HTMLScriptElement | null = null;

    if (!document.getElementById('moralis-chart-widget')) {
      script = document.createElement('script');
      script.id = 'moralis-chart-widget';
      script.src = 'https://moralis.com/static/embed/chart.js';
      script.async = true;
      script.onload = loadWidget;
      script.onerror = () => {
        console.error('Failed to load the chart widget script.');
      };
      document.body.appendChild(script);
    } else {
      loadWidget();
    }

    return () => {
      // Optional: Remove the script on unmount (only if this widget won’t be reused often)
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [tokenAddress]);

  return (
    <div className="w-full max-md:h-[600px] h-[500px] flex flex-col">
      <div
        id={PRICE_CHART_ID}
        ref={containerRef}
        className="w-full flex-grow md:max-h-[500px]"
        style={{ height: '100%' }}
      />
    </div>
  );
};
