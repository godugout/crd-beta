
import React, { useState, useEffect } from 'react';
import { useCards } from '@/context/CardContext';
import { CardImage } from '@/components/cards/CardImage';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X, Plus, PlusSquare } from 'lucide-react';

interface MultiCardViewProps {
  mainCardId: string;
  relatedCards: Card[];
  onCardClick: (cardId: string) => void;
  zoom: number;
  activeEffects: string[];
  effectIntensity: {
    refractor: number;
    holographic: number;
    shimmer: number;
    vintage: number;
    gold: number;
  };
  autoMove: boolean;
}

const MultiCardView: React.FC<MultiCardViewProps> = ({
  mainCardId,
  relatedCards,
  onCardClick,
  zoom,
  activeEffects,
  effectIntensity,
  autoMove
}) => {
  const { cards, getCardById } = useCards();
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [layout, setLayout] = useState<'grid' | 'horizontal' | 'comparison'>('grid');
  const [showSelector, setShowSelector] = useState(false);
  
  // Initialize with main card and first related card
  useEffect(() => {
    const mainCard = getCardById ? getCardById(mainCardId) : cards.find(c => c.id === mainCardId);
    if (mainCard) {
      if (relatedCards.length > 0) {
        setSelectedCards([mainCard, relatedCards[0]]);
      } else {
        setSelectedCards([mainCard]);
      }
    }
  }, [mainCardId, relatedCards, getCardById, cards]);
  
  const addCard = (card: Card) => {
    // Limit to 9 cards for grid layout, 4 for others
    const maxCards = layout === 'grid' ? 9 : 4;
    if (selectedCards.length < maxCards) {
      setSelectedCards(prev => [...prev, card]);
    }
  };
  
  const removeCard = (index: number) => {
    setSelectedCards(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleLayoutChange = (newLayout: 'grid' | 'horizontal' | 'comparison') => {
    setLayout(newLayout);
    
    // If switching to comparison and we have more than 2 cards, trim to 2
    if (newLayout === 'comparison' && selectedCards.length > 2) {
      setSelectedCards(prev => prev.slice(0, 2));
    }
  };
  
  return (
    <div className="w-full h-full p-4">
      {/* Layout selector */}
      <div className="absolute top-20 left-4 z-40 flex space-x-2">
        <Button 
          variant={layout === 'grid' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleLayoutChange('grid')}
          className="bg-black/60 text-white border-gray-700"
        >
          Grid
        </Button>
        <Button 
          variant={layout === 'horizontal' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleLayoutChange('horizontal')}
          className="bg-black/60 text-white border-gray-700"
        >
          Row
        </Button>
        <Button 
          variant={layout === 'comparison' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleLayoutChange('comparison')}
          className="bg-black/60 text-white border-gray-700"
        >
          Compare
        </Button>
      </div>

      {/* Card display area */}
      <div className={`w-full h-full flex ${
        layout === 'grid' 
          ? 'flex-wrap justify-center' 
          : layout === 'horizontal' 
            ? 'flex-row justify-center' 
            : 'justify-center items-center'
      }`}>
        {layout === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCards.map((card, index) => (
              <div key={card.id} className="relative">
                <div className="w-40 md:w-52 scale-[0.85] origin-top-left">
                  <CardImage
                    card={card}
                    className={`mx-auto transform-gpu ${activeEffects.join(' ').toLowerCase()}`}
                    flippable={true}
                    enable3D={true}
                    autoRotate={autoMove}
                    onFlip={() => {}}
                  />
                </div>
                <button 
                  className="absolute -top-2 -right-2 z-10 bg-red-600 text-white rounded-full p-1"
                  onClick={() => removeCard(index)}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {/* Add card button */}
            {selectedCards.length < 9 && (
              <button
                className="w-40 md:w-52 h-64 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-gray-200 hover:border-gray-400"
                onClick={() => setShowSelector(true)}
              >
                <Plus size={32} />
              </button>
            )}
          </div>
        )}
        
        {layout === 'horizontal' && (
          <div className="flex flex-nowrap overflow-x-auto space-x-4 py-4 items-center justify-start w-full">
            {selectedCards.map((card, index) => (
              <div key={card.id} className="relative flex-shrink-0">
                <div className="w-40 md:w-52 scale-[0.85] origin-top-left">
                  <CardImage
                    card={card}
                    className={`mx-auto transform-gpu ${activeEffects.join(' ').toLowerCase()}`}
                    flippable={true}
                    enable3D={true}
                    autoRotate={autoMove}
                    onFlip={() => {}}
                  />
                </div>
                <button 
                  className="absolute -top-2 -right-2 z-10 bg-red-600 text-white rounded-full p-1"
                  onClick={() => removeCard(index)}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {/* Add card button */}
            {selectedCards.length < 4 && (
              <button
                className="w-40 h-64 flex-shrink-0 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-gray-200 hover:border-gray-400"
                onClick={() => setShowSelector(true)}
              >
                <Plus size={32} />
              </button>
            )}
          </div>
        )}
        
        {layout === 'comparison' && (
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 h-full">
            {selectedCards.map((card, index) => (
              <div key={card.id} className="relative">
                <div className="w-48 md:w-64 scale-[0.9] origin-top-left">
                  <CardImage
                    card={card}
                    className={`mx-auto transform-gpu ${activeEffects.join(' ').toLowerCase()}`}
                    flippable={true}
                    enable3D={true}
                    autoRotate={autoMove}
                    onFlip={() => {}}
                  />
                </div>
                <button 
                  className="absolute -top-2 -right-2 z-10 bg-red-600 text-white rounded-full p-1"
                  onClick={() => removeCard(index)}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {/* Add card button if less than 2 cards */}
            {selectedCards.length < 2 && (
              <button
                className="w-48 md:w-64 h-80 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-gray-200 hover:border-gray-400"
                onClick={() => setShowSelector(true)}
              >
                <Plus size={32} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card selector modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Select Cards to Add</h3>
              <button 
                className="p-1 rounded-full bg-gray-800 text-gray-400"
                onClick={() => setShowSelector(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {cards.filter(card => !selectedCards.some(sc => sc.id === card.id)).map(card => (
                <div
                  key={card.id}
                  className="relative cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    addCard(card);
                    setShowSelector(false);
                  }}
                >
                  <img 
                    src={card.thumbnailUrl || card.imageUrl} 
                    alt={card.title} 
                    className="w-full h-auto aspect-[2.5/3.5] object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                    <PlusSquare size={24} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                    <p className="text-xs text-white truncate">{card.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiCardView;
