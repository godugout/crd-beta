
import React, { useState } from 'react';
import CardUpload from './home/CardUpload';
import CardCollection from './home/CardCollection';
import CardShowcase from './home/CardShowcase';
import { cardData } from '@/data/cardData';

type ViewState = 'showcase' | 'collection' | 'upload' | 'welcome';

const OldCardCreator: React.FC = () => {
  const [view, setView] = useState<ViewState>('collection');
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

      {view === 'welcome' && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Card Creator</h2>
          <p className="mb-6">Get started by creating a new card or viewing your collection</p>
          <div className="flex justify-center gap-4">
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setView('upload')}
            >
              Create New Card
            </button>
            <button 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              onClick={() => setView('collection')}
            >
              View Collection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OldCardCreator;
