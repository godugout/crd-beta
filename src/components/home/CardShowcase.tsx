
import React, { useState } from 'react';
import { CardData } from '@/types/card';
import CardViewer from './CardViewer';
import CardDescription from './CardDescription';
import CardSidebar from './CardSidebar';
import { toast } from 'sonner';

interface CardShowcaseProps {
  cardData: CardData[];
  activeCard: number;
  isFlipped: boolean;
  selectCard: (index: number) => void;
  flipCard: () => void;
  setView: (view: 'showcase' | 'collection' | 'upload') => void;
}

interface Snapshot {
  id: number;
  timestamp: Date;
  effects: string[];
  cardId: number;
}

const CardShowcase = ({ 
  cardData, 
  activeCard, 
  isFlipped, 
  selectCard, 
  flipCard, 
  setView 
}: CardShowcaseProps) => {
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  
  const toggleEffect = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) 
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
    
    toast.success(
      activeEffects.includes(effect) 
        ? `${effect} effect removed` 
        : `${effect} effect applied`,
      {
        position: 'bottom-right',
      }
    );
  };
  
  const handleTakeSnapshot = () => {
    const newSnapshot: Snapshot = {
      id: Date.now(),
      timestamp: new Date(),
      effects: [...activeEffects],
      cardId: cardData[activeCard].id
    };
    
    setSnapshots(prev => [newSnapshot, ...prev]);
  };
  
  const handleSelectSnapshot = (snapshotId: number) => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (snapshot) {
      setActiveEffects(snapshot.effects);
      toast.info('Snapshot effects applied', {
        description: `Applied ${snapshot.effects.length} effect${snapshot.effects.length !== 1 ? 's' : ''}`,
        position: 'bottom-right',
      });
    }
  };

  const handleClearEffects = () => {
    if (activeEffects.length > 0) {
      setActiveEffects([]);
      toast.info('All effects cleared', {
        position: 'bottom-right',
      });
    }
  };

  if (!cardData.length) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No cards available</h2>
        <p className="mb-6">Your collection is empty. Start by adding some cards!</p>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setView('upload')}
        >
          Upload New Card
        </button>
      </div>
    );
  }

  const filteredSnapshots = snapshots.filter(s => s.cardId === cardData[activeCard].id);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row p-4 gap-6">
      {/* Card display area */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <CardViewer 
          card={cardData[activeCard]} 
          isFlipped={isFlipped} 
          flipCard={flipCard} 
          onBackToCollection={() => setView('collection')} 
          activeEffects={activeEffects}
          onSnapshot={handleTakeSnapshot}
        />
        
        <CardDescription card={cardData[activeCard]} />
      </div>
      
      {/* Right sidebar with more cards */}
      <CardSidebar 
        cardData={cardData} 
        activeCard={activeCard} 
        onSelectCard={selectCard}
        activeEffects={activeEffects}
        toggleEffect={toggleEffect}
        snapshots={filteredSnapshots}
        onSelectSnapshot={handleSelectSnapshot}
        onClearEffects={handleClearEffects}
      />
    </div>
  );
};

export default CardShowcase;
