import { motion } from "framer-motion";
import {
  Wallet,
  Trophy,
  TrendingUp,
  Search,
  CandlestickChart,
  Layers
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Portfolio Tracking",
    desc: "Realised and unrealised PnL with full trade history."
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    desc: "Rank traders and compete based on performance."
  },
  {
    icon: TrendingUp,
    title: "Trending Tokens",
    desc: "Discover hot and newly launched Solana tokens."
  },
  {
    icon: Layers,
    title: "Pump.fun Tokens",
    desc: "Track migrated and soon-to-migrate Pump.fun tokens."
  },
  {
    icon: Search,
    title: "Token Search",
    desc: "Instantly search any token across Solana."
  },
  {
    icon: CandlestickChart,
    title: "Full Token Analytics",
    desc: "Charts, liquidity, holders, volume, and more."
  }
];

export const FeaturesGrid = () => {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 hover:border-emerald-500/40 transition"
          >
            <f.icon className="text-emerald-400 mb-4" />
            <h3 className="font-medium text-lg">{f.title}</h3>
            <p className="text-neutral-400 mt-2 text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
