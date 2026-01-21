// src/pages/RugCheck.tsx
import React, { useState } from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, Search, Loader2, Coins, Users, Landmark, Clock, Globe, Copy, Link2, BarChart3, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


interface RugcheckTopHolder {
  address: string;
  pct: number;
  uiAmount: number;
  owner: string;
}


interface RugcheckRisk {
  name: string;
  description: string;
  level: string;
}


interface RugcheckMarket {
  pubkey: string;
  marketType: string;
  lp?: {
    baseUSD?: number;
    lpLockedPct?: number;
    quoteUSD?: number;
    lpBurned?: number;
    lpTotalSupply?: number;
  };
}


interface RugcheckLaunchpad {
  name: string;
  platform: string;
}


interface RugcheckReport {
  mint: string;
  tokenMeta?: {
    name?: string;
    symbol?: string;
    uri?: string;
  };
  token?: {
    supply?: number;
    decimals?: number;
  };
  score?: number;
  score_normalised?: number;
  price?: number;
  totalHolders?: number;
  totalMarketLiquidity?: number;
  creator?: string;
  creatorBalance?: number;
  topHolders?: RugcheckTopHolder[];
  risks?: RugcheckRisk[];
  markets?: RugcheckMarket[];
  rugged: boolean;
  launchpad?: RugcheckLaunchpad;
}


const formatNumber = (num: number | undefined) => {
  if (num === undefined || num === 0) return "N/A";
  if (num >= 1_000_000_000_000) return `${(num / 1_000_000_000_000).toFixed(2)}T`;
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(8);
};


const formatCurrency = (num: number | undefined) => {
  if (!num || num === 0) return "N/A";
  return `$${formatNumber(num)}`;
};


const getRiskColor = (score?: number) => {
  if (!score) return "text-crypto-muted";
  if (score >= 800) return "text-crypto-success";
  if (score >= 500) return "text-yellow-400";
  return "text-crypto-danger";
};


