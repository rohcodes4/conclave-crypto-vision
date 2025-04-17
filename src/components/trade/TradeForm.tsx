
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTradeStore } from "@/services/tradeService";
import { toast } from "sonner";
import { Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TradeFormProps {
  tokenId: string;
  tokenName: string;
  tokenSymbol: string;
  currentPrice: number;
}

const TradeForm = ({ tokenId, tokenName, tokenSymbol, currentPrice }: TradeFormProps) => {
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);
  const [holding, setHolding] = useState({
    amount: 0,
currentPrice: 0,
id: "",
name: "",
price: 0,
symbol: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { balance, holdings, executeTrade, updateBalance } = useTradeStore();
  console.log("holdings")
  console.log(holdings)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    // Calculate the total with current price
    const numValue = parseFloat(value) || 0;
    const calculatedTotal = numValue * currentPrice;
    setTotal(calculatedTotal);
  };
  
  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTotal(parseFloat(value) || 0);
    
    // Calculate the amount based on the total
    if (currentPrice > 0) {
      const calculatedAmount = (parseFloat(value) || 0) / currentPrice;
      setAmount(calculatedAmount.toString());
    }
  };
  
  const handleMaxClick = () => {
    // For buy, use max amount possible with current balance
    if (currentPrice > 0) {
      const maxAmount = balance / currentPrice;
      setAmount(maxAmount.toFixed(6));
      setTotal(balance);
    }
  };

  const handlePercentClick = (percentage: number) => {
    if (currentPrice > 0) {
      const holding = holdings.find(h => h.id === tokenId);
      const tokenAmount = holding.amount * (percentage / 100);
      const total = tokenAmount * currentPrice; // USD
      setAmount(tokenAmount);
      setTotal(total);
    }
  };

  const options = [25, 50, 75, 100];



  const handleMaxSellClick = () => {
    const holding = holdings.find(h => h.id === tokenId);
    if (holding) {
      setAmount(holding.amount.toString());
      setTotal(holding.amount * currentPrice);
    } else {
      toast.error("You don't own any of this token");
    }
  };
  
  const handleTrade = async (type: 'buy' | 'sell') => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await executeTrade({
        type,
        token: tokenId,
        symbol: tokenSymbol,
        amount: parseFloat(amount),
        price: currentPrice,
        total: total,
      });
      
      // Reset form after successful trade
      setAmount("");
      setTotal(0);
    } catch (error) {
      console.error("Trade failed:", error);
      // Error is already handled in executeTrade via toast
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateBalance = async () => {
    if (!newBalance || parseFloat(newBalance) < 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await updateBalance(parseFloat(newBalance));
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to update balance:", error);
    }
  };

  useEffect(()=>{
    const holding = holdings.find(h => h.id === tokenId);
    setHolding(holding)
  },[holdings])
  
  useEffect(() => {
    // Update any existing holdings with the current price
    useTradeStore.getState().updateHoldingPrice(tokenId, currentPrice);
  }, [currentPrice, tokenId]);

  return (
    <Card className="bg-crypto-card border-crypto-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Trade {tokenSymbol}</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              <span className="font-medium">${balance.toLocaleString()}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-crypto-card border-crypto-card">
            <DialogHeader>
              <DialogTitle>Update Balance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newBalance">New Balance (USD)</Label>
                <Input 
                  id="newBalance"
                  value={newBalance} 
                  onChange={(e) => setNewBalance(e.target.value)}
                  type="number"
                  min="0"
                  step="1000"
                  className="bg-crypto-bg border-crypto-card"
                  placeholder="Enter new balance amount"
                />
              </div>
              <Button 
                onClick={handleUpdateBalance} 
                className="w-full bg-crypto-accent hover:bg-crypto-highlight"
              >
                Update Balance
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-crypto-bg">
            <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white" value="buy">Buy</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-crypto-border data-[state=active]:text-white" value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy" className="pt-4">
            <div className="space-y-4">
              <div className="text-sm text-crypto-muted flex justify-between mb-2">
                <span>Balance:</span>
                <span>${balance.toLocaleString()} USD</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="buyAmount">Amount</Label>
                  <button 
                    onClick={handleMaxClick}
                    className="text-xs text-crypto-accent hover:text-crypto-highlight"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex rounded-md overflow-hidden">
                  <Input
                    id="buyAmount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    className="rounded-r-none bg-crypto-bg border-crypto-card"
                  />
                  <div className="flex items-center justify-center bg-crypto-bg px-3 border-l border-crypto-card">
                    {tokenSymbol}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyTotal">Total</Label>
                <div className="flex rounded-md overflow-hidden">
                  <Input
                    id="buyTotal"
                    type="number"
                    value={total.toString()}
                    onChange={handleTotalChange}
                    className="rounded-r-none bg-crypto-bg border-crypto-card"
                  />
                  <div className="flex items-center justify-center bg-crypto-bg px-3 border-l border-crypto-card">
                    USD
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-crypto-muted flex justify-between">
                <span>Token Price:</span>
                <span>${currentPrice.toLocaleString()} USD</span>
              </div>
            </div>
            <Button 
              className="w-full mt-6 bg-crypto-success hover:bg-crypto-success/90"
              onClick={() => handleTrade('buy')}
              disabled={isProcessing || total <= 0 || total > balance}
            >
              {isProcessing ? "Processing..." : `Buy ${tokenSymbol}`}
            </Button>
          </TabsContent>
          <TabsContent value="sell" className="pt-4">
            <div className="space-y-4">
              <div className="text-sm text-crypto-muted flex justify-between mb-2">
                <span>Holdings:</span>
                {(() => {
                  const holding = holdings.find(h => h.id === tokenId);
                  return (
                    <span>
                      {holding ? `${holding.amount.toLocaleString()} ${tokenSymbol}` : `0 ${tokenSymbol}`}
                    </span>
                  );
                })()}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sellAmount">Amount</Label>
                  {holding?.amount!=undefined && holding.amount>0 && <div className="flex gap-6">{options.map((option)=>{
                    return(
                      <button 
                      onClick={()=>handlePercentClick(option)}
                      className="text-xs text-crypto-accent hover:text-crypto-highlight"
                    >
                      {option}%
                    </button>    
                    )
                  })}
                  </div>}
                  {/* <button 
                    onClick={handleMaxSellClick}
                    className="text-xs text-crypto-accent hover:text-crypto-highlight"
                  >
                    MAX
                  </button> */}
                </div>
                <div className="flex rounded-md overflow-hidden">
                  <Input
                    id="sellAmount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    className="rounded-r-none bg-crypto-bg border-crypto-card"
                  />
                  <div className="flex items-center justify-center bg-crypto-bg px-3 border-l border-crypto-card">
                    {tokenSymbol}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellTotal">Total</Label>
                <div className="flex rounded-md overflow-hidden">
                  <Input
                    id="sellTotal"
                    type="number"
                    value={total.toString()}
                    onChange={handleTotalChange}
                    className="rounded-r-none bg-crypto-bg border-crypto-card"
                  />
                  <div className="flex items-center justify-center bg-crypto-bg px-3 border-l border-crypto-card">
                    USD
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-crypto-muted flex justify-between">
                <span>Token Price:</span>
                <span>${currentPrice.toLocaleString()} USD</span>
              </div>
            </div>
            <Button 
              className="w-full mt-6 bg-crypto-danger hover:bg-crypto-danger/90"
              onClick={() => handleTrade('sell')}
              disabled={isProcessing || total <= 0}
            >
              {isProcessing ? "Processing..." : `Sell ${tokenSymbol}`}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-crypto-muted">
        This is paper trading only. No real funds will be used.
      </CardFooter>
    </Card>
  );
};

export default TradeForm;
