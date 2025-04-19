
import React, { useState } from 'react';
import { Card } from '@/lib/types';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardSelectorProps {
  cards: Card[];
  selectedCards: Card[];
  onSelect: (card: Card) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  allowMultipleSelection?: boolean;
}

const CardSelector: React.FC<CardSelectorProps> = ({
  cards,
  selectedCards,
  onSelect,
  onSelectAll,
  onClearSelection,
  allowMultipleSelection = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = searchTerm.trim() 
    ? cards.filter(card => 
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (card.tags && card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    : cards;

  const isCardSelected = (card: Card) => {
    return selectedCards.some(selectedCard => selectedCard.id === card.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Select Cards</h3>
        <div className="flex space-x-2">
          {allowMultipleSelection && onSelectAll && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSelectAll}
              disabled={cards.length === 0}
            >
              Select All
            </Button>
          )}
          {allowMultipleSelection && onClearSelection && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClearSelection}
              disabled={selectedCards.length === 0}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search cards..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredCards.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">No cards found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCards.map((card) => (
            <div 
              key={card.id} 
              className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                isCardSelected(card) ? 'border-blue-500 ring-1 ring-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => onSelect(card)}
            >
              <div className="aspect-[2.5/3.5] bg-gray-100">
                {card.imageUrl ? (
                  <img 
                    src={card.thumbnailUrl || card.imageUrl} 
                    alt={card.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                <div className="text-white text-center p-2">
                  <p className="font-medium text-sm truncate">{card.title}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                {isCardSelected(card) ? (
                  <CheckCircle2 className="h-6 w-6 text-blue-500 bg-white rounded-full" />
                ) : (
                  <Circle className="h-6 w-6 text-white opacity-70" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {selectedCards.length} of {cards.length} selected
        </p>
      </div>
    </div>
  );
};

export default CardSelector;
