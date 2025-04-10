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
        onExitAr={onExitAr}
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
    </div>
  );
};

export default ArModeView;
