
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CardData } from '../types/BaseballCard';
import { Timer, DollarSign, Users } from 'lucide-react';

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
              Live Auction
            </Badge>
            <Badge variant="outline" className="bg-emerald-600 border-none text-white">
              <Timer className="w-4 h-4 mr-1" />
              12:45 remaining
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              24 bidders
            </span>
            <span className="flex items-center font-bold text-emerald-400">
              <DollarSign className="w-4 h-4" />
              Current Bid: {cardData.value}
            </span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mt-2">{cardData.title}</h1>
        <p className="text-gray-300 mt-1">
          {cardData.condition} • Lot #T206-{cardData.id}
        </p>
      </div>
    </div>
  );
};

export default CardHeader;
