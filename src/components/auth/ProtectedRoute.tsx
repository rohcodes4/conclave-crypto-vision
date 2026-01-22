import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import diamond from '@/assets/images/diamond.png';
import TelegramLogin from '../TelegramLogin';
import Web3Login from '../Web3Login';
import { Component } from '../ui/etheral-shadow';

type SplashScreenProps = {
  handleSplashComplete: () => void;
};

const ProtectedRoute: React.FC<SplashScreenProps> = ({ handleSplashComplete }) => {
  const { user, loading, signInWithDiscord } = useAuth();

  const handleDiscordSignIn = async () => {
    try {
      handleSplashComplete;
      await signInWithDiscord();
    } catch (error) {
      console.error('Discord sign in error:', error);
    }
  };

  if (loading) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a,black)]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border border-white/20 rounded-full animate-spin border-t-white mb-6" />
          <p className="text-white/60 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-black overflow-hidden p-4">
        {/* Animated background */}
         <Component
      color="rgba(128, 128, 128, 1)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
         />

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-white/20 via-white/5 to-transparent shadow-[0_0_80px_rgba(255,255,255,0.08)]">
          <div className="relative rounded-2xl p-[1.5px] overflow-hidden animated-border">
            <div className="relative rounded-2xl bg-black/70 backdrop-blur-xl p-8 font-pixel text-white overflow-hidden">

              {/* Noise overlay */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[url('/noise.png')]" />

              {/* Floating diamond */}
              <img
                src={diamond}
                alt="diamond"
                className="mx-auto max-h-[180px] animate-[float_6s_ease-in-out_infinite]"
              />

              <h1
                className="mt-4 text-3xl font-bold text-center uppercase tracking-[6px]"
                style={{ WebkitTextStroke: '1px white' }}
              >
                Paper Trader
              </h1>

              <p className="mt-4 mb-8 text-xs text-center text-white/70 max-w-[220px] mx-auto">
                You need to sign in to access this application.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={handleDiscordSignIn}
                  className="w-full rounded-full bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 shadow-[0_0_25px_rgba(88,101,242,0.35)] flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  Sign in with Discord
                </Button>

                <TelegramLogin />
                <Web3Login />
              </div>

              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            </div>
          </div>
        </div>

        {/* Animations */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }

            @keyframes scan {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }

            .animated-border::before {
              content: "";
              position: absolute;
              inset: -60%;
              background: conic-gradient(
                from 0deg,
                transparent 0deg,
                rgba(255,255,255,0.9) 40deg,
                transparent 80deg,
                rgba(255,255,255,0.6) 140deg,
                transparent 200deg,
                rgba(255,255,255,0.8) 260deg,
                transparent 320deg,
                transparent 360deg
              );
              animation: rotateBorder 8s linear infinite;
              filter: blur(0.5px);
            }

            /* This masks the center WITHOUT killing transparency */
            .animated-border::after {
              content: "";
              position: absolute;
              inset: 1.5px;
              border-radius: 1rem;
              background: rgba(0,0,0,0.65); /* matches your bg-black/70 */
              backdrop-filter: blur(12px);
              z-index: 1;
            }

            .animated-border > div {
              position: relative;
              z-index: 2;
            }

            @keyframes rotateBorder {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

          `}
        </style>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
