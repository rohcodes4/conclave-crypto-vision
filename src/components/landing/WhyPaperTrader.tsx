import React from "react";
import { CloudLightning, Shield, TrendingUp, Trophy } from "lucide-react";

const benefits = [
  {
    icon: <CloudLightning className="w-6 h-6 text-cyan-400" />,
    title: "Practice Strategies Risk-Free",
    desc: "Test real trading strategies with live Solana data, without risking any capital."
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    title: "Understand Market Behavior",
    desc: "Gain insight into how real markets move and learn to spot opportunities and risks."
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
    title: "Track Performance & Progress",
    desc: "Analyze your trades, PnL, and win rate to improve your strategies over time."
  },
  {
    icon: <Trophy className="w-6 h-6 text-purple-400" />,
    title: "Compete & Compare",
    desc: "See how you rank against other traders and push yourself to climb the leaderboard."
  }
];

const WhyPaperTrader: React.FC = () => {
  return (
    <section className="relative py-28 px-6 bg-black overflow-hidden">
      {/* Ambient background flares */}
      {/* <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[180px]" /> */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* LEFT COLUMN */}
        <div>
          <p className="text-sm tracking-widest text-emerald-400 uppercase">
            Why Paper Trader
          </p>
          <h2 className="mt-2 text-4xl font-bold text-white leading-tight">
            Learn, Compete, and Build Confidence
          </h2>
          <p className="mt-4 text-neutral-400 max-w-md leading-relaxed">
            Paper Trader is designed to help you master Solana trading safely.
            Analyze markets, practice strategies, and improve your skills — all
            without risking real money.
          </p>

          <ul className="mt-8 space-y-6">
            {benefits.map((b, idx) => (
              <li
                key={idx}
                className="flex gap-4 items-start bg-gradient-to-r from-neutral-900/80 to-neutral-800/60 p-4 rounded-2xl border border-neutral-700/50 shadow-lg hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-black/50 to-white/5 shadow-md">
                  {b.icon}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{b.title}</h4>
                  <p className="text-neutral-400 text-sm mt-1">{b.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT COLUMN */}
        <div className="relative">
          {/* Mockup graphic / abstract visualization */}
          <div className="w-full h-[400px] rounded-3xl bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 border border-neutral-700/50 shadow-[0_0_80px_rgba(0,0,0,0.7)] overflow-hidden flex items-center justify-center">
            <div className="text-neutral-600 text-lg italic">
              {/* Placeholder for illustration / chart / gamified graphic */}
              Your Strategy Dashboard Preview
            </div>

            {/* Glow lights */}
            <div className="absolute -top-20 -left-10 w-40 h-40 bg-emerald-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 w-40 h-40 bg-amber-400/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyPaperTrader;
