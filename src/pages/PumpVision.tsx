
import React from "react";
import TokenGrid from "@/components/tokens/TokenGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePumpVisionTokens } from "@/services/solscanService";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PumpVision = () => {
  const { data, isLoading, error } = usePumpVisionTokens();

  if (isLoading) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a,black)]" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 border border-white/20 rounded-full animate-spin border-t-white mb-6" />
        <p className="text-white/60 text-sm tracking-widest uppercase">Loading</p>
      </div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* <div>
          <h1 className="text-3xl font-bold mb-2">Pump Vision</h1>
          <p className="text-crypto-muted">Early detection of potentially high-growth tokens</p>
        </div> */}
        
        <Card className="bg-crypto-card border-crypto-card">
          <CardContent className="flex justify-center items-center p-6">
            <p className="text-crypto-muted">Error loading pump vision data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { aboutToMigrate, migrated } = data || { aboutToMigrate: [], migrated: [] };
  // const { newTokens, aboutToMigrate, migrated } = data || { newTokens: [], aboutToMigrate: [], migrated: [] };

  return (
    <div className="space-y-6">
      {/* <div>
        <h1 className="text-xl font-semibold mb-2">Pump Vision</h1>        
      </div> */}
      
      {/* <div className="bg-gradient-to-r from-crypto-accent/20 to-crypto-highlight/20 p-4 rounded-lg border border-crypto-accent/30">
        <h3 className="font-medium mb-1">How Pump Vision Works</h3>
        <p className="text-sm">
          Our algorithm analyzes on-chain data to identify tokens with high growth potential at different stages:
          New (just deployed), About to Migrate (preparing for V2 launch), and Migrated (recently upgraded).
        </p>
      </div> */}
      {isLoading?<div className="relative flex items-center justify-center h-screen bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a,black)]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border border-white/20 rounded-full animate-spin border-t-white mb-6" />
          <p className="text-white/60 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>:
           <Tabs defaultValue="migrating">
           <TabsList className="bg-crypto-bg">
             {/* <TabsTrigger value="new">New</TabsTrigger> */}
             <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white data-[state=active]:border-crypto-border border border-white rounded-lg mr-2" value="migrating">About To Migrate</TabsTrigger>
             <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white data-[state=active]:border-crypto-border border border-white rounded-lg" value="migrated">Migrated</TabsTrigger>
           </TabsList>
           {/* <TabsContent value="new">
             <TokenGrid tokens={newTokens} title="Newly Deployed Contracts" />
           </TabsContent> */}
           <TabsContent value="migrating">
             <TokenGrid tokens={aboutToMigrate} title={null} isLoading={false} shouldCreateHasMoreData={true}/>
           </TabsContent>
           <TabsContent value="migrated">
             <TokenGrid tokens={migrated} title={null} isLoading={false} shouldCreateHasMoreData={true}/>
           </TabsContent>
         </Tabs>}
      
    </div>
  );
};

export default PumpVision;
