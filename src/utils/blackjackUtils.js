const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const initializeDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return shuffle(deck);
};

const shuffle = (deck) => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const dealCard = (deck) => {
  return deck.pop();
};

export const calculateHandValue = (hand) => {
  let value = 0;
  let aceCount = 0;

  for (let card of hand) {
    if (card.value === 'A') {
      aceCount++;
      value += 11;
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  }

  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  return value;
};

export const canSplit = (hand) => {
  return hand.length === 2 && hand[0].value === hand[1].value;
};

export const canDoubleDown = (hand) => {
  return hand.length === 2;
};

export const getCardValue = (card) => {
  if (['K', 'Q', 'J'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
};

// Debounce
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
