
import React, { useState } from 'react';
import CardUpload from './home/CardUpload';
import CardCollection from './home/CardCollection';
import CardShowcase from './home/CardShowcase';
import { cardData } from '@/data/cardData';
import { adaptCardToCardData } from '@/types/card';

const OldCardCreator: React.FC = () => {
  const [view, setView] = useState<'showcase' | 'collection' | 'upload'>('collection');
  const [activeCard, setActiveCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const selectCard = (index: number) => {
    setActiveCard(index);
  };
  
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Ensure we're using CardData type for compatibility
  const compatibleCardData = cardData.map(card => {
    if ('description' in card && typeof card.description === 'string') {
      return card;
    }
    // Make sure description is not undefined
    return {
      ...card,
      description: card.description || ''
    };
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {view === 'upload' && (
        <CardUpload setView={setView} />
      )}
      
      {view === 'collection' && (
        <CardCollection 
          cardData={compatibleCardData} 
          selectCard={selectCard} 
          setView={setView} 
        />
      )}
      
      {view === 'showcase' && (
        <CardShowcase 
          cardData={compatibleCardData}
          activeCard={activeCard}
          isFlipped={isFlipped}
          selectCard={selectCard}
          flipCard={flipCard}
          setView={setView}
        />
      )}
    </div>
  );
};

export default OldCardCreator;
