
import React from 'react';
import { ArrowRight, Upload, Share2, RotateCw } from 'lucide-react';
import { CardData } from '@/types/card';
import CardItem from './CardItem';

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
        {/* Card viewer */}
        <div 
          className="relative w-full h-96 md:h-[500px] flex items-center justify-center p-4 bg-gray-100 rounded-lg"
        >
          {/* Sample card representation */}
          <div 
            className={`w-64 h-96 relative transition-transform duration-500 rounded-lg shadow-xl ${isFlipped ? 'scale-x-[-1]' : ''}`} 
            style={{ backgroundColor: cardData[activeCard].backgroundColor }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
              {!isFlipped ? cardData[activeCard].name : 'CardShow'}
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              {!isFlipped ? `#${cardData[activeCard].jersey}` : cardData[activeCard].set}
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
            onClick={() => setView('collection')}
          >
            <ArrowRight className="h-6 w-6 rotate-180" />
          </button>
        </div>
        
        {/* Card description */}
        <div className="bg-white p-6 shadow-md mt-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">{cardData[activeCard].name}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{cardData[activeCard].team}</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">#{cardData[activeCard].jersey}</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{cardData[activeCard].year}</span>
          </div>
          <p className="text-gray-700 mb-6">{cardData[activeCard].description}</p>
          
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Share2 className="mr-2 h-4 w-4" />
              Share Card
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
              <Upload className="mr-2 h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>
      
      {/* Right sidebar with more cards */}
      <div className="w-full lg:w-1/3 bg-gray-50 p-4 mt-6 lg:mt-0 lg:ml-6 rounded-lg">
        <h3 className="font-bold text-lg mb-4">More Cards</h3>
        
        <div className="space-y-3">
          {cardData.map((card, index) => (
            <CardItem 
              key={card.id}
              card={card}
              isActive={activeCard === index}
              onClick={() => selectCard(index)}
            />
          ))}
        </div>
        
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4">Effect Options</h3>
          
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              Classic Holographic
            </button>
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              Refractor
            </button>
            <button className="w-full text-left px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              Prismatic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardShowcase;
