import React from 'react';
import BlackjackGame from '../components/BlackjackGame';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-center">Blackjack Game</h1>
      </header>
      <main className="container mx-auto p-4">
        <BlackjackGame />
      </main>
      <footer className="bg-gray-800 p-4 mt-8">
        <div className="text-center">
          <a href="#" className="text-sm text-gray-400 hover:text-white mr-4">Game Rules</a>
          <a href="#" className="text-sm text-gray-400 hover:text-white mr-4">Help & Support</a>
          <a href="#" className="text-sm text-gray-400 hover:text-white">Responsible Gaming</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;