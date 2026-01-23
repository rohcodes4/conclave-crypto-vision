import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Crown, DollarSign } from 'lucide-react';

export const PortfolioTracking = () => {
  return (
    <section className="py-32 px-4 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            Track Every Move
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Professional portfolio analytics with realised/unrealised PnL separation and competitive leaderboards.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Stats Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/50 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-sm text-center">
              <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500/40 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-emerald-400" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">$24,750</p>
              <p className="text-slate-400 uppercase text-xs tracking-wider">Portfolio Value</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/50 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-sm text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/25">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">+18.4%</p>
              <p className="text-slate-400 uppercase text-xs tracking-wider">Total PnL</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/50 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-sm text-center col-span-2">
              <div className="w-20 h-20 bg-purple-500/20 border-2 border-purple-500/40 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-2">#47</p>
              <p className="text-slate-400 uppercase text-xs tracking-wider">Global Rank</p>
            </div>
          </motion.div>

          {/* Trading terminal mock */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-slate-900/70 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <BarChart3 className="w-7 h-7" />
                Trade History
              </h3>
              <div className="space-y-4">
                {[
                  { token: 'PUMP/USDC', action: 'BUY', amount: '$1,250', pnl: '+12.4%' },
                  { token: 'BONK/SOL', action: 'SELL', amount: '$850', pnl: '+8.7%' },
                  { token: 'WIF/USDC', action: 'BUY', amount: '$2,100', pnl: '-3.2%' },
                ].map((trade, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl hover:bg-slate-900/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-emerald-400">{trade.token}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        trade.action === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.action}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg">{trade.amount}</div>
                      <div className={`text-sm font-bold ${
                        trade.pnl.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {trade.pnl}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
