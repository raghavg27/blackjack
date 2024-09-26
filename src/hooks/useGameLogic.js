import { useState, useCallback, useMemo } from 'react';
import { initializeDeck, dealCard, calculateHandValue, canSplit, canDoubleDown } from '../utils/blackjackUtils';
import { toast } from "sonner";
import confetti from 'canvas-confetti';

const INITIAL_BALANCE = 1000;

const determineHandResult = (playerValue, dealerValue, isBlackjack) => {
  if (playerValue > 21) return 'bust';
  if (dealerValue > 21) return 'win';
  if (isBlackjack) return 'blackjack';
  if (playerValue > dealerValue) return 'win';
  if (playerValue < dealerValue) return 'lose';
  return 'push';
};

const calculateWinnings = (result, bet) => {
  switch (result) {
    case 'blackjack': return bet * 2.5;
    case 'win': return bet * 2;
    case 'push': return bet;
    default: return 0;
  }
};

const getResultMessage = (result) => {
  switch (result) {
    case 'blackjack': return 'Blackjack! You win!';
    case 'win': return 'You win!';
    case 'push': return "It's a draw!";
    case 'lose': return 'Dealer wins!';
    case 'bust': return 'Bust! You lose.';
    default: return '';
  }
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState({
    deck: initializeDeck(),
    playerHands: [[]],
    dealerHand: [],
    gamePhase: 'betting',
    playerBalance: INITIAL_BALANCE,
    currentBet: 0,
    message: 'Place your bet!',
    dealerCardsHidden: true,
    backgroundColor: 'bg-green-900',
    wins: 0,
    currentHandIndex: 0,
    topScore: INITIAL_BALANCE,
    canDoubleDown: false,
    canSplit: false,
  });

  const updateGameState = useCallback((newState) => {
    setGameState((prevState) => {
      const updatedState = { ...prevState, ...newState };
      if (updatedState.playerBalance > updatedState.topScore) {
        updatedState.topScore = updatedState.playerBalance;
      }
      return updatedState;
    });
  }, []);

  const startNewGame = useCallback(() => {
    if (gameState.playerBalance === 0) {
      updateGameState({
        message: "! You're out of money. Please restart the game.",
        gamePhase: 'gameOver',
        playerBalance: INITIAL_BALANCE,
      });
      return;
    }
    updateGameState({
      deck: initializeDeck(),
      playerHands: [[]],
      dealerHand: [],
      gamePhase: 'betting',
      message: 'Place your bet!',
      dealerCardsHidden: true,
      backgroundColor: 'bg-green-900',
      currentHandIndex: 0,
      currentBet: 0,
    });
  }, [gameState.playerBalance, updateGameState]);

  const placeBet = useCallback((amount) => {
    if (gameState.playerBalance >= amount) {
      updateGameState({
        currentBet: amount,
        playerBalance: gameState.playerBalance - amount,
        gamePhase: 'dealing',
      });
      dealInitialCards();
    } else {
      toast.error('Insufficient balance!');
    }
  }, [gameState.playerBalance, updateGameState]);

  const dealInitialCards = useCallback(() => {
    const newDeck = [...gameState.deck];
    const newPlayerHand = [dealCard(newDeck), dealCard(newDeck)];
    const newDealerHand = [dealCard(newDeck), dealCard(newDeck)];
    updateGameState({
      playerHands: [newPlayerHand],
      dealerHand: newDealerHand,
      deck: newDeck,
      gamePhase: 'playing',
      canDoubleDown: canDoubleDown(newPlayerHand),
      canSplit: canSplit(newPlayerHand),
    });
  }, [gameState.deck, updateGameState]);

  const hit = useCallback(() => {
    const newDeck = [...gameState.deck];
    const newCard = dealCard(newDeck);
    const newPlayerHands = [...gameState.playerHands];
    newPlayerHands[gameState.currentHandIndex].push(newCard);
    
    const handValue = calculateHandValue(newPlayerHands[gameState.currentHandIndex]);
    if (handValue > 21) {
      if (gameState.currentHandIndex < gameState.playerHands.length - 1) {
        updateGameState({
          playerHands: newPlayerHands,
          deck: newDeck,
          currentHandIndex: gameState.currentHandIndex + 1,
          canDoubleDown: false,
          canSplit: false,
        });
      } else {
        updateGameState({
          playerHands: newPlayerHands,
          deck: newDeck,
          gamePhase: 'dealerTurn',
          dealerCardsHidden: false,
          canDoubleDown: false,
          canSplit: false,
        });
        dealerPlay();
      }
    } else {
      updateGameState({
        playerHands: newPlayerHands,
        deck: newDeck,
        canDoubleDown: false,
        canSplit: false,
      });
    }
  }, [gameState.deck, gameState.playerHands, gameState.currentHandIndex, updateGameState]);

  const stand = useCallback(() => {
    if (gameState.currentHandIndex < gameState.playerHands.length - 1) {
      updateGameState({
        currentHandIndex: gameState.currentHandIndex + 1,
        canDoubleDown: canDoubleDown(gameState.playerHands[gameState.currentHandIndex + 1]),
        canSplit: canSplit(gameState.playerHands[gameState.currentHandIndex + 1]),
      });
    } else {
      updateGameState({
        gamePhase: 'dealerTurn',
        dealerCardsHidden: false,
      });
      dealerPlay();
    }
  }, [gameState.currentHandIndex, gameState.playerHands, updateGameState]);

  const doubleDown = useCallback(() => {
    if (gameState.playerBalance >= gameState.currentBet) {
      updateGameState({
        playerBalance: gameState.playerBalance - gameState.currentBet,
        currentBet: gameState.currentBet * 2,
      });
      hit();
      stand();
    } else {
      toast.error('Insufficient balance for double down!');
    }
  }, [gameState.playerBalance, gameState.currentBet, hit, stand, updateGameState]);

  const split = useCallback(() => {
    if (gameState.playerBalance >= gameState.currentBet) {
      const newPlayerHands = [...gameState.playerHands];
      const splitHand = [newPlayerHands[gameState.currentHandIndex].pop()];
      newPlayerHands.push(splitHand);
      updateGameState({
        playerHands: newPlayerHands,
        playerBalance: gameState.playerBalance - gameState.currentBet,
        canSplit: false,
      });
      hit();
    } else {
      toast.error('Insufficient balance for split!');
    }
  }, [gameState.playerBalance, gameState.currentBet, gameState.playerHands, gameState.currentHandIndex, hit, updateGameState]);

  const dealerPlay = useCallback(async () => {
    let newDealerHand = [...gameState.dealerHand];
    let newDeck = [...gameState.deck];

    while (calculateHandValue(newDealerHand) < 17) {
      const newCard = dealCard(newDeck);
      newDealerHand.push(newCard);
      updateGameState({
        dealerHand: newDealerHand,
        deck: newDeck,
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    endGame();
  }, [gameState.dealerHand, gameState.deck, updateGameState]);

  const endGame = useCallback(() => {
    let totalWinnings = 0;
    let finalResult = '';
    const dealerValue = calculateHandValue(gameState.dealerHand);

    gameState.playerHands.forEach((hand) => {
      const playerValue = calculateHandValue(hand);
      const isBlackjack = playerValue === 21 && hand.length === 2;
      const result = determineHandResult(playerValue, dealerValue, isBlackjack);
      totalWinnings += calculateWinnings(result, gameState.currentBet);
      finalResult = result; // For simplicity, we'll use the last hand's result
    });

    const resultMessage = getResultMessage(finalResult);
    const newBalance = gameState.playerBalance + totalWinnings;

    updateGameState({
      playerBalance: newBalance,
      message: resultMessage,
      backgroundColor: totalWinnings > gameState.currentBet ? 'bg-green-900' : 'bg-red-900',
      gamePhase: 'gameOver',
      currentBet: 0,
      wins: gameState.wins + (totalWinnings > gameState.currentBet ? 1 : 0),
    });

    if (totalWinnings > gameState.currentBet) triggerConfetti();
  }, [gameState.playerHands, gameState.dealerHand, gameState.currentBet, gameState.playerBalance, gameState.wins, updateGameState]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return useMemo(() => ({
    gameState,
    startNewGame,
    placeBet,
    hit,
    stand,
    doubleDown,
    split,
  }), [gameState, startNewGame, placeBet, hit, stand, doubleDown, split]);
};
