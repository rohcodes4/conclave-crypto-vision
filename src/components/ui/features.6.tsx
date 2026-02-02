import { Cpu, Lock, Sparkles, Zap } from 'lucide-react'
import tokenDetailsImg from "@/assets/images/tokenDetails.png";
export function Features() {
    return (
        <section className="py-10 md:py-10 bg-black">
            <div className="mx-auto max-w-5xl space-y-12 px-6">
                <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-semibold">Explore, Analyze,<br/> and Trade<br/> any Solana Token</h2>
                    <p className="max-w-sm sm:ml-auto">Discover trending, new, and Pump.fun tokens across Solana.
                    Open a detailed token page to analyze market data and place simulated trades using live prices.</p>
                </div>
                <div className="relative rounded-3xl p-3 md:-mx-8 lg:col-span-3">
                    <div className="aspect-[88/36] relative">
                        <div className="bg-gradient-to-t z-1 from-background absolute inset-0 to-transparent"></div>
                        {/* <img src="https://tailark.com/_next/image?url=%2Fmail-upper.png&w=3840&q=75" className="absolute inset-0 z-10" alt="payments illustration dark" width={2797} height={1137} /> */}
                        <img src="https://tailark.com/_next/image?url=%2Fmail-back.png&w=3840&q=75" className="hidden dark:block" alt="payments illustration dark" width={2797} height={1137} />
                        <img src={tokenDetailsImg} className="dark:hidden border border-white/20 rounded-lg" alt="payments illustration light" width={2797} height={1137} />
                    </div>
                </div>
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            {/* <Zap className="size-4" /> */}
                            <h3 className="text-sm font-medium">Token Discovery</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Browse trending tokens, newly launched projects, and Pump.fun tokens as they move through early stages of their lifecycle.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            {/* <Cpu className="size-4" /> */}
                            <h3 className="text-sm font-medium">Instant Search</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Search any Solana token by name or address and open its full details instantly.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            {/* <Lock className="size-4" /> */}
                            <h3 className="text-sm font-medium">Full Token Page</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">View price charts, liquidity, volume, holder distribution, and other key metrics in one place.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            {/* <Sparkles className="size-4" /> */}

                            <h3 className="text-sm font-medium">Paper Buy & Sell</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">Execute simulated trades at live market prices and see the impact on your portfolio immediately.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
