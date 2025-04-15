
import React from 'react';
import { cn } from '@/lib/utils';

export interface CardContentProps {
  playerName: string;
  team: string;
  position: string;
  year: string;
  setInfo: string;
  stats?: Record<string, string | number>;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({
  playerName,
  team,
  position,
  year,
  setInfo,
  stats,
  className
}) => {
  return (
    <div className={cn("p-4 space-y-2", className)}>
      <div className="text-lg font-bold truncate">{playerName}</div>
      
      <div className="flex justify-between text-sm">
        <span>{team}</span>
        <span>{position}</span>
      </div>
      
      <div className="flex justify-between text-xs text-gray-600">
        <span>{year}</span>
        <span>{setInfo}</span>
      </div>
      
      {stats && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600">{key}:</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardContent;
