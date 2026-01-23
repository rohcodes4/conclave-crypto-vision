import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-950 to-neutral-950" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl text-center"
      >
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          Trade Solana Tokens.
          <br />
          <span className="text-emerald-400">Learn Without Risk.</span>
        </h1>

        <p className="mt-6 text-neutral-400 text-lg max-w-2xl mx-auto">
          Paper trade real Solana tokens with live data, deep analytics,
          and zero capital.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button className="px-6 py-3 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition shadow-[0_0_30px_rgba(52,211,153,0.25)]">
            Start Paper Trading
          </button>

          <button className="px-6 py-3 rounded-lg border border-neutral-800 text-neutral-300 hover:border-neutral-600 transition flex items-center gap-2">
            Explore Features
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </section>
  );
};
