
import React from 'react';
import { CardData } from '@/types/card';

interface CardCollectionProps {
  cardData: CardData[];
  selectCard: (index: number) => void;
  setView: (view: 'showcase' | 'collection' | 'upload') => void;
}

const CardCollection = ({ cardData, selectCard, setView }: CardCollectionProps) => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Collection</h2>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setView('upload')}
        >
          Upload New Card
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div 
            key={card.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer" 
            onClick={() => {selectCard(index); setView('showcase');}}
          >
            <div 
              className="h-48 bg-cover bg-center" 
              style={{ 
                backgroundColor: card.backgroundColor,
                backgroundImage: `linear-gradient(45deg, ${card.backgroundColor}88, ${card.backgroundColor}ff)`
              }}
            ></div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{card.name}</h3>
              <p className="text-gray-600 text-sm">{card.team} #{card.jersey}</p>
              <p className="text-gray-500 text-xs mt-1">{card.set} • {card.year}</p>
              
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {card.specialEffect}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Card
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardCollection;
