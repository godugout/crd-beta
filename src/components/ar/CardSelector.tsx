
import React from 'react';
import { Card } from '@/lib/types';
import { toast } from 'sonner';

interface CardSelectorProps {
  showCardSelector: boolean;
  availableCards: Card[];
  onAddCard: (card: Card) => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({
  showCardSelector,
  availableCards,
  onAddCard
}) => {
  const handleAddCard = (card: Card) => {
    onAddCard(card);
  };

  if (!showCardSelector) return null;

  return (
    <div className="absolute right-4 top-28 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 w-64 max-h-80 overflow-y-auto card-selector animate-fadeIn">
      <h3 className="font-semibold mb-3">Add Card to Scene</h3>
      <div className="space-y-2">
        {availableCards.map((card, index) => (
          <div 
            key={card.id}
            className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors card-appear"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => handleAddCard(card)}
          >
            <div className="w-8 h-12 bg-gray-200 rounded overflow-hidden mr-2">
              <img 
                src={card.imageUrl} 
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-sm truncate">{card.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSelector;
