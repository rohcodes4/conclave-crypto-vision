import React, { useState } from "react";
import {
  Wallet,
  Search,
  Loader2,
  Copy,
  Coins,
  BarChart3,
  Clock,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TokenBalance {
  token_address: string;
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
  usd_value?: number;
}

interface WalletReport {
  address: string;
  netWorth?: number;
  tokens: TokenBalance[];
  totalTokens: number;
  topTokenPct?: number;
}

const formatNumber = (n?: number) => {
  if (!n) return "N/A";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(2);
};

const WalletAnalysis: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<WalletReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = async () => {
    const addr = input.trim();
    if (!addr) {
      setError("Please enter a wallet address.");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setSubmitted(addr);

    try {
      const res = await fetch(
        `https://deep-index.moralis.io/api/v2/${addr}/erc20?chain=sol`,
        {
          headers: {
            "X-API-Key": import.meta.env.VITE_MORALIS_KEY,
          },
        }
      );

      if (!res.ok) {
        setError("Failed to fetch wallet data.");
        return;
      }

      const tokens: TokenBalance[] = await res.json();

      const netWorth =
        tokens.reduce((sum, t) => sum + (t.usd_value || 0), 0) || 0;

      const sorted = [...tokens].sort(
        (a, b) => (b.usd_value || 0) - (a.usd_value || 0)
      );

      const topTokenPct =
        netWorth > 0 && sorted[0]?.usd_value
          ? (sorted[0].usd_value / netWorth) * 100
          : undefined;

      setReport({
        address: addr,
        netWorth,
        tokens: sorted,
        totalTokens: tokens.length,
        topTokenPct,
      });
    } catch {
      setError("Network error while fetching wallet data.");
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    if (!submitted) return;
    navigator.clipboard.writeText(submitted);
    toast.success("Wallet address copied");
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      <div className="flex-1 flex flex-col items-center px-4 pt-24 pb-24">
        <div className="w-full flex flex-col items-center space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crypto-card bg-crypto-bg/60 text-xs uppercase tracking-wide">
              <Wallet className="h-3 w-3 text-crypto-accent" />
              <span>Wallet Intelligence Console</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black">
              <span className="text-crypto-accent font-pixel">
                Wallet Analysis
              </span>
            </h1>
            <p className="text-sm text-crypto-muted max-w-xl mx-auto">
              Inspect wallet holdings, concentration, and on-chain behavior.
            </p>
          </div>

          {/* Main Card */}
          <div
            className={cn(
              "w-full rounded-2xl border border-crypto-card bg-black/40 shadow-[0_0_60px_rgba(255,114,41,0.15)] backdrop-blur-md",
              report ? "max-w-[1400px]" : "max-w-2xl"
            )}
          >
            <div className="border-b border-crypto-card px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-crypto-muted">
                <BarChart3 className="h-4 w-4 text-crypto-accent" />
                <span>Wallet Risk Terminal</span>
              </div>
              {report && (
                <div className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 bg-crypto-success/10 text-crypto-success">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Analyzed</span>
                </div>
              )}
            </div>

            <div className="px-4 py-4 space-y-4">
              {/* Input */}
              <div className="flex flex-col gap-3">
                <label className="text-xs uppercase tracking-wide text-crypto-muted">
                  Wallet address
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-crypto-muted" />
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter wallet address..."
                      className="pl-9 bg-crypto-card border-crypto-card h-11"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSubmit()
                      }
                    />
                  </div>
                  <Button
                    className="h-11 px-5 bg-crypto-accent"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                </div>

                {submitted && (
                  <div className="flex items-center gap-2 text-[11px] text-crypto-muted">
                    <code className="bg-crypto-bg px-2 py-1 rounded border border-crypto-card truncate max-w-xs">
                      {submitted}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={copyAddress}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-crypto-danger/40 bg-crypto-danger/10 p-4 flex gap-3">
                  <AlertTriangle className="h-4 w-4 text-crypto-danger mt-0.5" />
                  <div className="text-sm">{error}</div>
                </div>
              )}

              {/* Report */}
              {report && (
                <div className="space-y-5">
                  {/* Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Metric title="Net Worth" value={`$${formatNumber(report.netWorth)}`} icon={Coins} />
                    <Metric title="Token Count" value={report.totalTokens} icon={BarChart3} />
                    <Metric
                      title="Top Token Share"
                      value={
                        report.topTokenPct
                          ? `${report.topTokenPct.toFixed(1)}%`
                          : "N/A"
                      }
                      icon={Clock}
                    />
                    <Metric
                      title="Concentration"
                      value={
                        report.topTokenPct && report.topTokenPct > 50
                          ? "High"
                          : "Moderate"
                      }
                      icon={AlertTriangle}
                    />
                  </div>

                  {/* Tokens */}
                  <div className="rounded-xl border border-crypto-card bg-crypto-bg/60 p-3">
                    <div className="text-xs uppercase tracking-wide text-crypto-muted mb-2">
                      Top Holdings
                    </div>
                    <div className="space-y-2 max-h-72 overflow-auto pr-1">
                      {report.tokens.slice(0, 10).map((t) => (
                        <div
                          key={t.token_address}
                          className="flex justify-between text-sm border-b border-crypto-card/50 pb-2"
                        >
                          <span>
                            {t.name || "Unknown"} ({t.symbol})
                          </span>
                          <span className="font-semibold">
                            ${formatNumber(t.usd_value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-crypto-muted text-center max-w-md mt-4">
            Wallet data is on-chain only and does not reflect off-chain activity.
          </div>
        </div>
      </div>
    </div>
  );
};

const Metric = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: any;
  icon: any;
}) => (
  <div className="rounded-xl bg-crypto-bg/60 border border-crypto-card p-3">
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-crypto-muted">
      <Icon className="h-3 w-3" />
      <span>{title}</span>
    </div>
    <div className="text-lg font-semibold mt-1">{value}</div>
  </div>
);

export default WalletAnalysis;
