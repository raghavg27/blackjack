import React from 'react';
import { motion } from 'framer-motion';

const DeckComponent = ({ cardsLeft }) => {
  return (
    <motion.div
      className="relative w-24 h-36"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[...Array(Math.min(5, cardsLeft))].map((_, index) => (
        <motion.div
          key={index}
          className="absolute top-0 left-0 w-24 h-36 bg-blue-500 rounded-lg shadow-md border-2 border-white"
          style={{ zIndex: 5 - index }}
          initial={{ x: index * 2, y: index * 2 }}
          animate={{ x: index * 2, y: index * 2 }}
        />
      ))}
      <div className="absolute top-2 left-2 text-white font-bold">
        {cardsLeft}
      </div>
    </motion.div>
  );
};

export default DeckComponent;
