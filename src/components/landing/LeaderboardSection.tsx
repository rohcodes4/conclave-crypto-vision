import React, { useEffect, useState } from "react";
import { Trophy, TrendingUp } from "lucide-react";

// Leaderboard data
const leaderboard = [
  { rank: 1, name: "AlphaWolf", score: 96, pnl: "+42.8%" },
  { rank: 2, name: "CryptoZen", score: 92, pnl: "+38.1%" },
  { rank: 3, name: "SolSniper", score: 89, pnl: "+34.6%" }
];

const LeaderboardSection: React.FC = () => {
  const [animatedScores, setAnimatedScores] = useState(
    Array(leaderboard.length).fill(0)
  );

  // Animate score bars on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedScores((prev) =>
        prev.map((v, i) => {
          const target = leaderboard[i].score;
          return v < target ? Math.min(v + 2, target) : v;
        })
      );
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-28 px-6 bg-[#05070d] overflow-hidden">
      {/* Ambient background flares */}
      {/* <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-purple-600/20 blur-[180px]" /> */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#ff7229]/10 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* LEFT COLUMN */}
        <div>
          <p className="text-sm tracking-widest text-emerald-400 uppercase">
            Leaderboard
          </p>
          <h2 className="mt-2 text-4xl font-bold text-white leading-tight">
            Compete With Top Traders
          </h2>
          <p className="mt-4 text-neutral-400 max-w-md leading-relaxed">
            See how you stack up against the best. Track performance, improve
            strategies, and earn your place on the leaderboard.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-neutral-300 list-disc list-inside">
            <li>Compete globally with other traders</li>
            <li>Realistic scoring and PnL tracking</li>
            <li>Earn badges for top ranks</li>
            <li>Sharpen strategies risk-free</li>
          </ul>
        </div>

        {/* RIGHT COLUMN – GAMIFIED LEADERBOARD */}
        <div className="space-y-4">
          {leaderboard.map((r, idx) => {
            const isTop3 = r.rank <= 3;
            let rankGradient = "";
            if (r.rank === 1) rankGradient = "from-yellow-400 to-amber-500";
            else if (r.rank === 2) rankGradient = "from-slate-400 to-slate-500";
            else if (r.rank === 3) rankGradient = "from-amber-700 to-yellow-800";
            else rankGradient = "from-purple-600 to-cyan-400";

            return (
              <div
                key={r.rank}
                className={`relative flex items-center gap-5 p-4 rounded-2xl ${
                  isTop3
                    ? "bg-black/50 border border-white/10 shadow-[0_0_40px_rgba(255,114,41,0.2)]"
                    : "bg-black/30 border border-white/5"
                }`}
              >
                {/* Rank Pill */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-black ${
                    isTop3
                      ? `bg-gradient-to-br ${rankGradient} shadow-[0_0_30px_rgba(250,204,21,0.5)]`
                      : `bg-gradient-to-br ${rankGradient} text-white`
                  }`}
                >
                  #{r.rank}
                </div>

                {/* Name + trophy */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        isTop3 ? "text-white text-lg" : "text-neutral-300"
                      }`}
                    >
                      {r.name}
                    </span>
                    {isTop3 && <Trophy className="w-4 h-4 text-yellow-400" />}
                  </div>

                  {/* Neon progress bar */}
                  <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isTop3
                          ? "bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                          : "bg-gradient-to-r from-purple-400 to-cyan-300/60"
                      }`}
                      style={{ width: `${animatedScores[idx]}%` }}
                    />
                  </div>
                </div>

                {/* Score + PnL */}
                <div className="text-right flex flex-col items-end">
                  <div
                    className={`font-bold ${
                      isTop3 ? "text-white text-lg" : "text-neutral-200"
                    }`}
                  >
                    {r.score}/100
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      r.pnl.startsWith("+") ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {r.pnl}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
