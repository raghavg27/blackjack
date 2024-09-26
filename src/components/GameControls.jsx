import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// eslint-disable-next-line react/display-name
const GameControls = React.memo(({ gameState, placeBet, hit, stand, doubleDown, split }) => {
  const [customBet, setCustomBet] = useState('');

  const handleCustomBet = useCallback(() => {
    const betAmount = parseInt(customBet);
    if (!betAmount || isNaN(betAmount)) {
      toast.error("Please enter a valid bet amount");
    } else if (betAmount <= 0) {
      toast.error("Bet amount must be greater than 0");
    } else if (betAmount > gameState.playerBalance) {
      toast.error("Insufficient balance for this bet");
    } else {
      placeBet(betAmount);
      setCustomBet('');
    }
  }, [customBet, gameState.playerBalance, placeBet]);

  if (gameState.gamePhase === 'betting' && gameState.playerBalance > 0) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={() => placeBet(50)} className="flex-grow">Bet $50</Button>
        <Button onClick={() => placeBet(75)} className="flex-grow">Bet $75</Button>
        <Button onClick={() => placeBet(100)} className="flex-grow">Bet $100</Button>
        <div className="flex w-full gap-2">
          <Input
            type="number"
            placeholder="$100"
            value={customBet}
            onChange={(e) => setCustomBet(e.target.value)}
            className="flex-grow text-black"
          />
          <Button onClick={handleCustomBet}>Place Custom Bet</Button>
        </div>
      </div>
    );
  }

  if (gameState.gamePhase === 'playing') {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={hit} className="flex-grow">Hit</Button>
        <Button onClick={stand} className="flex-grow">Stand</Button>
        {gameState.canDoubleDown && <Button onClick={doubleDown} className="flex-grow">Double Down</Button>}
        {gameState.canSplit && <Button onClick={split} className="flex-grow">Split</Button>}
      </div>
    );
  }

  return null;
});

export default GameControls;
