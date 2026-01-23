
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pump Vision</h1>
          <p className="text-crypto-muted">Early detection of potentially high-growth tokens</p>
        </div>
        <div className="flex flex-col items-center justify-center h-screen bg-crypto-bg">
             <div className="w-16 h-16 border-4 border-crypto-accent border-t-transparent rounded-full animate-spin mb-8"></div>
             <p className="text-crypto-muted">Loading...</p>
           </div>
        
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pump Vision</h1>
          <p className="text-crypto-muted">Early detection of potentially high-growth tokens</p>
        </div>
        
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
      <div>
        <h1 className="text-xl font-semibold mb-2">Pump Vision</h1>        
      </div>
      
      {/* <div className="bg-gradient-to-r from-crypto-accent/20 to-crypto-highlight/20 p-4 rounded-lg border border-crypto-accent/30">
        <h3 className="font-medium mb-1">How Pump Vision Works</h3>
        <p className="text-sm">
          Our algorithm analyzes on-chain data to identify tokens with high growth potential at different stages:
          New (just deployed), About to Migrate (preparing for V2 launch), and Migrated (recently upgraded).
        </p>
      </div> */}
      {isLoading?<div className="flex flex-col items-center justify-center h-screen bg-crypto-bg">
             <div className="w-16 h-16 border-4 border-crypto-accent border-t-transparent rounded-full animate-spin mb-8"></div>
             <p className="text-crypto-muted">Loading...</p>
           </div>:
           <Tabs defaultValue="migrating">
           <TabsList className="bg-crypto-bg mb-6">
             {/* <TabsTrigger value="new">New</TabsTrigger> */}
             <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white" value="migrating">About To Migrate</TabsTrigger>
             <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white" value="migrated">Migrated</TabsTrigger>
           </TabsList>
           {/* <TabsContent value="new">
             <TokenGrid tokens={newTokens} title="Newly Deployed Contracts" />
           </TabsContent> */}
           <TabsContent value="migrating">
             <TokenGrid tokens={aboutToMigrate} title="Preparing for Migration" isLoading={false} shouldCreateHasMoreData={true}/>
           </TabsContent>
           <TabsContent value="migrated">
             <TokenGrid tokens={migrated} title="Recently Migrated" isLoading={false} shouldCreateHasMoreData={true}/>
           </TabsContent>
         </Tabs>}
      
    </div>
  );
};

export default PumpVision;
