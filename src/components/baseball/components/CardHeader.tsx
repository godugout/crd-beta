
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardData } from '../types/BaseballCard';

interface CardHeaderProps {
  cardData: CardData;
}

const CardHeader: React.FC<CardHeaderProps> = ({ cardData }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-red-600 border-none text-white uppercase font-bold px-3 py-1">
              Live
            </Badge>
            <span className="text-xs text-gray-300">Card Showcase</span>
          </div>
          <div className="text-xs text-gray-300">
            {cardData.manufacturer} • {cardData.year}
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mt-2">{cardData.title}</h1>
      </div>
    </div>
  );
};

export default CardHeader;
