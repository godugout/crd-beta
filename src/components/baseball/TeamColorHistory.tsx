
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Team } from '@/lib/types/BaseballTypes';

interface TeamColorHistoryProps {
  team: Team;
}

const TeamColorHistory: React.FC<TeamColorHistoryProps> = ({ team }) => {
  // Sort colorHistory by year
  const sortedHistory = [...team.colorHistory].sort((a, b) => a.year - b.year);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedHistory.length === 0 ? (
            <p className="text-gray-500 text-center">No color history available</p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 font-medium text-sm text-gray-500 pb-2">
                <div>Year</div>
                <div>Background</div>
                <div>Text Color</div>
              </div>
              
              {sortedHistory.map((color, index) => (
                <div key={`${color.year}-${index}`} className="grid grid-cols-3 gap-4 items-center py-2 border-t border-gray-100">
                  <div className="font-medium">{color.year}</div>
                  
                  <div className="flex items-center">
                    <div 
                      className="w-5 h-5 rounded mr-2" 
                      style={{ backgroundColor: color.background }}
                    />
                    <span className="text-sm font-mono">{color.background}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div 
                      className="w-5 h-5 rounded mr-2" 
                      style={{ backgroundColor: color.text }}
                    />
                    <span className="text-sm font-mono">{color.text}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamColorHistory;
