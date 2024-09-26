import React from 'react';
import { Link } from 'react-router-dom';

const GameRules = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-center">Blackjack Game Rules</h1>
      </header>
      <main className="flex-grow container mx-auto p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Objective</h2>
          <p className="mb-4">The goal of blackjack is to beat the dealer's hand without going over 21.</p>

          <h2 className="text-xl font-semibold mb-4">Card Values</h2>
          <ul className="list-disc list-inside mb-4">
            <li>Face cards (Jack, Queen, King) are worth 10 points.</li>
            <li>Aces are worth 1 or 11 points, whichever is more favorable to the hand.</li>
            <li>All other cards are worth their face value.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">Gameplay</h2>
          <ol className="list-decimal list-inside mb-4">
            <li>Place your bet before the hand begins.</li>
            <li>You and the dealer are each dealt two cards. One of the dealer's cards is face down (hidden).</li>
            <li>If your first two cards are an Ace and a 10-value card, you have a Blackjack and automatically win 1.5 times your bet, unless the dealer also has a Blackjack, resulting in a tie.</li>
            <li>You can choose to "Hit" to take another card, or "Stand" to keep your current hand.</li>
            <li>You can continue to Hit until you either decide to Stand or your hand goes over 21, which is a "Bust" and results in losing your bet.</li>
            <li>After you Stand, the dealer reveals their hidden card and must Hit on 16 or below and Stand on 17 or above.</li>
            <li>If the dealer Busts, you win. If neither Busts, the hand closest to 21 wins.</li>
          </ol>

          <h2 className="text-xl font-semibold mb-4">Additional Rules</h2>
          <ul className="list-disc list-inside mb-4">
            <li><strong>Double Down:</strong> You can double your bet and receive exactly one more card.</li>
            <li><strong>Split:</strong> If your first two cards have the same value, you can split them into two separate hands, each with its own bet.</li>
          </ul>

          <Link to="/" className="text-blue-400 hover:text-blue-300">Back to Game</Link>
        </div>
      </main>
    </div>
  );
};

export default GameRules;