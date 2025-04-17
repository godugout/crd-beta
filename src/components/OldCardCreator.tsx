
import React, { useState } from 'react';
import CardUpload from './home/CardUpload';
import CardCollection from './home/CardCollection';
import CardShowcase from './home/CardShowcase';
import { cardData } from '@/data/cardData';

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
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {view === 'upload' && (
        <CardUpload setView={setView} />
      )}
      
      {view === 'collection' && (
        <CardCollection 
          cardData={cardData} 
          selectCard={selectCard} 
          setView={setView} 
        />
      )}
      
      {view === 'showcase' && (
        <CardShowcase 
          cardData={cardData}
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
