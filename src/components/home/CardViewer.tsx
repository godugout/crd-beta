
import React from 'react';
import { CardData } from '@/types/card';

interface CardViewerProps {
  card: CardData;
  isFlipped: boolean;
  flipCard: () => void;
  onBackToCollection: () => void;
  activeEffects: string[];
  onSnapshot: () => void;
}

const CardViewer: React.FC<CardViewerProps> = ({
  card,
  isFlipped,
  flipCard,
  onBackToCollection,
  activeEffects,
  onSnapshot
}) => {
  return (
    <div className="relative bg-gray-100 rounded-lg shadow-lg overflow-hidden aspect-[3/4] w-full">
      <div className="h-full w-full flex items-center justify-center relative">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className={`max-h-full max-w-full object-contain transition-all duration-300 ${
              activeEffects.length > 0 ? activeEffects.join(' ') : ''
            }`}
          />
        ) : (
          <div className="bg-gray-200 h-96 w-72 rounded flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}
        
        {/* Card info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h3 className="font-bold text-xl">{card.name}</h3>
          <div className="flex flex-wrap gap-2 text-sm mt-1">
            {card.team && <span className="opacity-90">{card.team}</span>}
            {card.year && <span className="opacity-80">• {card.year}</span>}
            {card.jersey && <span className="opacity-80">• #{card.jersey}</span>}
          </div>
        </div>
        
        {/* Control buttons */}
        <button 
          className="absolute top-4 right-4 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
          onClick={flipCard}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <button 
          className="absolute top-4 left-4 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
          onClick={onBackToCollection}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        
        <button 
          className="absolute bottom-4 right-4 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow-sm"
          onClick={onSnapshot}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CardViewer;
