import { motion } from "framer-motion";

export const PortfolioSection = () => {
  return (
    <section className="py-28 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-semibold">
          Track Performance Like a Pro
        </h2>

        <p className="mt-4 text-neutral-400 max-w-2xl">
          Monitor balances, realised and unrealised PnL, and review every trade
          with precision.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-neutral-900/50 border border-neutral-800"
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};
