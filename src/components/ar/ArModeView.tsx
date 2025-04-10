
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { toast } from 'sonner';
import CameraView from './CameraView';
import ArControls from './ArControls';
import RadioDial from './RadioDial';
import MouseInteractionLayer from './MouseInteractionLayer';
import CardSelector from './CardSelector';
import ArHeader from './ArHeader';
import ArInfoOverlay from './ArInfoOverlay';
import './arModeEffects.css';
import './ar-animations.css';

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
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (activeCards.length > 0 && !selectedCardId) {
      setSelectedCardId(activeCards[0].id);
    } else if (selectedCardId && !activeCards.some(card => card.id === selectedCardId)) {
      setSelectedCardId(activeCards.length > 0 ? activeCards[0].id : null);
    }
  }, [activeCards, selectedCardId]);

  console.log("ArModeView rendering with activeCards:", activeCards, "selectedCardId:", selectedCardId);

  const handleSelectCard = (id: string) => {
    console.log("Selecting card:", id);
    setSelectedCardId(id);
  };

  const handleUpdateCardPosition = (cardId: string, x: number, y: number, rotation: number) => {
    console.log("Updating card position:", cardId, x, y, rotation);
    setCardPositions(prev => ({
      ...prev,
      [cardId]: { x, y, rotation }
    }));
  };

  const handleToggleCamera = () => {
    setCameraActive(prev => !prev);
    if (!cameraActive) {
      toast.success('AR mode activated', {
        description: 'The camera is now active. Place your cards in the scene.'
      });
    }
  };

  const handleAddCard = (card: Card) => {
    if (activeCards.some(c => c.id === card.id)) {
      toast.info('Card already in scene');
      return;
    }
    
    if (onAddCard) {
      onAddCard(card);
    }
    
    setShowCardSelector(false);
    setSelectedCardId(card.id);
    
    setCardPositions(prev => ({
      ...prev,
      [card.id]: { x: 0, y: 0, rotation: 0 }
    }));
    
    toast.success('Card added to scene');
  };

  const handleRemoveSelected = () => {
    if (!selectedCardId || !onRemoveCard) return;
    
    onRemoveCard(selectedCardId);
    
    if (activeCards.length > 1) {
      const newSelectedId = activeCards.find(c => c.id !== selectedCardId)?.id || null;
      setSelectedCardId(newSelectedId);
    } else {
      setSelectedCardId(null);
    }
    
    setCardPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[selectedCardId];
      return newPositions;
    });
    
    toast.success('Card removed from scene');
  };
  
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
      {cameraActive ? (
        <>
          <CameraView 
            activeCards={activeCards}
            selectedCardId={selectedCardId}
            onSelectCard={handleSelectCard}
            onError={onCameraError}
            cardPositions={cardPositions}
          />
          
          <MouseInteractionLayer
            cards={activeCards}
            selectedCardId={selectedCardId}
            onUpdateCardPosition={handleUpdateCardPosition}
          />
          
          <RadioDial
            cards={activeCards}
            activeCardId={selectedCardId}
            onSelectCard={handleSelectCard}
          />
          
          <ArControls
            onTakeSnapshot={onTakeSnapshot}
            onFlip={onFlip}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onRotate={onRotate}
          />
          
          <ArHeader 
            onExitAr={() => {
              setCameraActive(false);
              onExitAr();
            }}
            onToggleSelector={() => setShowCardSelector(!showCardSelector)}
            onRemoveSelected={handleRemoveSelected}
            selectedCardId={selectedCardId}
          />
          
          <CardSelector
            showCardSelector={showCardSelector}
            availableCards={availableCards}
            onAddCard={handleAddCard}
          />
          
          <ArInfoOverlay 
            selectedCardId={selectedCardId}
            activeCards={activeCards}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black p-6">
          <div className="max-w-lg text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">AR Card Experience</h2>
            <p className="text-gray-300">
              Experience your cards in augmented reality. Move, rotate, and interact with your cards in the real world.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={handleToggleCamera} 
                className="crd-btn-primary flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Start AR Mode
              </button>
              <button 
                onClick={onExitAr} 
                className="crd-btn-outline text-white border-white hover:bg-white hover:bg-opacity-20 hover:text-white"
              >
                Back to Cards
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-4 w-full text-center">
            <p className="text-xs text-gray-400">Camera access required for AR functionality</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArModeView;
