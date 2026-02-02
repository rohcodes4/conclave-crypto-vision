import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Users,
  Lock,
} from "lucide-react";

const RugCheckerSection: React.FC = () => {
  const score = 32; // lower = safer
  const circumference = 2 * Math.PI * 46;
  const progress = circumference * (1 - score / 100);

  return (
    <section className="relative py-32 px-6 bg-black text-white overflow-hidden">
      {/* background grid */}
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* ambient glows */}
      {/* <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-emerald-500/20 blur-[160px] rounded-full" /> */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-500/15 blur-[140px] rounded-full" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-20">
        {/* LEFT: SECTION COPY */}
        <div>
          <span className="text-sm text-emerald-400 tracking-wide">
            RISK ANALYSIS
          </span>

          <h2 className="mt-3 text-4xl font-semibold leading-tight">
            Know the Risk
            <br />
            Before You Trade
          </h2>

          <p className="mt-5 text-neutral-400 max-w-sm">
            Every Solana token is scanned using live on-chain data.
            Contracts, liquidity, holders, and behavior are analyzed
            so you understand risk before placing a simulated trade.
          </p>
        </div>

        {/* RIGHT: VISUAL + DIAGNOSTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-auto gap-10">
          {/* SCORE MODULE */}
          <div className="relative rounded-[32px] p-8 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_80px_rgba(34,197,94,0.25)]">
            <h3 className="text-sm text-neutral-400 tracking-wide">
              RUG RISK SCORE
            </h3>

            <div className="relative mt-8 flex items-center justify-center">
              <svg width="200" height="200" className="-rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="65"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="65"
                  stroke="url(#riskGradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={progress}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute text-center">
                <div className="text-3xl font-bold">{score}</div>
                <div className="text-xs text-neutral-400">out of 100</div>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm text-neutral-300">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Mint authority enabled
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Blacklist function detected
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Contract source unverified
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Irregular mint activity
              </div>
            </div>
          </div>

          {/* DIAGNOSTIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Liquidity */}
            <div className="rounded-2xl p-5 bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h4 className="font-medium">Liquidity</h4>
              </div>

              <ul className="mt-4 space-y-1.5 text-sm text-neutral-300">
                <li>• Locked via verified contract</li>
                <li>• Unlock in ~3 months</li>
                <li>• No early unlock permissions</li>
                <li>• Liquidity added post-migration</li>
              </ul>
            </div>

            {/* Holders */}
            <div className="rounded-2xl p-5 bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-400" />
                <h4 className="font-medium">Holders</h4>
              </div>

              <ul className="mt-4 space-y-1.5 text-sm text-neutral-300">
                <li>• Top holder owns 27%</li>
                <li>• Top 5 hold 49%</li>
                <li>• Whale dominance: 62%</li>
                <li>• Holder churn increasing</li>
              </ul>
            </div>

            {/* Pump.fun */}
            <div className="rounded-2xl p-5 bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="font-medium">Pump.fun</h4>
              </div>

              <ul className="mt-4 space-y-1.5 text-sm text-neutral-300">
                <li>• Migrated 4 days ago</li>
                <li>• Tax increased after migration</li>
                <li>• Rapid volume spike detected</li>
                <li>• High post-migration churn</li>
              </ul>
            </div>

            {/* Creator Balance & Details */}
            <div className="rounded-2xl p-5 bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-red-400" />
                <h4 className="font-medium">Creator Balance & Details</h4>
              </div>

              <ul className="mt-4 space-y-1.5 text-sm text-neutral-300">
                <li>• Creator wallet holds 18%</li>
                <li>• No recent balance reduction</li>
                <li>• Multiple wallets linked to deployer</li>
                <li>• No public identity verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RugCheckerSection;