const RugCheck: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<RugcheckReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedMint, setSubmittedMint] = useState<string | null>(null);


  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please enter a token address.");
      setReport(null);
      return;
    }


    setLoading(true);
    setError(null);
    setReport(null);
    setSubmittedMint(trimmed);


    try {
      const res = await fetch(
        `https://api.rugcheck.xyz/v1/tokens/${trimmed}/report`,
        { headers: { accept: "application/json" } }
      );
      if (!res.ok) {
        if (res.status === 404) {
          setError("Token not found. Please check the contract address.");
        } else {
          setError("Unable to fetch rugcheck data. Please try again.");
        }
        return;
      }
      const data: RugcheckReport = await res.json();
      setReport(data);
    } catch (e) {
      setError("Network error while fetching token data.");
    } finally {
      setLoading(false);
    }
  };


  const handleCopyMint = () => {
    if (!submittedMint) return;
    navigator.clipboard.writeText(submittedMint);
    toast.success("Token address copied");
  };


  const totalSupply =
    report?.token?.supply && report?.token?.decimals !== undefined
      ? report.token.supply / Math.pow(10, report.token.decimals)
      : undefined;


  return (
    <div className="min-h-screen flex flex-col text-white">
      <div className="flex-1 flex flex-col items-center px-4 pt-24 pb-24">
        <div className="flex flex-col items-center space-y-6 bg-black shadow-[0_0_60px_rgba(255,114,41,0.15)] w-full md:w-max px-4 py-10 md:p-20 rounded-[24px]">
          <div className="text-center space-y-3">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-crypto-card bg-crypto-bg/60 text-xs uppercase tracking-wide">
              <ShieldAlert className="h-3 w-3 text-crypto-accent" />
              <span>Rug Intelligence Console</span>
            </div> */}
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="text-crypto-accent font-pixel">Rug Check</span>
            </h1>
            <p className="text-sm md:text-base text-crypto-muted max-w-xl mx-auto">
              Paste a Solana token address to analyze holder distribution, liquidity, and rug risk in seconds.
            </p>
          </div>


          <div className={cn(
            "w-full rounded-2xl border-2 border-crypto-card bg-black/40 backdrop-blur-md transition-all duration-500 ease-in-out",
            report ? "max-w-[1400px]" : "max-w-2xl"
            )}>
            <div className="border-b-2 border-crypto-card px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-crypto-muted">
                <BarChart3 className="h-4 w-4 text-crypto-accent" />
                <span>Token Risk Terminal</span>
              </div>
              {report && (
                <div className={cn("text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1", report.rugged ? "bg-crypto-danger/10 text-crypto-danger" : "bg-crypto-success/10 text-crypto-success")}>
                  {report.rugged ? (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      <span>Rugged</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3 w-3" />
                      <span>Not Rugged</span>
                    </>
                  )}
                </div>
              )}
            </div>


            <div className="px-4 py-4 space-y-4">
              <div className="flex flex-col gap-3">
                <label className="text-xs uppercase tracking-wide text-crypto-muted">
                  Token address
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-crypto-muted" />
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter Solana contract address..."
                      className="pl-9 bg-crypto-card border-crypto-card h-11 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                    />
                  </div>
                  <Button
                    className="h-11 px-5 bg-crypto-accent hover:bg-crypto-accent/90 text-sm font-semibold"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SearchCheck className="h-4 w-4"/>
                    )}
                  </Button>
                </div>
                {submittedMint && (
                  <div className="flex items-center gap-2 text-[11px] text-crypto-muted">
                    <span className="uppercase tracking-wide">Current:</span>
                    <code className="bg-crypto-bg px-2 py-1 rounded-md text-[11px] max-w-[260px] md:max-w-[340px] truncate border border-crypto-card">
                      {submittedMint.slice(0, 6)}...{submittedMint.slice(-4)}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={handleCopyMint}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>


              {!report && !error && !loading && (
                <div className="mt-4 rounded-xl border border-dashed border-crypto-card/60 bg-crypto-bg/40 p-6 text-center space-y-3">
                  <p className="text-sm text-crypto-muted">
                    Enter a token address above and press Analyze to see a full rugcheck, liquidity and holders breakdown.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-[11px] text-crypto-muted">
                    <span className="px-2 py-1 rounded-full bg-crypto-card/60 border border-crypto-card">Holder distribution</span>
                    <span className="px-2 py-1 rounded-full bg-crypto-card/60 border border-crypto-card">LP lock status</span>
                    <span className="px-2 py-1 rounded-full bg-crypto-card/60 border border-crypto-card">Risk flags</span>
                  </div>
                </div>
              )}


              {error && (
                <div className="mt-4 rounded-xl border border-crypto-danger/40 bg-crypto-danger/10 p-4 flex items-start gap-3 text-sm">
                  <AlertTriangle className="h-4 w-4 text-crypto-danger mt-0.5" />
                  <div>
                    <div className="font-semibold text-crypto-danger">Analysis failed</div>
                    <div className="text-crypto-muted mt-1">{error}</div>
                  </div>
                </div>
              )}


              {report && (
                <div className="mt-4 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {report.tokenMeta?.uri && (
                        <img
                          src={report.tokenMeta.uri}
                          alt={report.tokenMeta?.name || "Token"}
                          className="w-12 h-12 rounded-full border-2 border-crypto-card bg-crypto-bg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="space-y-1">
                        <div className="text-xs uppercase tracking-wide text-crypto-muted">
                          Token
                        </div>
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <span>{report.tokenMeta?.name || "Unknown"}</span>
                          {report.tokenMeta?.symbol && (
                            <span className="text-crypto-muted text-sm">
                              ({report.tokenMeta.symbol})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between gap-3">
                      <div className="flex flex-col md:items-end text-xs">
                        <span className="uppercase tracking-wide text-crypto-muted">
                          RugCheck Score
                        </span>
                        <span className={cn("text-2xl font-black", getRiskColor(report.score))}>
                          {report.score_normalised? `${report.score_normalised}/100`: report.score ? `${report.score}/100`:"N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col items-end text-xs">
                        <span className="uppercase tracking-wide text-crypto-muted">
                          Raw
                        </span>
                        <span className="text-crypto-muted">
                          {report.score ? `${report.score}/1000` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="rounded-xl bg-crypto-bg/60 border border-crypto-card p-3 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] text-crypto-muted uppercase tracking-wide">
                        <Landmark className="h-3 w-3" />
                        <span>Market Cap</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {formatCurrency(report.price && totalSupply ? report.price * totalSupply : undefined)}
                      </div>
                      <div className="text-[11px] text-crypto-muted">
                        Price: {report.price ? `$${report.price.toFixed(8)}` : "N/A"}
                      </div>
                    </div>


                    <div className="rounded-xl bg-crypto-bg/60 border border-crypto-card p-3 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] text-crypto-muted uppercase tracking-wide">
                        <Coins className="h-3 w-3" />
                        <span>Liquidity</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {formatCurrency(report.totalMarketLiquidity)}
                      </div>
                      <div className="text-[11px] text-crypto-muted">
                        Across {report.markets?.length ?? 0} pools
                      </div>
                    </div>


                    <div className="rounded-xl bg-crypto-bg/60 border border-crypto-card p-3 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] text-crypto-muted uppercase tracking-wide">
                        <Users className="h-3 w-3" />
                        <span>Holders</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {(report.totalHolders ?? 0).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-crypto-muted">
                        Supply: {totalSupply ? formatNumber(totalSupply) : "N/A"}
                      </div>
                    </div>


                    <div className="rounded-xl bg-crypto-bg/60 border border-crypto-card p-3 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] text-crypto-muted uppercase tracking-wide">
                        <Globe className="h-3 w-3" />
                        <span>Launchpad</span>
                      </div>
                      <div className="text-lg font-semibold truncate">
                        {report.launchpad?.name || "Unknown"}
                      </div>
                      <div className="text-[11px] text-crypto-muted">
                        {report.launchpad?.platform || "N/A"}
                      </div>
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-crypto-muted">
                          <Coins className="h-4 w-4 text-crypto-accent" />
                          <span>Liquidity Pools ({report.markets?.length || 0})</span>
                        </div>
                      </div>
                      {report.markets && report.markets.length > 0 ? (
                        <div className="space-y-2">
                          {report.markets.map((market, index) => (
                            <div
                              key={market.pubkey}
                              className="rounded-lg border border-crypto-card bg-crypto-bg/80 px-3 py-3 space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">{market.marketType}</span>
                                    {market.lp?.lpLockedPct !== undefined && market.lp.lpLockedPct > 0 && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-crypto-success/10 text-crypto-success border border-crypto-success/20">
                                        {market.lp.lpLockedPct.toFixed(1)}% Locked
                                      </span>
                                    )}
                                    {market.lp?.lpBurned !== undefined && market.lp.lpBurned > 0 && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                        {market.lp.lpBurned.toFixed(1)}% Burned
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-crypto-muted font-mono">
                                    {market.pubkey.slice(0, 6)}...{market.pubkey.slice(-4)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-crypto-card/50">
                                <div>
                                  <div className="text-[10px] text-crypto-muted uppercase tracking-wide">Base USD</div>
                                  <div className="text-xs font-semibold">{formatCurrency(market.lp?.baseUSD)}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-crypto-muted uppercase tracking-wide">Quote USD</div>
                                  <div className="text-xs font-semibold">{formatCurrency(market.lp?.quoteUSD)}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-crypto-muted uppercase tracking-wide">Total Value</div>
                                  <div className="text-xs font-semibold">
                                    {formatCurrency((market.lp?.baseUSD || 0) + (market.lp?.quoteUSD || 0))}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-crypto-muted uppercase tracking-wide">LP Supply</div>
                                  <div className="text-xs font-semibold">
                                    {market.lp?.lpTotalSupply ? formatNumber(market.lp.lpTotalSupply) : "N/A"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-crypto-card bg-crypto-bg/70 px-3 py-3 text-xs text-crypto-muted">
                          No liquidity pool data available for this token.
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-crypto-muted">
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          <span>Risk Flags</span>
                        </div>
                        {/* <a
                          href={`https://rugcheck.xyz/tokens/${report.mint}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] inline-flex items-center gap-1 text-crypto-muted hover:text-crypto-accent"
                        >
                          <span>RugCheck</span>
                          <Link2 className="h-3 w-3" />
                        </a> */}
                      </div>
                      {report.risks && report.risks.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-auto pr-1">
                          {report.risks.map((risk, index) => (
                            <div
                              key={index}
                              className="rounded-lg border border-crypto-card bg-crypto-bg/80 px-3 py-2.5 flex items-start gap-2"
                            >
                              <div className="mt-0.5">
                                <AlertTriangle className="h-3 w-3 text-yellow-400" />
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs font-medium">{risk.name}</div>
                                <div className="text-[11px] text-crypto-muted leading-relaxed">
                                  {risk.description || "No description provided."}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-crypto-card bg-crypto-bg/70 px-3 py-3 text-xs text-crypto-muted">
                          No explicit risk flags reported for this token. Always DYOR.
                        </div>
                      )}
                      
                      <div className="rounded-lg border border-crypto-card bg-crypto-bg/80 px-3 py-3 space-y-2">
                        <div className="text-[11px] text-crypto-muted uppercase tracking-wide">
                          Creator Info
                        </div>
                        <div className="text-[11px] break-all bg-black/40 border border-crypto-card px-2 py-1 rounded font-mono">
                          {report.creator || "Unknown"}
                        </div>
                        <div className="text-[11px] text-crypto-muted">
                          Creator balance:{" "}
                          {report.creatorBalance
                            ? `${((report.creatorBalance / (report.token?.supply || 1)) * 100).toFixed(2)}%`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="rounded-xl border border-crypto-card bg-crypto-bg/60 px-3 py-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-crypto-muted">
                        <Users className="h-4 w-4" />
                        <span>Top Holders</span>
                      </div>
                    </div>
                    {report.topHolders && report.topHolders.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-auto pr-1">
                        {report.topHolders.slice(0, 10).map((h, index) => (
                          <div
                            key={h.address}
                            className="flex items-center justify-between gap-3 py-1.5 border-b border-crypto-card/60 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-crypto-accent/70 to-crypto-highlight/80 flex items-center justify-center text-[11px] font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <div className="text-xs font-medium">
                                  {h.address.slice(0, 6)}...{h.address.slice(-4)}
                                </div>
                                <div className="text-[11px] text-crypto-muted">
                                  Owner: {h.owner.slice(0, 6)}...{h.owner.slice(-4)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right text-[11px]">
                              <div className="font-semibold">
                                {(h.pct * 1).toFixed(2)}%
                              </div>
                              <div className="text-crypto-muted">
                                {h.uiAmount.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-crypto-muted">
                        No holder breakdown available for this token.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>


          <div className="text-[11px] text-crypto-muted text-center max-w-md mt-4">
            This tool should not be treated as financial advice. Always DYOR before trading.
          </div>
        </div>
      </div>
    </div>
  );
};


export default RugCheck;