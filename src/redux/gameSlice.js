import { createSlice } from '@reduxjs/toolkit';
import { initializeDeck, dealCard, calculateHandValue, canSplit, canDoubleDown } from '../utils/blackjackUtils';

const initialState = {
  deck: [],
  playerHands: [[]],
  dealerHand: [],
  gamePhase: 'betting',
  playerBalance: 100,
  currentBet: 0,
  message: 'Place your bet!',
  dealerCardsHidden: true,
  backgroundColor: 'bg-green-900',
  wins: 0,
  currentHandIndex: 0,
  topScore: 100,
  canDoubleDown: false,
  canSplit: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (state) => {
      state.deck = initializeDeck();
    },
    placeBet: (state, action) => {
      if (state.playerBalance >= action.payload) {
        state.currentBet = action.payload;
        state.playerBalance -= action.payload;
        state.gamePhase = 'dealing';
      }
    },
    dealInitialCards: (state) => {
      state.playerHands = [[dealCard(state.deck), dealCard(state.deck)]];
      state.dealerHand = [dealCard(state.deck), dealCard(state.deck)];
      state.gamePhase = 'playing';
      state.canDoubleDown = canDoubleDown(state.playerHands[0]);
      state.canSplit = canSplit(state.playerHands[0]);
    },
    hit: (state) => {
      const newCard = dealCard(state.deck);
      state.playerHands[state.currentHandIndex].push(newCard);
      const handValue = calculateHandValue(state.playerHands[state.currentHandIndex]);
      if (handValue > 21) {
        if (state.currentHandIndex < state.playerHands.length - 1) {
          state.currentHandIndex += 1;
        } else {
          state.gamePhase = 'dealerTurn';
          state.dealerCardsHidden = false;
        }
      }
      state.canDoubleDown = false;
      state.canSplit = false;
    },
    stand: (state) => {
      if (state.currentHandIndex < state.playerHands.length - 1) {
        state.currentHandIndex += 1;
        state.canDoubleDown = canDoubleDown(state.playerHands[state.currentHandIndex]);
        state.canSplit = canSplit(state.playerHands[state.currentHandIndex]);
      } else {
        state.gamePhase = 'dealerTurn';
        state.dealerCardsHidden = false;
      }
    },
    doubleDown: (state) => {
      if (state.playerBalance >= state.currentBet) {
        state.playerBalance -= state.currentBet;
        state.currentBet *= 2;
        const newCard = dealCard(state.deck);
        state.playerHands[state.currentHandIndex].push(newCard);
        state.gamePhase = 'dealerTurn';
        state.dealerCardsHidden = false;
      }
    },
    split: (state) => {
      if (state.playerBalance >= state.currentBet) {
        const newHand = [state.playerHands[state.currentHandIndex].pop()];
        state.playerHands.push(newHand);
        state.playerBalance -= state.currentBet;
        state.canSplit = false;
      }
    },
    dealerPlay: (state) => {
      while (calculateHandValue(state.dealerHand) < 17) {
        state.dealerHand.push(dealCard(state.deck));
      }
    },
    endGame: (state) => {
      const dealerValue = calculateHandValue(state.dealerHand);
      let totalWinnings = 0;
      let finalResult = '';

      state.playerHands.forEach((hand) => {
        const playerValue = calculateHandValue(hand);
        const isBlackjack = playerValue === 21 && hand.length === 2;
        let result = determineHandResult(playerValue, dealerValue, isBlackjack);
        totalWinnings += calculateWinnings(result, state.currentBet);
        finalResult = result;
      });

      state.playerBalance += totalWinnings;
      state.message = getResultMessage(finalResult);
      state.backgroundColor =
        totalWinnings === state.currentBet
          ? "bg-yellow-500"
          : totalWinnings > state.currentBet
          ? "bg-green-900"
          : "bg-red-900";
      state.gamePhase = 'gameOver';
      state.currentBet = 0;
      state.wins += totalWinnings > state.currentBet ? 1 : 0;
      if (state.playerBalance > state.topScore) {
        state.topScore = state.playerBalance;
      }
    },
    startNewGame: (state) => {
      return {
        ...initialState,
        playerBalance: state.playerBalance === 0 ? 1000 : state.playerBalance,
        wins: state.wins,
        topScore: state.topScore,
        deck: initializeDeck(),
      };
    },
  },
});

export const {
  initializeGame,
  placeBet,
  dealInitialCards,
  hit,
  stand,
  doubleDown,
  split,
  dealerPlay,
  endGame,
  startNewGame,
} = gameSlice.actions;

export default gameSlice.reducer;

function determineHandResult(playerValue, dealerValue, isBlackjack) {
  if (playerValue > 21) return 'bust';
  if (dealerValue > 21) return 'win';
  if (isBlackjack) return 'blackjack';
  if (playerValue > dealerValue) return 'win';
  if (playerValue < dealerValue) return 'lose';
  return 'push';
}

function calculateWinnings(result, bet) {
  switch (result) {
    case 'blackjack': return bet * 2.5;
    case 'win': return bet * 2;
    case 'push': return bet;
    default: return 0;
  }
}

function getResultMessage(result) {
  switch (result) {
    case 'blackjack': return 'Blackjack! ♠️♥️ You win! 🥳';
    case 'win': return 'You win! 😎';
    case 'push': return "Aw It's a draw! 😉";
    case 'lose': return 'Dealer wins! 🫢';
    case 'bust': return 'Bust! You lose. 😨';
    default: return '';
  }
}
