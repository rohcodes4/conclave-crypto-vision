
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Link as LinkIcon } from "lucide-react";
import { useTradeStore, TradeStatus } from "@/services/tradeService";
import { Link } from "react-router-dom";

const TRADES_PER_PAGE = 10;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const History = () => {
  const { trades } = useTradeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredTrades = activeTab === "all" 
    ? trades
    : trades.filter(trade => trade.type === activeTab);
    
  const totalPages = Math.ceil(filteredTrades.length / TRADES_PER_PAGE);
  const currentTrades = filteredTrades.slice(
    (currentPage - 1) * TRADES_PER_PAGE, 
    currentPage * TRADES_PER_PAGE
  );
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-2">Trade History</h1>        
      </div>

      <Card className="bg-crypto-card border-crypto-card overflow-hidden">
        <CardHeader>
          <CardTitle>Trading Activity</CardTitle>
        </CardHeader>
        <CardContent>
        
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="bg-crypto-bg mb-6">
              <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white" value="all">All Trades</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white" value="buy">Buys</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white" value="sell">Sells</TabsTrigger>
            </TabsList>
            
            {trades.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-crypto-muted mb-4">You haven't made any trades yet.</p>
                <Link to="/dashboard">
                  <Button variant="outline">Start Trading</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-crypto-muted border-b border-crypto-card">
                      <th className="pb-3 px-4">Type</th>
                      <th className="pb-3 px-4">Token</th>
                      <th className="pb-3 px-4">Price</th>
                      <th className="pb-3 px-4">Amount</th>
                      <th className="pb-3 px-4">Total</th>
                      <th className="pb-3 px-4">Date</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTrades.map((trade) => (
                      <tr key={trade.id} className="border-b border-crypto-card last:border-0">
                        <td className="py-4 px-4">
                          <span className={`py-1 px-3 rounded-full text-xs font-medium ${
                            trade.type === 'buy' ? 'bg-crypto-success/20 text-crypto-success' : 'bg-crypto-danger/20 text-crypto-danger'
                          }`}>
                            {trade.type === 'buy' ? 'BUY' : 'SELL'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Link to={`/token/${trade.token}`} className="hover:underline">
                            <div className="font-medium">{trade.name || trade.symbol}</div>
                            <div className="text-xs text-crypto-muted">{trade.symbol}</div>
                          </Link>
                        </td>
                        <td className="py-4 px-4">${trade.price.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <div className="font-mono">{trade.amount.toLocaleString()}</div>
                          <div className="text-xs text-crypto-muted">{trade.symbol}</div>
                        </td>
                        <td className="py-4 px-4 font-medium">${trade.total.toLocaleString()}</td>
                        <td className="py-4 px-4 text-crypto-muted whitespace-pre">{formatDate(trade.date)}</td>
                        <td className="py-4 px-4">
                          <span className={`text-xs py-1 px-2 rounded ${
                            trade.status === TradeStatus.COMPLETED 
                              ? 'bg-crypto-success/20 text-crypto-success' 
                              : trade.status === TradeStatus.PENDING 
                              ? 'bg-crypto-accent/20 text-crypto-accent'
                              : 'bg-crypto-danger/20 text-crypto-danger'
                          }`}>
                            {trade.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Link to={`/token/${trade.token}`}>
                            <Button variant="ghost" size="sm">
                              <LinkIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-crypto-muted">
                  Showing {(currentPage - 1) * TRADES_PER_PAGE + 1}-{Math.min(currentPage * TRADES_PER_PAGE, filteredTrades.length)} of {filteredTrades.length} trades
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
