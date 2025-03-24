
import React from 'react';
import { BarChart4 } from 'lucide-react';
import type { CardStats as CardStatsType } from '../types/BaseballCard';

interface CardStatsProps {
  stats: CardStatsType;
}

const CardStats: React.FC<CardStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-64 md:w-72 bg-black/60 backdrop-blur-md p-4 rounded-lg border-r-4 border-red-500 text-white hidden lg:block">
      <h3 className="text-lg font-bold flex items-center mb-4">
        <BarChart4 className="mr-2 h-5 w-5 text-red-400" /> Career Stats
      </h3>
      
      <div className="space-y-4">
        {stats.battingAverage && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-400">Batting Average</span>
              <span className="font-bold">{stats.battingAverage}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${parseFloat(stats.battingAverage) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {stats.homeRuns && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-400">Home Runs</span>
              <span className="font-bold">{stats.homeRuns}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${Math.min(parseInt(stats.homeRuns) / 800, 1) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {stats.rbis && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-400">RBIs</span>
              <span className="font-bold">{stats.rbis}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${Math.min(parseInt(stats.rbis.replace(',', '')) / 2500, 1) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardStats;
