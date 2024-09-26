import React from 'react';
import { Link } from 'react-router-dom';

const HelpSupport = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-center">Help & Support</h1>
      </header>
      <main className="flex-grow container mx-auto p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Q: How do I place a bet?</h3>
              <p>A: To place a bet, use the betting controls at the bottom of the game screen before each hand is dealt. You can choose from preset bet amounts or enter a custom bet.</p>
            </div>
            <div>
              <h3 className="font-semibold">Q: What does "Double Down" mean?</h3>
              <p>A: Double Down allows you to double your original bet in exchange for receiving exactly one more card. This option is available when you have your initial two cards.</p>
            </div>
            <div>
              <h3 className="font-semibold">Q: How does splitting work?</h3>
              <p>A: If your first two cards have the same value, you can split them into two separate hands. Each hand will receive a new card and you'll play them separately, with an additional bet equal to your original bet for the new hand.</p>
            </div>
            <div>
              <h3 className="font-semibold">Q: What happens if I run out of money?</h3>
              <p>A: If your balance reaches zero, you'll be given the option to restart the game with a fresh balance. Remember to always play responsibly and within your means.</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Support</h2>
          <p className="mb-4">If you need further assistance or have any questions not covered in the FAQ, please don't hesitate to contact our support team:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Email: support@blackjackgame.com</li>
            <li>Phone: 1-800-BLACKJACK</li>
            <li>Live Chat: Available 24/7 through our website</li>
          </ul>

          <Link to="/" className="text-blue-400 hover:text-blue-300">Back to Game</Link>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;