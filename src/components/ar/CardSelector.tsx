
import React from 'react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

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
  return (
    <div 
      className={`card-selector fixed bottom-0 left-0 right-0 z-50 p-4 ${showCardSelector ? 'open' : ''}`}
      style={{ maxHeight: '50vh' }}
    >
      <div className="bg-black/80 backdrop-blur-md rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Add Cards to Scene</h3>
        
        <div className="max-h-[30vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            {availableCards.map((card) => (
              <div 
                key={card.id}
                className="relative bg-gray-900 rounded-md overflow-hidden"
              >
                <img 
                  src={card.imageUrl} 
                  alt={card.title}
                  className="w-full aspect-[2.5/3.5] object-cover"
                />
                <Button
                  size="icon"
                  className="absolute bottom-1 right-1 h-8 w-8 rounded-full"
                  onClick={() => onAddCard(card)}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSelector;
