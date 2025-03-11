
import React from 'react';
import { CardData } from '@/types/card';
import CardItem from './CardItem';

interface CardSidebarProps {
  cardData: CardData[];
  activeCard: number;
  onSelectCard: (index: number) => void;
}

const CardSidebar = ({ cardData, activeCard, onSelectCard }: CardSidebarProps) => {
  return (
    <div className="w-full lg:w-1/3 bg-gray-50 p-4 mt-6 lg:mt-0 lg:ml-6 rounded-lg">
      <h3 className="font-bold text-lg mb-4">More Cards</h3>
      
      <div className="space-y-3">
        {cardData.map((card, index) => (
          <CardItem 
            key={card.id}
            card={card}
            isActive={activeCard === index}
            onClick={() => onSelectCard(index)}
          />
        ))}
      </div>
      
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">Effect Options</h3>
        
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
            Classic Holographic
          </button>
          <button className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
            Refractor
          </button>
          <button className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
            Prismatic
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardSidebar;
