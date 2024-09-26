import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import HandComponent from "./HandComponent";
import DeckComponent from "./DeckComponent";
import GameControls from "./GameControls";
import GameStatus from "./GameStatus";
import { Button } from "@/components/ui/button";
import {
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
} from "../redux/gameSlice";
import confetti from "canvas-confetti";
import { debounce } from "../utils/blackjackUtils.js"; // Import debounce from utility file

const BlackjackGame = () => {
  const gameState = useSelector((state) => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeGame());
  }, [dispatch]);

  useEffect(() => {
    if (gameState.gamePhase === "dealing") {
      dispatch(dealInitialCards());
    } else if (gameState.gamePhase === "dealerTurn") {
      dispatch(dealerPlay());
      dispatch(endGame());
    }
  }, [gameState.gamePhase, dispatch]);

  useEffect(() => {
    if (
      gameState.gamePhase === "gameOver" &&
      gameState.message.includes("You win")
    ) {
      confetti({
        particleCount: 200,
        spread: 40,
        origin: { y: 0.5 },
      });
    }
  }, [gameState.gamePhase, gameState.message]);

  const handlePlaceBet = (amount) => dispatch(placeBet(amount));
  const handleHit = debounce(() => dispatch(hit()), 500);
  const handleStand = () => dispatch(stand());
  const handleDoubleDown = () => dispatch(doubleDown());
  const handleSplit = () => dispatch(split());
  const handleStartNewGame = () => dispatch(startNewGame());

  const getResultMessage = () => {
    if (gameState.gamePhase !== "gameOver") return "New Game";
    if (gameState.playerBalance === 0)
      return "Game Over! You are out of money. 😪";
    return gameState.message || "New Game";
  };

  return (
    <section
      className={`${gameState.backgroundColor} p-4 rounded-lg shadow-lg transition-colors duration-500 flex flex-col h-full`}
      aria-label="Blackjack Game"
    >
      <GameStatus gameState={gameState} />
      <Card className="mb-4 bg-green-700">
        <CardContent>
          <h2 className="text-lg font-bold mb-4 mt-4 text-white">
            Dealer's Hand
          </h2>
          <HandComponent
            hand={gameState.dealerHand}
            isDealer={true}
            hidden={gameState.dealerCardsHidden}
          />
        </CardContent>
      </Card>
      <div className="flex justify-center mb-8 mt-4">
        <DeckComponent cardsLeft={gameState.deck.length} />
      </div>
      <div className="flex-grow overflow-y-auto">
        {gameState.playerHands.map((hand, index) => (
          <Card
            key={index}
            className={`mb-4 bg-green-700 ${
              index === gameState.currentHandIndex
                ? "border-2 border-yellow-500"
                : ""
            }`}
          >
            <CardContent>
              <h2 className="text-lg font-bold mb-2 mt-4 text-white">
                Your Hand{" "}
                {gameState.playerHands.length > 1 ? `#${index + 1}` : ""}
              </h2>
              <HandComponent hand={hand} />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <GameControls
          gameState={gameState}
          placeBet={handlePlaceBet}
          hit={handleHit}
          stand={handleStand}
          doubleDown={handleDoubleDown}
          split={handleSplit}
        />
        {(gameState.gamePhase === "gameOver" ||
          gameState.playerBalance === 0) && (
          <motion.div
            className="w-full mt-4 mb-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className={`w-full ${
                gameState.playerBalance === 0
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={handleStartNewGame}
              disabled={gameState.playerBalance === 0}
            >
              {getResultMessage()}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlackjackGame;