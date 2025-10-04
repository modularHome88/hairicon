
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-5 text-center">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
          AI Hairstylist Studio
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Discover your next look with a personalized virtual try-on.
        </p>
      </div>
    </header>
  );
};
