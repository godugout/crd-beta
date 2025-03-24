
import React from 'react';
import { Award, Calendar, Copyright, Crop, Flame, Icon, Info, Medal, User } from 'lucide-react';
import { CardData } from '../types/BaseballCard';

interface CardDetailsProps {
  card: CardData;
}

const CardDetails: React.FC<CardDetailsProps> = ({ card }) => {
  return (
    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-64 md:w-80 bg-black/60 backdrop-blur-md p-4 rounded-lg border-l-4 border-blue-500 text-white">
      <h3 className="text-lg font-bold flex items-center mb-4">
        <Info className="mr-2 h-5 w-5 text-blue-400" /> Card Details
      </h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-gray-400">Player:</span>
          <span className="ml-auto font-medium">{card.player}</span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-gray-400">Year:</span>
          <span className="ml-auto font-medium">{card.year}</span>
        </div>
        
        <div className="flex items-center">
          <Copyright className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-gray-400">Manufacturer:</span>
          <span className="ml-auto font-medium">{card.manufacturer}</span>
        </div>
        
        <div className="flex items-center">
          <Crop className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-gray-400">Card #:</span>
          <span className="ml-auto font-medium">{card.cardNumber}</span>
        </div>
        
        <div className="flex items-center">
          <Flame className="mr-2 h-4 w-4 text-orange-400" />
          <span className="text-gray-400">Estimated Value:</span>
          <span className="ml-auto font-medium text-green-400">{card.value}</span>
        </div>
        
        <div className="flex items-center">
          <Award className="mr-2 h-4 w-4 text-yellow-400" />
          <span className="text-gray-400">Condition:</span>
          <span className="ml-auto font-medium">{card.condition}</span>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center mb-1">
            <Medal className="mr-2 h-4 w-4 text-amber-400" />
            <span className="text-gray-400">Rarity Score:</span>
            <span className="ml-auto font-medium">{card.rarityScore}/10</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-amber-400 h-1.5 rounded-full" 
              style={{ width: `${(card.rarityScore/10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;

