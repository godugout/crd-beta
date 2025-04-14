
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import { useCardPhysics } from '@/hooks/useCardPhysics';
import { RotateCcw } from 'lucide-react';

interface MouseInteractionLayerProps {
  cards: Card[];
  selectedCardId: string | null;
  onUpdateCardPosition: (cardId: string, x: number, y: number, rotation: number) => void;
  onFlipCard?: (cardId: string) => void;
  onResetCard?: () => void;
}

const MouseInteractionLayer: React.FC<MouseInteractionLayerProps> = ({
  cards,
  selectedCardId,
  onUpdateCardPosition,
  onFlipCard,
  onResetCard
}) => {
  // Using our physics hook with improved parameters for more fluid motion
  const physics = useCardPhysics({
    dampingFactor: 0.95, // Increased from 0.97 for smoother deceleration
    rotationDampingFactor: 0.94, // Increased from 0.96 for more natural rotation
    sensitivity: 0.15,  // Increased from 0.1 for more responsive movement
    autoRotate: false,
    weightlessness: 0.7 // Add weightlessness for more fluid, space-like movement
  });
  
  // Track if user tapped rather than dragged (for flipping)
  const [tapStartTime, setTapStartTime] = useState(0);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [showResetButton, setShowResetButton] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);
  
  // Update the card position based on physics state and check if card is out of view
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
    
    // Show reset button if card moves too far
    const isOutOfView = Math.abs(physics.position.x) > 150 || 
                        Math.abs(physics.position.y) > 150 ||
                        Math.abs(physics.rotation.x) > 45 ||
                        Math.abs(physics.rotation.y) > 45;
                        
    setShowResetButton(isOutOfView);
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
    if (tapDuration < 300 && deltaX < 15 && deltaY < 15 && onFlipCard) {
      onFlipCard(selectedCardId);
    }
    
    // Release the physics engine
    physics.handlePointerUp(e);
    
    // Apply a "flick" effect based on movement speed
    const moveSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const timeDelta = Math.max(1, tapDuration);
    const velocity = moveSpeed / timeDelta;
    
    // If movement was fast enough, apply an additional impulse for better flick feeling
    if (velocity > 0.5) {
      const directionX = (e.clientX - startPosition.x) / Math.max(1, deltaX);
      const directionY = (e.clientY - startPosition.y) / Math.max(1, deltaY);
      
      // Add a spin effect based on the movement direction and speed
      physics.applyImpulse(
        directionX * velocity * 15, 
        directionY * velocity * 15,
        (directionX + directionY) * velocity * 8
      );
    }
  };
  
  // Handle reset button click with animation
  const handleReset = () => {
    if (onResetCard) {
      onResetCard();
    }
    physics.resetCard();
    setShowResetButton(false);
  };
  
  return (
    <>
      <div 
        ref={layerRef}
        className="absolute inset-0 z-40"
        style={{ touchAction: "none", pointerEvents: selectedCardId ? "auto" : "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      
      {/* Reset button - appears when card moves out of view with improved animation */}
      {showResetButton && (
        <button
          className="absolute bottom-6 right-6 z-50 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all animate-fade-in hover:scale-110"
          onClick={handleReset}
          title="Reset card position"
        >
          <RotateCcw size={24} />
        </button>
      )}
    </>
  );
};

export default MouseInteractionLayer;
