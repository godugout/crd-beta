
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Team } from '@/lib/types/BaseballTypes';

interface TeamColorHistoryProps {
  team: Team;
}

const TeamColorHistory: React.FC<TeamColorHistoryProps> = ({ team }) => {
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  
  // Sort colorHistory by year
  const sortedHistory = [...team.colorHistory].sort((a, b) => a.year - b.year);
  
  useEffect(() => {
    if (sortedHistory.length > 0) {
      const years = sortedHistory.map(color => color.year);
      setYearOptions(years);
      setSelectedYear(years[years.length - 1]); // Set to most recent year
    }
  }, [sortedHistory]);

  const currentColors = sortedHistory.find(color => color.year === selectedYear) || sortedHistory[0];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current year preview */}
          <div 
            className="h-32 rounded-lg flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: currentColors?.background }}
          >
            <h3 
              className="text-3xl font-bold transition-colors duration-300"
              style={{ color: currentColors?.text }}
            >
              {team.nickname || team.name}
            </h3>
          </div>

          {/* Year slider */}
          {yearOptions.length > 1 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{Math.min(...yearOptions)}</span>
                <span>Year: {selectedYear}</span>
                <span>{Math.max(...yearOptions)}</span>
              </div>
              <Slider
                value={[selectedYear]}
                min={Math.min(...yearOptions)}
                max={Math.max(...yearOptions)}
                step={1}
                onValueChange={(value) => setSelectedYear(value[0])}
                className="w-full"
              />
            </div>
          )}

          {/* Color history table */}
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-3 gap-4 font-medium text-sm text-gray-500 pb-2">
              <div>Year</div>
              <div>Background</div>
              <div>Text Color</div>
            </div>
            
            {sortedHistory.map((color, index) => (
              <div 
                key={`${color.year}-${index}`} 
                className={`grid grid-cols-3 gap-4 items-center py-2 border-t border-gray-100 ${
                  color.year === selectedYear ? 'bg-gray-50 -mx-4 px-4' : ''
                }`}
              >
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamColorHistory;
