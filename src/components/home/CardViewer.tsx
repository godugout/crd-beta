
import React from 'react';
import { RotateCw, ArrowRight } from 'lucide-react';
import { CardData } from '@/types/card';

interface CardViewerProps {
  card: CardData;
  isFlipped: boolean;
  flipCard: () => void;
  onBackToCollection: () => void;
}

const CardViewer = ({ card, isFlipped, flipCard, onBackToCollection }: CardViewerProps) => {
  return (
    <div className="relative w-full h-96 md:h-[500px] flex items-center justify-center p-4 bg-gray-100 rounded-lg">
      {/* Card representation */}
      <div 
        className={`w-64 h-96 relative transition-transform duration-500 rounded-lg shadow-xl ${isFlipped ? 'scale-x-[-1]' : ''}`} 
        style={{ backgroundColor: card.backgroundColor }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
          {!isFlipped ? card.name : 'CardShow'}
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          {!isFlipped ? `#${card.jersey}` : card.set}
        </div>
      </div>
      
      {/* Flip button */}
      <button 
        className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
        onClick={flipCard}
      >
        <RotateCw className="h-6 w-6" />
      </button>
      
      {/* Return to collection button */}
      <button 
        className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
        onClick={onBackToCollection}
      >
        <ArrowRight className="h-6 w-6 rotate-180" />
      </button>
    </div>
  );
};

export default CardViewer;
