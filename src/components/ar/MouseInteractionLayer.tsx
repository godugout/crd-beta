
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import { useCardPhysics } from '@/hooks/useCardPhysics';
import { RefreshCw } from 'lucide-react';

interface MouseInteractionLayerProps {
  cards: Card[];
  selectedCardId: string | null;
  onUpdateCardPosition: (cardId: string, x: number, y: number, rotation: number) => void;
  onFlipCard?: (cardId: string) => void;
}

const MouseInteractionLayer: React.FC<MouseInteractionLayerProps> = ({
  cards,
  selectedCardId,
  onUpdateCardPosition,
  onFlipCard
}) => {
  // Using our new physics hook for better movement
  const physics = useCardPhysics({
    dampingFactor: 0.97,
    rotationDampingFactor: 0.96,
    sensitivity: 0.1,
    boundaryConstraints: true // Enable boundary constraints
  });
  
  // Track if user tapped rather than dragged (for flipping)
  const [tapStartTime, setTapStartTime] = useState(0);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const layerRef = useRef<HTMLDivElement>(null);
  
  // Update the card position based on physics state
  useEffect(() => {
    if (!selectedCardId || !physics.isMoving) return;
    
    // Calculate total rotation angle from all axes
    const totalRotation = physics.rotation.x + physics.rotation.y + physics.rotation.z;
    
    // Send position updates to parent component
    onUpdateCardPosition(
      selectedCardId,
      physics.position.x,
      physics.position.y,
      totalRotation
    );
  }, [physics.position, physics.rotation, physics.isMoving, selectedCardId, onUpdateCardPosition]);
  
  // Handle pointer down - start tracking for tap/drag
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!selectedCardId) return;
    
    // Record start time and position for tap detection
    setTapStartTime(Date.now());
    setStartPosition({ x: e.clientX, y: e.clientY });
    
    // Pass to physics engine
    physics.handlePointerDown(e);
  };
  
  // Handle pointer move - update physics
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!selectedCardId) return;
    physics.handlePointerMove(e);
  };
  
  // Handle pointer up - check for tap and release physics
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!selectedCardId) return;
    
    // Check if this was a tap (quick click without much movement)
    const tapDuration = Date.now() - tapStartTime;
    const deltaX = Math.abs(e.clientX - startPosition.x);
    const deltaY = Math.abs(e.clientY - startPosition.y);
    
    // If interaction was a short tap without much movement, treat as a flip request
    if (tapDuration < 300 && deltaX < 10 && deltaY < 10 && onFlipCard) {
      onFlipCard(selectedCardId);
    }
    
    // Release the physics engine
    physics.handlePointerUp();  // Fix: Remove the argument as it's not expected
  };

  // Reset card position when it's off-screen or user wants to reset
  const handleResetCard = () => {
    if (!selectedCardId) return;
    
    physics.resetCard();
    onUpdateCardPosition(selectedCardId, 0, 0, 0);
  };
  
  // Check if card is potentially off-screen
  const isCardOffScreen = (
    Math.abs(physics.position.x) > 500 || 
    Math.abs(physics.position.y) > 500
  );
  
  return (
    <>
      <div 
        ref={layerRef}
        className="absolute inset-0 z-20"
        style={{ touchAction: "none", pointerEvents: selectedCardId ? "auto" : "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* Reset Button */}
      <button 
        className={`absolute top-4 left-4 z-50 p-2 rounded-full bg-black/50 text-white transition-opacity duration-300 ${
          isCardOffScreen ? 'opacity-100' : 'opacity-60 hover:opacity-100'
        }`}
        onClick={handleResetCard}
        title="Reset card position"
      >
        <RefreshCw size={20} />
      </button>
    </>
  );
};

export default MouseInteractionLayer;
