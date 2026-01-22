import React, { useRef, useState, useEffect, useCallback } from "react";
import splashVideo from "@/assets/videos/splash.mp4";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const lockScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    Object.assign(document.body.style, {
      position: 'fixed',
      top: `-${scrollTop}px`,
      width: '100%',
      overflow: 'hidden'
    });
    Object.assign(document.documentElement.style, { overflow: 'hidden' });
  }, []);

  const unlockScroll = useCallback(() => {
    const scrollTop = document.body.style.top;
    Object.assign(document.body.style, { position: '', top: '', width: '', overflow: '' });
    Object.assign(document.documentElement.style, { overflow: '' });
    if (scrollTop) window.scrollTo(0, parseInt(scrollTop || '0') * -1);
  }, []);

  const updateFullHeight = useCallback(() => {
    const height = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0,
      window.visualViewport?.height || 0
    );
    if (containerRef.current) {
      containerRef.current.style.height = `${height}px`;
      containerRef.current.style.minHeight = `${height}px`;
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.backgroundColor = 'black'; // Covers bar gaps
    
    lockScroll();
    updateFullHeight();
    
    window.addEventListener('resize', updateFullHeight);
    window.addEventListener('orientationchange', () => setTimeout(updateFullHeight, 100));
    
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener('touchmove', prevent, { passive: false });
    
    return () => {
      unlockScroll();
      document.documentElement.style.backgroundColor = '';
      window.removeEventListener('resize', updateFullHeight);
      window.removeEventListener('orientationchange', () => setTimeout(updateFullHeight, 100));
      document.removeEventListener('touchmove', prevent);
    };
  }, [lockScroll, unlockScroll, updateFullHeight]);

  const handleEnterClick = () => {
    setHasEntered(true);
    videoRef.current?.play();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2147483647] bg-black flex items-center justify-center overflow-hidden"
      style={{
        height: '100dvh',
        width: '100dvw',
        padding: 'env(safe-area-inset)',
        WebkitOverflowScrolling: 'none'
      }}
    >
      {/* Video with original object-contain sizing */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain lg:object-cover opacity-40"
        muted
        playsInline
        preload="none"
        poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNgYGAAAAAEAAH2FzhVAAAAAElFTkSuQmCC"
        onEnded={onComplete}
        onError={(e) => {
          console.error("Video failed to load:", e);
          onComplete();
        }}
      >
        <source src={splashVideo as string} type="video/mp4" />
      </video>

      {!hasEntered && (
        <div className="relative z-10 flex flex-col items-center px-4 w-full h-full justify-center">
          <div
            className="font-pixel text-white text-4xl md:text-6xl font-bold cursor-pointer border-[#ff7229] border-[6px] p-6 pt-7 rounded-full mx-auto"
            style={{ WebkitTextStroke: "1px #ff7229" }}
            onClick={handleEnterClick}
          >
            ENTER
          </div>
          <div
            className="font-pixel text-white text-[14px] md:text-[14px] font-bold cursor-pointer pt-4 mx-auto text-center"
            onClick={onComplete}
          >
            Skip Intro
          </div>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
