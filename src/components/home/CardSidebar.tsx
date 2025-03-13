
import React from 'react';
import { CardData } from '@/types/card';
import CardItem from './CardItem';
import { Sparkles, Flame, PaintBucket, Zap } from 'lucide-react';

interface CardSidebarProps {
  cardData: CardData[];
  activeCard: number;
  onSelectCard: (index: number) => void;
}

const CardSidebar = ({ cardData, activeCard, onSelectCard }: CardSidebarProps) => {
  const effectOptions = [
    { name: 'Classic Holographic', icon: <Sparkles className="h-4 w-4" /> },
    { name: 'Refractor', icon: <Flame className="h-4 w-4" /> },
    { name: 'Prismatic', icon: <PaintBucket className="h-4 w-4" /> },
    { name: 'Electric', icon: <Zap className="h-4 w-4" /> }
  ];

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
          {effectOptions.map((effect, index) => (
            <button 
              key={index}
              className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition flex items-center"
            >
              <span className="mr-2 text-blue-500">{effect.icon}</span>
              {effect.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-bold text-md mb-2">Pro Tip</h3>
        <p className="text-sm text-blue-800">
          Try different effect combinations to make your cards stand out in your collection!
        </p>
      </div>
    </div>
  );
};

export default CardSidebar;
