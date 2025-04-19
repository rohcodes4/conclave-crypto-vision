import React, { useEffect, useRef, useState } from 'react';

const PRICE_CHART_ID = 'price-chart-widget-container';

interface PriceChartProps {
  tokenAddress: string;
}

export const PriceChartMoralis: React.FC<PriceChartProps> = ({ tokenAddress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTelegramBrowser, setIsTelegramBrowser] = useState(false);
  const [hasChartError, setHasChartError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent.toLowerCase();
    const isTelegram = ua.includes('telegram');
    setIsTelegramBrowser(isTelegram);

    if (isTelegram) {
      setHasChartError(true);
      return;
    }

    const loadWidget = () => {
      if (typeof (window as any).createMyWidget === 'function') {
        try {
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
        } catch (err) {
          console.error('Chart initialization failed:', err);
          setHasChartError(true);
        }
      } else {
        console.error('createMyWidget function is not defined.');
        setHasChartError(true);
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
        setHasChartError(true);
      };
      document.body.appendChild(script);
    } else {
      loadWidget();
    }

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [tokenAddress]);

  return (
    <div className="w-full max-md:h-[600px] h-[500px] flex flex-col">
      {hasChartError ? (
        <div className="text-center text-yellow-500 p-4 bg-[#0d2035] rounded-lg">
          Charts might not work in Telegram’s in-app browser.
          <br />
          <a
            href={typeof window !== 'undefined' ? window.location.href : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400"
          >
            Tap here to open in your browser
          </a>
        </div>
      ) : (
        <div
          id={PRICE_CHART_ID}
          ref={containerRef}
          className="w-full flex-grow md:max-h-[500px]"
          style={{ height: '100%' }}
        />
      )}
    </div>
  );
};
