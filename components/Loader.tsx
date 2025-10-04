
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Warming up the styling tools...",
  "Analyzing your photo for the perfect match...",
  "Consulting with our virtual stylists...",
  "Crafting your natural looks...",
  "Adding a touch of glamour...",
  "Polishing the final results...",
  "Almost ready to reveal your new styles!"
];

export const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl shadow-lg max-w-lg mx-auto">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <h2 className="text-2xl font-bold text-gray-800 mt-6">Generating Your Styles</h2>
      <p className="text-gray-500 mt-2 transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
      <p className="text-sm text-gray-400 mt-6">This may take a minute or two. Please don't refresh the page.</p>
    </div>
  );
};
