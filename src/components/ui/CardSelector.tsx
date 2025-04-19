
import React from 'react';

interface CardSelectorProps {
  selectedCardIds: string[];
  onSelectionChange: (cardIds: string[]) => void;
  readOnly?: boolean;
}

const CardSelector: React.FC<CardSelectorProps> = ({
  selectedCardIds,
  onSelectionChange,
  readOnly = false
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {selectedCardIds.map(cardId => (
        <div 
          key={cardId}
          className="border rounded-md p-2 bg-gray-50 flex flex-col items-center"
        >
          <div className="w-full aspect-square bg-gray-200 rounded-md mb-2 flex items-center justify-center text-sm text-gray-500">
            Card {cardId}
          </div>
          {!readOnly && (
            <button 
              className="text-xs text-red-500"
              onClick={() => onSelectionChange(selectedCardIds.filter(id => id !== cardId))}
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CardSelector;
