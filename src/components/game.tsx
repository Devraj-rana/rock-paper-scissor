"use client";

import { useState, useMemo } from "react";
import { Hand, HandMetal, Scissors, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Move = "rock" | "paper" | "scissors";
type Outcome = "You Win!" | "You Lose!" | "It's a Draw!" | null;

const moves: { name: Move; icon: React.ElementType; color: string }[] = [
  { name: "rock", icon: HandMetal, color: "bg-primary text-primary-foreground hover:bg-primary/90" },
  { name: "paper", icon: Hand, color: "bg-yellow text-yellow-foreground hover:bg-yellow/90" },
  { name: "scissors", icon: Scissors, color: "bg-accent text-accent-foreground hover:bg-accent/90" },
];

const MoveDisplay = ({ move, isWinner }: { move: Move | null; isWinner: boolean }) => {
  const moveData = moves.find((m) => m.name === move);

  return (
    <div
      className={cn(
        "relative flex h-32 w-32 sm:h-48 sm:w-48 items-center justify-center rounded-full bg-background/70 shadow-inner transition-all duration-300",
        isWinner && "scale-110 shadow-lg",
        moveData?.color.split(' ')[0]
      )}
    >
       <div className="absolute inset-0 bg-background/30 rounded-full"></div>
      {moveData ? (
        <moveData.icon className={cn("h-16 w-16 sm:h-24 sm:w-24 transition-all", isWinner ? "text-white" : "text-foreground/80")} />
      ) : (
        <div className="h-16 w-16 sm:h-24 sm:w-24" />
      )}
    </div>
  );
};


export default function Game() {
  const [playerScore, setPlayerScore] = useState(0);
  const [appScore, setAppScore] = useState(0);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [appMove, setAppMove] = useState<Move | null>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [isChoosing, setIsChoosing] = useState(false);

  const winner = useMemo(() => {
    if (!playerMove || !appMove) return null;
    if (playerMove === appMove) return "draw";
    if (
      (playerMove === "rock" && appMove === "scissors") ||
      (playerMove === "scissors" && appMove === "paper") ||
      (playerMove === "paper" && appMove === "rock")
    ) {
      return "player";
    }
    return "app";
  }, [playerMove, appMove]);

  const handlePlay = (move: Move) => {
    if (isChoosing) return;

    setIsChoosing(true);
    setPlayerMove(move);
    setAppMove(null);
    setOutcome(null);

    setTimeout(() => {
      const appChoice = moves[Math.floor(Math.random() * moves.length)].name;
      setAppMove(appChoice);

      if (move === appChoice) {
        setOutcome("It's a Draw!");
      } else if (
        (move === "rock" && appChoice === "scissors") ||
        (move === "scissors" && appChoice === "paper") ||
        (move === "paper" && appChoice === "rock")
      ) {
        setOutcome("You Win!");
        setPlayerScore((prev) => prev + 1);
      } else {
        setOutcome("You Lose!");
        setAppScore((prev) => prev + 1);
      }
      
      setIsChoosing(false);
    }, 1200);
  };

  const resetGame = () => {
    setPlayerScore(0);
    setAppScore(0);
    setPlayerMove(null);
    setAppMove(null);
    setOutcome(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-body">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 font-headline">
          RPS Showdown
        </h1>

        <Card className="w-full max-w-sm mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Scoreboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around items-center text-2xl font-semibold">
              <div className="flex flex-col items-center">
                <span>Player</span>
                <span className="text-4xl text-primary">{playerScore}</span>
              </div>
              <span className="text-4xl">-</span>
              <div className="flex flex-col items-center">
                <span>App</span>
                <span className="text-4xl text-accent">{appScore}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="relative grid grid-cols-2 gap-4 md:gap-16 items-center justify-items-center w-full max-w-2xl mb-8">
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">You Chose</h2>
                <MoveDisplay move={playerMove} isWinner={winner === 'player'} />
            </div>
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold">App Chose</h2>
                {isChoosing && !appMove ? (
                    <div className="flex h-32 w-32 sm:h-48 sm:w-48 items-center justify-center rounded-full bg-background/70 shadow-inner">
                        <Loader2 className="h-16 w-16 sm:h-24 sm:w-24 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <MoveDisplay move={appMove} isWinner={winner === 'app'} />
                )}
            </div>
        </div>

        {outcome && (
          <div className="text-center mb-8 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-4xl sm:text-5xl font-bold"
              style={{
                color: outcome === "You Win!" ? 'hsl(var(--primary))' : outcome === "You Lose!" ? 'hsl(var(--accent))' : 'hsl(var(--foreground))'
              }}
            >
              {outcome}
            </h2>
          </div>
        )}

        {!playerMove || !isChoosing && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
              <p className="text-lg font-semibold">{outcome ? "Play again?" : "Make your move!"}</p>
              <div className="flex flex-wrap justify-center gap-4">
                  {moves.map((move) => (
                      <Button
                          key={move.name}
                          onClick={() => handlePlay(move.name)}
                          className={cn("h-20 w-20 sm:h-24 sm:w-24 rounded-full shadow-lg transform transition-transform hover:scale-105", move.color)}
                          disabled={isChoosing}
                          aria-label={move.name}
                      >
                          <move.icon className="h-10 w-10 sm:h-12 sm:w-12" />
                      </Button>
                  ))}
              </div>
          </div>
        )}

        <Button onClick={resetGame} variant="outline" className="mt-12 group">
          <RotateCcw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-[-90deg]" />
          Reset Score
        </Button>
      </div>
    </div>
  );
}
