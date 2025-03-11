
import React from 'react';
import { CardData } from '@/types/card';

interface CardItemProps {
  card: CardData;
  isActive: boolean;
  onClick: () => void;
}

const CardItem = ({ card, isActive, onClick }: CardItemProps) => {
  return (
    <div 
      className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
        isActive 
          ? 'bg-blue-100 border-l-4 border-blue-500' 
          : 'bg-white hover:bg-gray-100 border-l-4 border-transparent'
      }`}
      onClick={onClick}
    >
      <div 
        className="flex-shrink-0 w-12 h-16 rounded-md overflow-hidden" 
        style={{ backgroundColor: card.backgroundColor }}
      ></div>
      <div className="ml-4">
        <h4 className="font-medium">{card.name}</h4>
        <p className="text-sm text-gray-600">{card.team} #{card.jersey}</p>
      </div>
    </div>
  );
};

export default CardItem;
