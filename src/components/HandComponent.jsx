import React, { useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardComponent from './CardComponent';
import { calculateHandValue } from '../utils/blackjackUtils';

// eslint-disable-next-line react/display-name
const HandComponent = React.memo(({ hand, isDealer = false, hidden = false }) => {
  const score = useMemo(() => calculateHandValue(hand), [hand]);
  const handRef = useRef(null);
  const deckPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (handRef.current) {
      const rect = handRef.current.getBoundingClientRect();
      deckPositionRef.current = {
        x: window.innerWidth / 2 - rect.left - rect.width / 2,
        y: -rect.top + window.innerHeight / 2 - rect.height / 2
      };
    }
  }, []);

  return (
    <div ref={handRef}>
      <div className="flex flex-wrap justify-center">
        <AnimatePresence>
          {hand.map((card, index) => (
            <CardComponent
              key={`${card.suit}-${card.value}-${index}`}
              card={card}
              hidden={hidden && index === 1}
              isDealer={isDealer}
              index={index}
              deckPosition={deckPositionRef.current}
            />
          ))}
        </AnimatePresence>
      </div>
      {!hidden && <p className="text-white mt-2 text-center">{isDealer ? "Dealer's" : "Your"} Score: {score}</p>}
    </div>
  );
});

export default HandComponent;
