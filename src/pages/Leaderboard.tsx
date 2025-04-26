import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client';

type AggregatedResult = {
  user_id: string
  token_id: string
  buyVolume: number
  sellVolume: number
  totalVolume: number
  pnlDollar: number
  pnlPercent: number
}

type Trade = {
  id: string
  user_id: string
  token_id: string
  type: string
  amount: number
  price: number
  total: number
  status: string
  created_at: string
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<AggregatedResult[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const limit = 20; // Number of top users to display
  const minTrades = 10;

  function aggregateTrades(trades: Trade[]): AggregatedResult[] {
    const userMap: Record<string, AggregatedResult> = {}

    // Group and sort trades by user
    const tradesByUser: Record<string, Trade[]> = {}
    for (const trade of trades) {
      if (!tradesByUser[trade.user_id]) tradesByUser[trade.user_id] = []
      tradesByUser[trade.user_id].push(trade)
    }

    for (const [userId, userTrades] of Object.entries(tradesByUser)) {
      if (userTrades.length < minTrades) continue;
      // Sort by time
      userTrades.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

      const buyQueue: { amount: number; price: number }[] = []
      let buyVolume = 0
      let sellVolume = 0
      let realisedPnl = 0

      for (const trade of userTrades) {
        const { type, amount, price, total } = trade

        if (type === 'buy') {
          buyQueue.push({ amount, price })
          buyVolume += total
        }

        if (type === 'sell') {
          sellVolume += total
          let sellAmount = amount

          while (sellAmount > 0 && buyQueue.length > 0) {
            const buy = buyQueue[0]
            const matchedAmount = Math.min(sellAmount, buy.amount)

            realisedPnl += (price - buy.price) * matchedAmount

            buy.amount -= matchedAmount
            sellAmount -= matchedAmount

            if (buy.amount === 0) buyQueue.shift()
          }
        }
      }

      const totalVolume = buyVolume + sellVolume
      const pnlPercent = buyVolume > 0 ? (realisedPnl / buyVolume) * 100 : 0

      userMap[userId] = {
        user_id: userId,
        token_id: '-', // we're aggregating across tokens
        buyVolume,
        sellVolume,
        totalVolume,
        pnlDollar: realisedPnl,
        pnlPercent,
      }
    }

    return Object.values(userMap).sort((a, b) => b.pnlDollar - a.pnlDollar)
  }

  useEffect(() => {
    const fetchAndCompute = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) setCurrentUserId(user.id)

      const { data: trades, error } = await supabase.from('trades').select('*')
      if (error) return console.error(error)

      const result = aggregateTrades(trades)
      const sorted = result.sort((a, b) => b.pnlDollar - a.pnlDollar)
      setLeaderboard(sorted)
    }

    fetchAndCompute()
  }, [])

  const topUsers = leaderboard.slice(0, limit)
  const currentUserIndex = leaderboard.findIndex((entry) => entry.user_id === currentUserId)

  function modifyString(input: string): string {
    if (input.length <= 8) {
      return input; // Return the string as is if it's less than or equal to 8 characters
    }
    
    const firstFour = input.slice(0, 3); // Get the first 4 characters
    const lastFour = input.slice(-3); // Get the last 4 characters
    
    return `${firstFour}...${lastFour}`; // Concatenate and return the result
  }

  return (
    <div className="p-4 pl-3">
      <h1 className="font-bold text-3xl font-bold mb-2">Leaderboard</h1>
      <p className="text-crypto-muted mb-8 ">See where you rank amongst others</p>
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-crypto-muted border-b border-crypto-card">
            <th className="pb-3 px-3">#</th>
            <th className="pb-3 px-3">User</th>
            <th className="pb-3 px-3">Buy Volume</th>
            <th className="pb-3 px-3">Sell Volume</th>
            <th className="pb-3 px-3">Total Volume</th>
            <th className="pb-3 px-3">PNL ($)</th>
            <th className="pb-3 px-3">PNL (%)</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((entry, index) => {
            const isCurrentUser = entry.user_id === currentUserId
            return (
              <tr
                key={entry.user_id}
                className={`border-b border-crypto-card last:border-0 ${
                  isCurrentUser ? 'bg-crypto-accent/10' : ''
                }`}
              >
                <td className="py-4 px-3 font-bold text-sm">{index + 1}</td>
                <td className="py-4 px-3 font-mono text-sm">
                  {isCurrentUser ? 'You' : modifyString(entry.user_id)}
                </td>
                <td className="py-4 px-3 font-medium">${entry.buyVolume.toLocaleString()}</td>
                <td className="py-4 px-3 font-medium">${entry.sellVolume.toLocaleString()}</td>
                <td className="py-4 px-3 font-medium">${entry.totalVolume.toLocaleString()}</td>
                <td className={`py-4 px-3 font-medium ${
                  entry.pnlDollar >= 0 ? 'text-crypto-success' : 'text-crypto-danger'
                }`}>
                  ${entry.pnlDollar.toFixed(2)}
                </td>
                <td className={`py-4 px-3 text-sm ${
                  entry.pnlPercent >= 0 ? 'text-crypto-success' : 'text-crypto-danger'
                }`}>
                  {entry.pnlPercent.toFixed(2)}%
                </td>
              </tr>
            )
          })}
          {currentUserIndex !== -1 && currentUserIndex >= limit && (
            <tr className="border-b border-crypto-card last:border-0">
              <td colSpan={7} className="text-center py-4">...</td>
            </tr>
          )}
          {currentUserIndex !== -1 && currentUserIndex >= limit && (
            <tr
              key={currentUserId}
              className="border-b border-crypto-card last:border-0 bg-crypto-accent/10"
            >
              <td className="py-4 px-3 font-bold text-sm">{currentUserIndex + 1}</td>
              <td className="py-4 px-3 font-mono text-sm">You</td>
              <td className="py-4 px-3 font-medium">${leaderboard[currentUserIndex].buyVolume.toLocaleString()}</td>
              <td className="py-4 px-3 font-medium">${leaderboard[currentUserIndex].sellVolume.toLocaleString()}</td>
              <td className="py-4 px-3 font-medium">${leaderboard[currentUserIndex].totalVolume.toLocaleString()}</td>
              <td className={`py-4 px-3 font-medium ${
                leaderboard[currentUserIndex].pnlDollar >= 0 ? 'text-crypto-success' : 'text-crypto-danger'
              }`}>
                ${leaderboard[currentUserIndex].pnlDollar.toFixed(2)}
              </td>
              <td className={`py-4 px-3 text-sm ${
                leaderboard[currentUserIndex].pnlPercent >= 0 ? 'text-crypto-success' : 'text-crypto-danger'
              }`}>
                {leaderboard[currentUserIndex].pnlPercent.toFixed(2)}%
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
