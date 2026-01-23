import React from "react";
import { motion } from "framer-motion";

const FinalCTA: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 bg-black overflow-hidden">
      {/* Animated background flares */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#ff7229]/20 blur-[180px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/15 blur-[160px] animate-pulse-slow" />

      {/* Optional subtle floating circles */}
      <div className="absolute top-1/4 left-1/2 w-24 h-24 rounded-full bg-purple-500/10 blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/3 right-1/3 w-32 h-32 rounded-full bg-amber-400/10 blur-3xl animate-float-slow" />

      {/* Content */}
      <div className="relative max-w-3xl text-center space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl lg:text-6xl font-bold text-white leading-tight"
        >
          Build Skill Before You Risk Capital
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg lg:text-xl text-neutral-400"
        >
          Start paper trading on Solana with real market data and zero risk.
          Sharpen your strategy, track performance, and compete with other
          traders.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
        >
          <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl shadow-lg shadow-cyan-400/40 hover:scale-105 transition-transform duration-300">
            Start Paper Trading
          </button>

        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
