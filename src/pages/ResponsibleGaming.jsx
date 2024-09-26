import React from 'react';
import { Link } from 'react-router-dom';

const ResponsibleGaming = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-center">Responsible Gaming</h1>
      </header>
      <main className="flex-grow container mx-auto p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Our Commitment</h2>
          <p className="mb-4">At Blackjack Game, we are committed to promoting responsible gaming. While we want our players to enjoy their experience, we also recognize the importance of maintaining a balanced and healthy approach to gaming.</p>

          <h2 className="text-xl font-semibold mb-4">Tips for Responsible Gaming</h2>
          <ul className="list-disc list-inside mb-4">
            <li>Set a budget for your gaming activities and stick to it.</li>
            <li>Set time limits for your playing sessions.</li>
            <li>Never chase losses or try to win back money you've lost.</li>
            <li>Don't play when you're upset, stressed, or under the influence of alcohol or drugs.</li>
            <li>Balance gaming with other activities and hobbies.</li>
            <li>Remember that gaming should be for entertainment, not a way to make money.</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">Self-Assessment</h2>
          <p className="mb-4">Ask yourself these questions to evaluate your gaming habits:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Do you spend more time or money on gaming than you intend to?</li>
            <li>Do you feel guilty or anxious about your gaming habits?</li>
            <li>Have you tried to cut back on gaming but couldn't?</li>
            <li>Has gaming negatively impacted your relationships or work?</li>
          </ul>
          <p className="mb-4">If you answered yes to any of these questions, it may be time to reassess your gaming habits or seek help.</p>

          <h2 className="text-xl font-semibold mb-4">Getting Help</h2>
          <p className="mb-4">If you or someone you know is struggling with problem gaming, help is available:</p>
          <ul className="list-disc list-inside mb-4">
            <li>National Problem Gambling Helpline: 1-800-522-4700</li>
            <li>Gamblers Anonymous: www.gamblersanonymous.org</li>
            <li>National Council on Problem Gambling: www.ncpgambling.org</li>
          </ul>

          <Link to="/" className="text-blue-400 hover:text-blue-300">Back to Game</Link>
        </div>
      </main>
    </div>
  );
};

export default ResponsibleGaming;