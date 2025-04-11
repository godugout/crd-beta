
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TeamColorCardProps {
  year: number;
  background: string;
  text: string;
  nickname: string;
}

const TeamColorCard: React.FC<TeamColorCardProps> = ({ 
  year, 
  background, 
  text, 
  nickname 
}) => {
  return (
    <Card key={`${year}`} className="overflow-hidden">
      <div 
        className="h-24 flex items-center justify-center"
        style={{ backgroundColor: background }}
      >
        <h3 
          className="text-2xl font-bold"
          style={{ color: text }}
        >
          {nickname}
        </h3>
      </div>
      <CardContent className="p-4">
        <p className="font-medium">{year}</p>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div>
            <p className="text-xs text-gray-500">Background</p>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ backgroundColor: background }}
              />
              <span className="font-mono">{background}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Text</p>
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ backgroundColor: text }}
              />
              <span className="font-mono">{text}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamColorCard;
