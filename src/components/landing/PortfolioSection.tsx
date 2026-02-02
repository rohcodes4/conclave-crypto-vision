import React from "react";

const PortfolioSection: React.FC = () => {
  return (
    <section className="relative md:min-h-screen bg-black text-white px-8 py-12 md:py-28 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(80,255,170,0.12),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,180,80,0.15),transparent_45%)]" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* LEFT */}
        <div>
          <p className="text-sm tracking-widest text-emerald-400 uppercase">
            Portfolio
          </p>

          <h2 className="mt-4 text-5xl leading-tight font-semibold">
            Track Performance
            <br />
            Like a Pro
          </h2>

          <p className="mt-6 text-neutral-400 max-w-md leading-relaxed">
            Balance, profits, win rate, trade history, and leaderboard ranking.
            Everything you need to analyze your trading, learn from mistakes,
            and grow as a trader.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-neutral-300">
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span>
              Real market data, no real money
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span>
              Simulate wins & losses
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span>
              Sharpen skills risk-free
            </li>
          </ul>
        </div>

        {/* RIGHT DASHBOARD */}
        <div className="relative rounded-3xl border border-neutral-700/70 bg-gradient-to-br from-neutral-900/80 to-neutral-800/70 backdrop-blur-xl shadow-[0_0_80px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Glow edges */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/5" />
          <div className="absolute -left-10 top-1/3 w-32 h-32 bg-emerald-500/30 blur-3xl" />
          <div className="absolute -right-10 bottom-1/4 w-32 h-32 bg-amber-400/30 blur-3xl" />

          {/* CONTENT */}
          <div className="relative p-6 space-y-6">
            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
  {/* Metrics */}
  <div className="md:col-span-4 grid grid-cols-2 gap-5">
    <Stat title="Current Balance" value="46,320" sub="+1.36% today" />
    <Stat title="Daily PnL" value="+620" sub="+1.36%" green />
    <Stat title="Total PnL" value="+4,250" sub="+10.1% overall" green />
    <Stat title="Win Rate" value="64%" sub="31 wins, 17 losses" />
  </div>

  {/* Rank */}
  <RankCard />
</div>


            {/* CHART */}
            <div className="relative rounded-2xl border border-neutral-700/60 bg-gradient-to-br from-neutral-900/90 to-neutral-800/80 p-5 overflow-hidden">
  {/* lighting */}
  <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-400/25 blur-3xl" />
  <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-400/20 blur-3xl" />
  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5" />

  {/* header */}
  <div className="relative flex justify-between items-center text-sm mb-4">
    <span className="text-neutral-300">Portfolio Balance</span>
    <div className="flex gap-4 text-neutral-400">
      <span>1W</span>
      <span className="text-white">1M</span>
      <span>3M</span>
      <span>ALL</span>
    </div>
  </div>

  {/* chart */}
  <div className="relative h-52 rounded-xl overflow-hidden bg-neutral-950/80 border border-neutral-700/60">
    {/* grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_top,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

    {/* chart svg */}
    <svg
      viewBox="0 0 600 200"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34f5a6" />
          <stop offset="60%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>

        <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(52,245,166,0.25)" />
          <stop offset="100%" stopColor="rgba(52,245,166,0)" />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* fill */}
      <path
        d="M0,160 C80,120 140,140 220,110 300,80 360,100 440,60 520,20 560,40 600,30 L600,200 L0,200 Z"
        fill="url(#fillGradient)"
      />

      {/* glow line */}
      <path
        d="M0,160 C80,120 140,140 220,110 300,80 360,100 440,60 520,20 560,40 600,30"
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="4"
        filter="url(#glow)"
      />
    </svg>

    {/* value */}
    <div className="absolute bottom-4 right-4 text-sm text-emerald-400 font-semibold">
      $46,320
    </div>
  </div>
</div>


            {/* RECENT TRADES */}
            <div className="rounded-xl border border-neutral-700/70 bg-neutral-900/60 p-4">
              <h4 className="text-sm text-neutral-300 mb-3">
                Recent Trades
              </h4>

              <div className="space-y-3 text-sm">
                <Trade token="CYBER" entry="+292" exit="+644" size="500" result="+352" green />
                <Trade token="DERP" entry="+883" exit="-821" size="620" result="-62" />
                <Trade token="PUMP" entry="+1106" exit="+1530" size="280" result="+474" green />
                <Trade token="WUFFI" entry="+391" exit="+285" size="850" result="-106" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;

/* ---------- helpers ---------- */

const Stat = ({
    title,
    value,
    sub,
    green,
  }: any) => (
    <div className="rounded-2xl border border-neutral-700/60 bg-neutral-900/70 p-5 flex flex-col justify-between min-h-[110px]">
      <div className="text-neutral-400 text-xs tracking-wide">
        {title}
      </div>
  
      <div className={`text-2xl font-semibold mt-2 ${green ? "text-emerald-400" : "text-white"}`}>
        {value}
      </div>
  
      <div className={`text-sm mt-1 ${green ? "text-emerald-400" : "text-neutral-400"}`}>
        {sub}
      </div>
    </div>
  );
  

const Trade = ({
  token,
  entry,
  exit,
  size,
  result,
  green,
}: any) => (
  <div className="grid grid-cols-4 items-center text-neutral-300">
    <span>{token}</span>
    <span>{entry} / {exit}</span>
    <span>{size}</span>
    <span className={green ? "text-emerald-400" : "text-red-400"}>
      {result}
    </span>
  </div>
);

const RankCard = () => (
    <div className="relative rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/20 to-amber-600/30 p-5 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(251,191,36,0.35)]">
      {/* glow */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
      <div className="absolute -top-10 w-24 h-24 bg-amber-400/30 blur-3xl" />
  
      {/* <div className="relative text-2xl">🏆</div> */}
  
      <div className="relative text-3xl font-bold mt-2 text-white">
        #42
      </div>
  
      <div className="relative text-sm text-amber-100 mt-1">
        Ranked this week
      </div>
    </div>
  );
  