import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, DollarSign, Crown, Users } from "lucide-react";

export const TokenExploration = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-neutral-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,114,41,0.076),transparent_95%)]" />
      {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,114,41,0.06),transparent_55%)]" /> */}

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Track Performance. Learn from Every Trade.
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            Monitor PnL, review trade history, and climb the leaderboards.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Balance"
            value="$45,320"
            change="+12.4%"
            glow="emerald"
            icon={DollarSign}
          />
          <StatCard
            title="Realised PnL"
            value="+$12,500"
            change="+28.3%"
            glow="emerald"
            icon={TrendingUp}
          />
          <StatCard
            title="Unrealised PnL"
            value="-$1,250"
            change="-2.1%"
            glow="red"
            icon={TrendingUp}
          />
          <StatCard
            title="Win Rate"
            value="68.4%"
            change="+4.2%"
            glow="cyan"
            icon={Users}
          />
        </div>

        {/* Panels */}
        <div className="mt-20 grid lg:grid-cols-2 gap-8">
          <TradeHistory />
          <Leaderboards />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  title,
  value,
  change,
  glow,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  glow: "emerald" | "red" | "cyan";
  icon: any;
}) => {
  const glowMap = {
    emerald: "text-emerald-400 ring-emerald-500/20",
    red: "text-red-400 ring-red-500/20",
    cyan: "text-cyan-400 ring-cyan-500/20",
  };
  const isPositive = change.startsWith("+");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative group rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/70 via-neutral-900/20 to-neutral-950/50 p-6 backdrop-blur-xl ring-1 ring-neutral-800/50 hover:ring-neutral-700/50 transition-all duration-300 overflow-hidden ${glowMap[glow]}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
      
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${glowMap[glow]} flex items-center justify-center mb-4 shadow-lg`}>
        <Icon className="w-5 h-5" />
      </div>
      
      <p className="text-sm text-neutral-400 font-medium mb-1">{title}</p>
      <p className={`text-2xl md:text-3xl font-bold mb-2 ${glowMap[glow]}`}>
        {value}
      </p>
      <div className="flex items-center text-xs font-mono">
        <span className={`mr-1 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {change}
        </span>
        {isPositive ? (
          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
        ) : (
          <ArrowUpRight className="w-3 h-3 text-red-400 rotate-[-135deg]" />
        )}
      </div>
    </motion.div>
  );
};

const TradeHistory = () => {
  const trades = [
    { pair: "SOL / USDC", side: "long", pnl: "+1,470", time: "2m ago" },
    { pair: "RAY / USDC", side: "short", pnl: "-540", time: "15m ago" },
    { pair: "BONK / USDC", side: "long", pnl: "+700", time: "1h ago" },
    { pair: "ORCA / USDC", side: "long", pnl: "-650", time: "3h ago" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group rounded-3xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/60 via-neutral-900/30 to-neutral-950/40 p-8 backdrop-blur-2xl shadow-2xl hover:shadow-emerald/10 transition-all duration-500 overflow-hidden relative"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-800/50">
        <DollarSign className="w-5 h-5 text-emerald-400" />
        <h3 className="text-xl font-semibold bg-gradient-to-r from-neutral-200 to-neutral-300 bg-clip-text text-transparent">
          Recent Trades
        </h3>
      </div>

      {/* Trades List */}
      <div className="space-y-4">
        {trades.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`group/trade p-4 rounded-2xl border border-neutral-800/50 hover:border-neutral-700/50 bg-neutral-900/30 backdrop-blur-xl hover:bg-neutral-900/50 transition-all duration-300 cursor-pointer overflow-hidden`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                <span className="font-mono text-sm text-neutral-300">{t.pair}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-mono font-semibold ${
                t.side === "long" 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                {t.side.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">{t.time}</span>
              <span className={`text-lg font-bold font-mono ${
                t.pnl.startsWith("+") ? "text-emerald-400" : "text-red-400"
              }`}>
                {t.pnl}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Leaderboards = () => {
    const rows = [
        { rank: 1, name: "CryptoAce", pnl: "+$25,400", change: "+340" },
        { rank: 2, name: "SolanaKing", pnl: "+$18,750", change: "+280" },
        { rank: 3, name: "LunaTrader", pnl: "+$15,200", change: "+210" },
        { rank: 4, name: "DeFiGuru", pnl: "+$12,680", change: "+180" },
        { rank: 5, name: "RayRider", pnl: "+$11,250", change: "+160" },
        ];
      

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group rounded-3xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/60 via-neutral-900/30 to-neutral-950/40 p-8 backdrop-blur-2xl shadow-2xl hover:shadow-yellow/20 transition-all duration-500 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-800/50">
        <Crown className="w-5 h-5 text-yellow-400" />
        <h3 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Top Traders
        </h3>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {rows.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`group/item flex items-center gap-4 p-4 rounded-2xl border border-neutral-800/50 hover:border-emerald-500/30 bg-neutral-900/30 backdrop-blur-xl hover:bg-gradient-to-r hover:from-emerald-500/5 hover:to-yellow-500/5 transition-all duration-300 cursor-pointer relative overflow-hidden`}
          >
            {/* Rank Badge */}
            <div
  className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
    r.rank === 1
      ? "bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 text-black shadow-2xl shadow-yellow-500/30"
      : r.rank === 2
      ? "bg-gradient-to-br from-zinc-200 via-slate-300 to-slate-500 text-black shadow-xl shadow-slate-400/30"
      : r.rank === 3
      ? "bg-gradient-to-br from-amber-700 via-orange-800 to-neutral-900 text-white shadow-xl shadow-amber-800/30"
      : r.rank === 4
      ? "bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white shadow-lg shadow-indigo-700/25"
      : r.rank === 5
      ? "bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white shadow-lg shadow-emerald-700/25"
      : "bg-gradient-to-br from-neutral-700 to-neutral-900 text-white shadow-md"
  }`}
>
  #{r.rank}
</div>

            
            {/* Name & Stats */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-200 truncate">{r.name}</p>
              <p className="flex items-center gap-2 text-sm text-neutral-400">
                <span className="text-emerald-400 font-mono font-bold">{r.pnl}</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                  {r.change}
                </span>
              </p>
            </div>
            
            {/* Arrow */}
            <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover/item:translate-x-1 transition-transform" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
