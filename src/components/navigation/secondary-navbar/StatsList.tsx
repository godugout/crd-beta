
import React from 'react';

interface StatsListProps {
  stats: Array<{
    count?: number;
    label?: string;
  }>;
}

export const StatsList: React.FC<StatsListProps> = ({ stats }) => {
  if (stats.length === 0) return null;
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      {stats.map((stat, index) => (
        <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
          {stat.count !== undefined && (
            <span className="font-medium">{stat.count}</span>
          )}
          {" "}
          {stat.label}
        </div>
      ))}
    </div>
  );
};
