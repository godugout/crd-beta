
import React from 'react';
import { CardData } from '@/types/card';
import CardViewer from './CardViewer';
import CardDescription from './CardDescription';
import CardSidebar from './CardSidebar';

interface CardShowcaseProps {
  cardData: CardData[];
  activeCard: number;
  isFlipped: boolean;
  selectCard: (index: number) => void;
  flipCard: () => void;
  setView: (view: 'showcase' | 'collection' | 'upload') => void;
}

const CardShowcase = ({ 
  cardData, 
  activeCard, 
  isFlipped, 
  selectCard, 
  flipCard, 
  setView 
}: CardShowcaseProps) => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row p-4">
      {/* Card display area */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <CardViewer 
          card={cardData[activeCard]} 
          isFlipped={isFlipped} 
          flipCard={flipCard} 
          onBackToCollection={() => setView('collection')} 
        />
        
        <CardDescription card={cardData[activeCard]} />
      </div>
      
      {/* Right sidebar with more cards */}
      <CardSidebar 
        cardData={cardData} 
        activeCard={activeCard} 
        onSelectCard={selectCard} 
      />
    </div>
  );
};

export default CardShowcase;
