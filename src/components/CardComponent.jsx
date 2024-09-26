import React from 'react';
import { motion } from 'framer-motion';

const CardComponent = ({ card, hidden = false, isDealer = false, index = 0, deckPosition }) => {
  const suitColor = card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black';

  const variants = {
    hidden: { rotateY: 180, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md w-16 h-24 sm:w-24 sm:h-36 m-1 flex items-center justify-center ${hidden ? 'bg-blue-500' : ''}`}
      initial={{ 
        x: deckPosition ? deckPosition.x : -300, 
        y: deckPosition ? deckPosition.y : -200, 
        opacity: 0 
      }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      role="img"
      aria-label={hidden ? "Hidden card" : `${card.value} of ${card.suit}`}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center"
        initial={isDealer && hidden ? "hidden" : "visible"}
        animate={isDealer && !hidden ? "visible" : undefined}
        variants={variants}
        transition={{ duration: 0.5 }}
      >
        {!hidden && (
          <div className={`text-xl sm:text-2xl font-bold ${suitColor}`}>
            {card.value}
            <span className="text-2xl sm:text-4xl">{card.suit}</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CardComponent;
