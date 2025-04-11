
import React from 'react';
import { Link } from 'react-router-dom';

const GameDayCard = () => {
  return (
    <Link to="/game-day">
      <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-purple-50 h-full">
        <div className="h-40 flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-blue-500 mx-auto flex items-center justify-center">
              <span className="text-white text-xl font-bold">LIVE</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg text-blue-600">Game Day Mode</h3>
          <p className="text-gray-600 mt-1">Enhanced experience for live games</p>
          <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            Featured
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameDayCard;
