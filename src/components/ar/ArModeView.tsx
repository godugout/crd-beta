
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Share2, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/lib/types';
import { toast } from 'sonner';
import CameraView from './CameraView';
import ArControls from './ArControls';
import RadioDial from './RadioDial';
import MouseInteractionLayer from './MouseInteractionLayer';

interface ArModeViewProps {
  activeCards: Card[];
  availableCards: Card[];
  onExitAr: () => void;
  onCameraError: (message: string) => void;
  onTakeSnapshot: () => void;
  onFlip: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onAddCard?: (card: Card) => void;
  onRemoveCard?: (cardId: string) => void;
}

interface CardPosition {
  x: number;
  y: number;
  rotation: number;
}

const ArModeView: React.FC<ArModeViewProps> = ({
  activeCards,
  availableCards,
  onExitAr,
  onCameraError,
  onTakeSnapshot,
  onFlip,
  onZoomIn,
  onZoomOut,
  onRotate,
  onAddCard,
  onRemoveCard
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    activeCards.length > 0 ? activeCards[0].id : null
  );
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [cardPositions, setCardPositions] = useState<Record<string, CardPosition>>({});

  const handleSelectCard = (id: string) => {
    setSelectedCardId(id);
  };

  const handleUpdateCardPosition = (cardId: string, x: number, y: number, rotation: number) => {
    setCardPositions(prev => ({
      ...prev,
      [cardId]: { x, y, rotation }
    }));
  };

  const handleAddCard = (card: Card) => {
    // If the card is already in the scene, don't add it again
    if (activeCards.some(c => c.id === card.id)) {
      toast.info('Card already in scene');
      return;
    }
    
    // Call the parent handler
    if (onAddCard) {
      onAddCard(card);
    }
    
    setShowCardSelector(false);
    setSelectedCardId(card.id);
    
    // Initialize position for the new card
    setCardPositions(prev => ({
      ...prev,
      [card.id]: { x: 0, y: 0, rotation: 0 }
    }));
    
    // Provide feedback
    toast.success('Card added to scene');
  };

  const handleRemoveSelected = () => {
    if (!selectedCardId || !onRemoveCard) return;
    
    // Call the parent handler
    onRemoveCard(selectedCardId);
    
    // Select another card if available
    if (activeCards.length > 1) {
      const newSelectedId = activeCards.find(c => c.id !== selectedCardId)?.id || null;
      setSelectedCardId(newSelectedId);
    } else {
      setSelectedCardId(null);
    }
    
    // Remove card position data
    setCardPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[selectedCardId];
      return newPositions;
    });
    
    toast.success('Card removed from scene');
  };
  
  // Handle click outside card selector to close it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showCardSelector) {
        const target = e.target as HTMLElement;
        if (!target.closest('.card-selector')) {
          setShowCardSelector(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCardSelector]);

  return (
    <div className="relative h-screen w-screen bg-black">
      {/* AR Camera View */}
      <CameraView 
        activeCards={activeCards}
        selectedCardId={selectedCardId}
        onSelectCard={handleSelectCard}
        onError={onCameraError}
        cardPositions={cardPositions}
      />
      
      {/* Mouse Interaction Layer */}
      <MouseInteractionLayer
        cards={activeCards}
        selectedCardId={selectedCardId}
        onUpdateCardPosition={handleUpdateCardPosition}
      />
      
      {/* Radio Dial for card navigation */}
      <RadioDial
        cards={activeCards}
        activeCardId={selectedCardId}
        onSelectCard={handleSelectCard}
      />
      
      {/* AR Controls */}
      <ArControls
        onTakeSnapshot={onTakeSnapshot}
        onFlip={onFlip}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onRotate={onRotate}
      />
      
      {/* Add/Remove Card Buttons */}
      <div className="absolute top-16 right-4 z-50 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/50 text-white border-white/20 transition-all hover:bg-black/70"
          onClick={() => setShowCardSelector(!showCardSelector)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        {selectedCardId && (
          <Button
            variant="outline"
            size="icon"
            className="bg-black/50 text-white border-white/20 transition-all hover:bg-black/70"
            onClick={handleRemoveSelected}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Card Selector with animation */}
      {showCardSelector && (
        <div className="absolute right-4 top-28 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 w-64 max-h-80 overflow-y-auto card-selector animate-fadeIn">
          <h3 className="font-semibold mb-3">Add Card to Scene</h3>
          <div className="space-y-2">
            {availableCards.map((card, index) => (
              <div 
                key={card.id}
                className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors card-appear"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => handleAddCard(card)}
              >
                <div className="w-8 h-12 bg-gray-200 rounded overflow-hidden mr-2">
                  <img 
                    src={card.imageUrl} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-sm truncate">{card.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Exit AR Button */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 left-4 z-50 bg-black/50 text-white border-white/20 transition-all hover:bg-black/70"
        onClick={onExitAr}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Exit AR
      </Button>
      
      {/* Share Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-50 bg-black/50 text-white border-white/20 transition-all hover:bg-black/70"
        onClick={() => toast.success('Sharing options opened')}
      >
        <Share2 className="h-4 w-4" />
      </Button>
      
      {/* Mouse instructions */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
        Mouse drag to move • Fast mouse movement to spin cards
      </div>
      
      {/* Info overlay for selected card */}
      {selectedCardId && (
        <div className="absolute bottom-20 left-4 right-4 z-40 bg-black/40 backdrop-blur-sm text-white p-3 rounded-lg animate-fadeIn">
          <div className="text-sm">
            <p className="font-semibold">{activeCards.find(c => c.id === selectedCardId)?.title}</p>
            <p className="text-xs text-white/70 mt-0.5">{activeCards.find(c => c.id === selectedCardId)?.description}</p>
          </div>
          <div className="text-xs text-white/70 mt-2">
            <p>Use the dial to cycle through cards • Drag to position • Move mouse quickly to spin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArModeView;
