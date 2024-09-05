import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { initializeDeck, dealCard, calculateHandValue } from '../utils/blackjackUtils';
import CardComponent from './CardComponent';
import DeckComponent from './DeckComponent';

const BlackjackGame = () => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState('betting'); // betting, dealing, playing, dealerTurn, gameOver
  const [playerBalance, setPlayerBalance] = useState(50);
  const [currentBet, setCurrentBet] = useState(0);
  const [message, setMessage] = useState('');
  const [dealerCardsHidden, setDealerCardsHidden] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('bg-green-900');
  const [wins, setWins] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    const newPlayerScore = calculateHandValue(playerHand);
    setPlayerScore(newPlayerScore);
    if (newPlayerScore === 21 && playerHand.length === 2) {
      setTimeout(() => endGame('playerBlackjack'), 500);
    } else if (newPlayerScore > 21) {
      setTimeout(() => endGame('playerBust'), 500);
    }
  }, [playerHand]);

  useEffect(() => {
    if (!dealerCardsHidden) {
      const newDealerScore = calculateHandValue(dealerHand);
      setDealerScore(newDealerScore);
      if (gameState === 'dealerTurn' && newDealerScore >= 17) {
        setTimeout(finishGame, 1000);
      }
    } else if (dealerHand.length > 0) {
      setDealerScore(calculateHandValue([dealerHand[0]]));
    }
  }, [dealerHand, dealerCardsHidden, gameState]);

  const startNewGame = () => {
    if (playerBalance === 0) {
      setMessage("Game over! You're out of money. Please restart the game.");
      return;
    }
    const newDeck = initializeDeck();
    setDeck(newDeck);
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('betting');
    setMessage('Place your bet!');
    setDealerCardsHidden(true);
    setPlayerScore(0);
    setDealerScore(0);
    setBackgroundColor('bg-green-900');
  };

  const placeBet = (amount) => {
    if (playerBalance >= amount) {
      setCurrentBet(amount);
      setPlayerBalance(playerBalance - amount);
      setGameState('dealing');
      dealInitialCards();
    } else {
      setMessage('Insufficient balance!');
    }
  };

  const dealInitialCards = async () => {
    const newDeck = [...deck];
    const newPlayerHand = [];
    const newDealerHand = [];

    // Deal first card to player
    newPlayerHand.push(dealCard(newDeck));
    setPlayerHand([...newPlayerHand]);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Deal first card to dealer
    newDealerHand.push(dealCard(newDeck));
    setDealerHand([...newDealerHand]);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Deal second card to player
    newPlayerHand.push(dealCard(newDeck));
    setPlayerHand([...newPlayerHand]);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Deal second card to dealer (face down)
    newDealerHand.push(dealCard(newDeck));
    setDealerHand([...newDealerHand]);

    setDeck(newDeck);
    setGameState('playing');
  };

  const hit = async () => {
    const newDeck = [...deck];
    const newCard = dealCard(newDeck);
    const newPlayerHand = [...playerHand, newCard];
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPlayerScore = calculateHandValue(newPlayerHand);
    if (newPlayerScore > 21) {
      endGame('playerBust');
    }
  };

  const stand = () => {
    setGameState('dealerTurn');
    setDealerCardsHidden(false);
    setTimeout(dealerPlay, 1000);
  };

  const dealerPlay = async () => {
    let newDealerHand = [...dealerHand];
    let newDeck = [...deck];

    while (calculateHandValue(newDealerHand) < 17) {
      const newCard = dealCard(newDeck);
      newDealerHand.push(newCard);
      setDealerHand([...newDealerHand]);
      setDeck(newDeck);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    finishGame();
  };

  const finishGame = () => {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (dealerValue > 21) {
      endGame('dealerBust');
    } else if (dealerValue > playerValue) {
      endGame('dealerWins');
    } else if (dealerValue < playerValue) {
      endGame('playerWins');
    } else {
      endGame('push');
    }
  };

  const endGame = (result) => {
    setGameState('gameOver');
    setDealerCardsHidden(false);
    let winnings = 0;
    switch (result) {
      case 'playerBlackjack':
        winnings = currentBet * 2.5;
        setMessage('Blackjack! You win!');
        setWins(wins + 1);
        triggerConfetti();
        break;
      case 'dealerBlackjack':
        setMessage('Dealer Blackjack! You lose.');
        setBackgroundColor('bg-red-900');
        break;
      case 'playerBust':
        setMessage('Bust! You lose.');
        setBackgroundColor('bg-red-900');
        break;
      case 'dealerBust':
        winnings = currentBet * 2;
        setMessage('Dealer busts! You win!');
        setWins(wins + 1);
        triggerConfetti();
        break;
      case 'playerWins':
        winnings = currentBet * 2;
        setMessage('You win!');
        setWins(wins + 1);
        triggerConfetti();
        break;
      case 'dealerWins':
        setMessage('Dealer wins. You lose.');
        setBackgroundColor('bg-red-900');
        break;
      case 'push':
        winnings = currentBet;
        setMessage('Push. Bet returned.');
        break;
    }
    setPlayerBalance(playerBalance + winnings);
    setCurrentBet(0);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className={`${backgroundColor} p-4 rounded-lg shadow-lg transition-colors duration-500`}>
      <div className="mb-4">
        <p className="text-white">Balance: ${playerBalance}</p>
        <p className="text-white">Current Bet: ${currentBet}</p>
        <p className="text-white">Wins: {wins}</p>
      </div>
      <Card className="mb-4 bg-green-800">
        <CardContent>
          <h2 className="text-lg font-bold mb-2 text-white">Dealer's Hand</h2>
          <div className="flex">
            <AnimatePresence>
              {dealerHand.map((card, index) => (
                <CardComponent
                  key={`dealer-${index}`}
                  card={card}
                  hidden={dealerCardsHidden && index === 1}
                  isDealer={true}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
          {gameState !== 'betting' && gameState !== 'dealing' && (
            <p className="text-white mt-2">Dealer's Score: {dealerScore}</p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-center mb-4">
        <DeckComponent cardsLeft={deck.length} />
      </div>
      <Card className="mb-4 bg-green-800">
        <CardContent>
          <h2 className="text-lg font-bold mb-2 text-white">Your Hand</h2>
          <div className="flex">
            <AnimatePresence>
              {playerHand.map((card, index) => (
                <CardComponent
                  key={`player-${index}`}
                  card={card}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
          {gameState !== 'betting' && gameState !== 'dealing' && (
            <p className="text-white mt-2">Your Score: {playerScore}</p>
          )}
        </CardContent>
      </Card>
      <div className="mb-4">
        {gameState === 'betting' && playerBalance > 0 && (
          <>
            <Button onClick={() => placeBet(10)} className="mr-2">Bet $10</Button>
            <Button onClick={() => placeBet(25)} className="mr-2">Bet $25</Button>
            <Button onClick={() => placeBet(50)}>Bet $50</Button>
          </>
        )}
        {gameState === 'playing' && (
          <>
            <Button onClick={hit} className="mr-2">Hit</Button>
            <Button onClick={stand}>Stand</Button>
          </>
        )}
        {(gameState === 'gameOver' || playerBalance === 0) && (
          <Button onClick={startNewGame}>
            {playerBalance === 0 ? "Restart Game" : "New Game"}
          </Button>
        )}
      </div>
      <div className="text-center text-xl font-bold text-white">{message}</div>
    </div>
  );
};

export default BlackjackGame;