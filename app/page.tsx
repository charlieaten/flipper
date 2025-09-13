"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [userId] = useState("john.doe@example.com");
  const session = useQuery(api.sessions.getGameSession, { userId });
  const balance = useQuery(api.sessions.getBalance, { userId });
  // Game state
  const [betAmount, setBetAmount] = useState(100);
  const [selection, setSelection] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameResult, setGameResult] = useState<{
    side: "heads" | "tails";
    won: boolean;
  } | null>(null);
  const router = useRouter();
  const mutation = useMutation(api.game.flip);

  const flipCoin = async () => {
    if (!balance || betAmount > balance) {
      alert("Insufficient tokens!");
      return;
    }

    setIsFlipping(true);
    setGameResult(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await mutation({ userId, betAmount, selection });
      setGameResult(result);
    } catch (error) {
      console.error("Coin flip error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to process coin flip"
      );
    } finally {
      setIsFlipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Coin Flip Casino</h1>
              <p className="text-sm text-muted-foreground">Test your luck!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="/admin">Admin</a>
            </Button>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Token Balance</p>
              <p className="text-xl font-bold">
                {(balance || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Coin Flip Game */}
          <div className="text-center space-y-6">
            <div className="relative">
              <div
                className={`w-32 h-32 mx-auto rounded-full border-4 border-primary flex items-center justify-center overflow-hidden transition-transform duration-500 ${
                  isFlipping ? "animate-spin" : ""
                }`}
              >
                {isFlipping ? (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <span className="text-4xl font-bold text-yellow-900">
                      ?
                    </span>
                  </div>
                ) : gameResult ? (
                  <img
                    src={`/abstract-geometric-shapes.png?key=nn9wa&height=120&width=120&query=${
                      gameResult.side === "heads"
                        ? "gold coin heads side with eagle"
                        : "gold coin tails side with building"
                    }`}
                    alt={`Coin showing ${gameResult.side}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={`/abstract-geometric-shapes.png?key=preview&height=120&width=120&query=${
                      selection === "heads"
                        ? "gold coin heads side with eagle preview"
                        : "gold coin tails side with building preview"
                    }`}
                    alt={`Coin preview showing ${selection}`}
                    className="w-full h-full object-cover opacity-80"
                  />
                )}
              </div>
              {gameResult && (
                <div
                  className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                    gameResult.won ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {gameResult.won ? (
                    <TrendingUp className="w-4 h-4 text-white" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-white" />
                  )}
                </div>
              )}
            </div>

            {gameResult && (
              <div className="text-center">
                <p
                  className={`text-lg font-semibold ${
                    gameResult.won ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {gameResult.won
                    ? `You won ${betAmount} tokens!`
                    : `You lost ${betAmount} tokens!`}
                </p>
                <p className="text-sm text-muted-foreground">
                  The coin landed on {gameResult.side}
                </p>
              </div>
            )}
          </div>

          {/* Game Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Choose Your Side</h3>
              <div className="flex gap-4">
                <Button
                  variant={selection === "heads" ? "default" : "outline"}
                  onClick={() => setSelection("heads")}
                  className="flex-1"
                >
                  Heads
                </Button>
                <Button
                  variant={selection === "tails" ? "default" : "outline"}
                  onClick={() => setSelection("tails")}
                  className="flex-1"
                >
                  Tails
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Bet Amount</h3>
              <div className="flex gap-2">
                {[50, 100, 250, 500, 1000, 2500, 5000, 10000].map((amount) => (
                  <Button
                    key={amount}
                    variant={betAmount === amount ? "default" : "outline"}
                    onClick={() => setBetAmount(amount)}
                    size="sm"
                  >
                    {amount}
                  </Button>
                ))}
              </div>
              <input
                type="number"
                value={betAmount}
                onChange={(e) =>
                  setBetAmount(
                    Math.max(1, Number.parseInt(e.target.value) || 1)
                  )
                }
                className="w-full p-2 border rounded-lg"
                min="1"
                max={balance}
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={flipCoin}
                disabled={isFlipping || !balance || betAmount > balance}
                size="lg"
                className="flex-1"
              >
                {isFlipping ? "Flipping..." : `Flip Coin (${betAmount} tokens)`}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/topup")}
                size="lg"
              >
                Top Up
              </Button>
            </div>
          </div>

          {/* Game History */}
          {session && session.gameHistory.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Recent Games</h3>
              <div className="space-y-2">
                {session.gameHistory.map((game, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full overflow-hidden border">
                        <img
                          src={`/abstract-geometric-shapes.png?key=sv2w7&height=24&width=24&query=${
                            game.side === "heads"
                              ? "small gold coin heads"
                              : "small gold coin tails"
                          }`}
                          alt={game.side}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm capitalize">{game.side}</span>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        game.won ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {game.won ? "+" : "-"}
                      {game.bet}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
