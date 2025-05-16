import React from 'react';
import { Card } from '@/lib/types/cardTypes';

interface FullscreenViewerProps {
  card: Card;
  onClose: () => void;
}

const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ card, onClose }) => {
  // Ensure card objects have required cardMetadata properties
  const ensureValidCard = (card: Card): Card => {
    return {
      ...card,
      designMetadata: {
        ...card.designMetadata,
        cardMetadata: {
          category: card.designMetadata?.cardMetadata?.category || 'general',
          series: card.designMetadata?.cardMetadata?.series || 'base',
          cardType: card.designMetadata?.cardMetadata?.cardType || 'standard',
          ...card.designMetadata?.cardMetadata
        }
      }
    };
  };

  const validCard = ensureValidCard(card);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="relative">
        <button
          className="absolute top-4 right-4 text-white text-2xl z-10"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={validCard.imageUrl}
          alt={validCard.title}
          className="max-w-4xl max-h-4xl"
        />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">{validCard.title}</h2>
          <p>{validCard.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FullscreenViewer;
