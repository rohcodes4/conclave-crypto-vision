import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';

export const RugChecker = () => {
  return (
    <section className="py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-full text-orange-400 text-sm font-medium mb-8 mx-auto w-fit">
            <ShieldAlert className="w-4 h-4" />
            Built-in Protection
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Rug Checker
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Analyze any token before trading. Get instant rug risk scores, contract analysis, and safety indicators.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-900/90 via-red-500/5 to-slate-950/50 border border-slate-800/50 rounded-4xl p-12 backdrop-blur-xl shadow-2xl"
        >
          {/* Risk Score Ring */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="relative">
              <div className="w-64 h-64 border-8 border-slate-900/50 rounded-full flex items-center justify-center relative">
                <div className="w-48 h-48 bg-slate-950/50 rounded-full border-4 border-slate-900 relative flex flex-col items-center justify-center p-8">
                  <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">87</div>
                  <div className="text-sm uppercase tracking-wider text-slate-500">Rug Risk Score</div>
                  
                  {/* Animated ring segments */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500/30 via-yellow-500/50 to-red-500/60 [clip-path:polygon(0%_0%,87%_0%,87%_100%,0%_100%)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Cards */}
            <div className="space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/70 border border-slate-800/50 p-6 rounded-2xl flex items-start gap-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-2">✅ Safety Indicators</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• Renounced ownership</li>
                      <li>• Locked liquidity</li>
                      <li>• Active development</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-slate-900/70 border border-slate-800/50 p-6 rounded-2xl flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-white mb-2">⚠️ Red Flags</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>• High dev holdings</li>
                      <li>• Recent large sells</li>
                      <li>• Low holder count</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-800/50">
                <p className="text-slate-500 text-sm mb-4">Smart contract fully analyzed</p>
                <div className="flex items-center gap-3 text-xs bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800/50">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-emerald-400">#Contract verified</span>
                  <span className="ml-auto font-mono text-slate-500">2m ago</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
