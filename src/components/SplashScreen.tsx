import React, { useRef, useState } from "react";
import splashVideo from "@/assets/videos/splash.mp4";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnterClick = () => {
    setHasEntered(true);
    videoRef.current?.play();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain lg:object-cover opacity-40"
        muted
        playsInline
        preload="none"
        poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFhgJ/qf1xsgAAAABJRU5ErkJggg=="
        onEnded={onComplete}
        onError={(e) => {
          console.error("Video failed to load:", e);
          const videoEl = e.target as HTMLVideoElement;
          if (videoEl) videoEl.style.display = "none";
          onComplete();
        }}
      >
        <source src={splashVideo as string} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!hasEntered && (
        <div>
        <div
          className="font-pixel relative z-10 text-white text-4xl md:text-6xl font-bold cursor-pointer border-[#ff7229] border-[6px] p-6 pt-7 rounded-full w-max mx-auto"
          style={{ WebkitTextStroke: "1px #ff7229" }}
          onClick={handleEnterClick}
        >
          ENTER
        </div>
        <div
        className="font-pixel relative z-10 text-white text-[10px] md:text-[10px] font-bold cursor-pointer p-6 pt-7 mx-auto text-center underline"
        onClick={onComplete}>
          Skip Intro
          </div>
          </div>
      )}
    </div>
  );
};

export default SplashScreen;
