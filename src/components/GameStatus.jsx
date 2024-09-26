import React from 'react';

const GameStatus = ({ gameState }) => {
  return (
    <div className="mb-4 grid grid-cols-2 gap-2 text-sm sm:text-base">
      <p className="text-white">Balance: ${gameState.playerBalance}</p>
      <p className="text-white text-right">Current Bet: ${gameState.currentBet}</p>
      <p className="text-white">Wins: {gameState.wins}</p>
      <p className="text-white text-right">Top Score: ${gameState.topScore}</p>
    </div>
  );
};

export default GameStatus;
