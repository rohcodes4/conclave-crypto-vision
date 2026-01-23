import { motion } from "framer-motion";

export const FinalCTA = () => {
  return (
    <section className="py-28 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-semibold">
          Build Skill Before You Risk Capital
        </h2>

        <button className="mt-8 px-8 py-4 rounded-lg bg-emerald-500 text-black font-medium shadow-[0_0_40px_rgba(52,211,153,0.3)] hover:bg-emerald-400 transition">
          Start Paper Trading on Solana
        </button>
      </motion.div>
    </section>
  );
};
