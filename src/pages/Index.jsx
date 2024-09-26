import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import BlackjackGame from '../components/BlackjackGame';

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Game",
    "name": "Blackjack Delight Dream",
    "description": "An online Blackjack game where players can test their skills against the dealer.",
    "genre": "Card Game",
    "numberOfPlayers": "1",
    "gameItem": [
      {
        "@type": "Thing",
        "name": "Playing Cards"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Blackjack Delight Dream - Play Online Blackjack</title>
        <meta name="description" content="Experience the thrill of online Blackjack with Blackjack Delight Dream. Play now and enjoy a realistic casino experience from the comfort of your home." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="bg-gray-800 p-4">
          <h1 className="text-2xl font-bold text-center">Blackjack Delight Dream</h1>
        </header>
        <main className="flex-grow container mx-auto p-4 overflow-y-auto">
          <BlackjackGame />
        </main>
        <footer className="bg-gray-800 p-4">
          <nav className="text-center flex flex-wrap justify-center gap-4">
            <Link to="/game-rules" className="text-sm text-gray-400 hover:text-white">Game Rules</Link>
            <Link to="/help-support" className="text-sm text-gray-400 hover:text-white">Help & Support</Link>
            <Link to="/responsible-gaming" className="text-sm text-gray-400 hover:text-white">Responsible Gaming</Link>
          </nav>
        </footer>
      </div>
    </>
  );
};

export default Index;
