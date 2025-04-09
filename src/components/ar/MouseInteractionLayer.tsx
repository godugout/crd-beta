
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/lib/types';

interface MouseInteractionLayerProps {
  cards: Card[];
  selectedCardId: string | null;
  onUpdateCardPosition: (cardId: string, x: number, y: number, rotation: number) => void;
}

const MouseInteractionLayer: React.FC<MouseInteractionLayerProps> = ({
  cards,
  selectedCardId,
  onUpdateCardPosition
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [lastVelocity, setLastVelocity] = useState({ x: 0, y: 0 });
  const [cardRotation, setCardRotation] = useState(0);
  
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef(0);
  
  // Handle mouse/touch down
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!selectedCardId) return;
    
    setIsDragging(true);
    setStartPosition({
      x: e.clientX,
      y: e.clientY
    });
    
    lastPositionRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    
    lastMoveTimeRef.current = Date.now();
  };
  
  // Handle mouse/touch move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !selectedCardId) return;
    
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    
    setCurrentPosition({
      x: deltaX,
      y: deltaY
    });
    
    // Calculate velocity for card rotation effect
    const now = Date.now();
    const dt = now - lastMoveTimeRef.current;
    
    if (dt > 0) {
      const velocityX = (e.clientX - lastPositionRef.current.x) / dt;
      const velocityY = (e.clientY - lastPositionRef.current.y) / dt;
      
      setLastVelocity({ x: velocityX, y: velocityY });
      
      // Apply rotation based on velocity
      if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
        // Calculate rotation angle based on velocity
        const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        const rotationDelta = speed * 5 * (velocityX > 0 ? 1 : -1);
        
        setCardRotation(prev => prev + rotationDelta);
      }
    }
    
    // Update the card position (debounced to improve performance)
    onUpdateCardPosition(selectedCardId, deltaX, deltaY, cardRotation);
    
    // Update references for next velocity calculation
    lastPositionRef.current = {
      x: e.clientX,
      y: e.clientY
    };
    lastMoveTimeRef.current = now;
  };
  
  // Handle mouse/touch up
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!selectedCardId) return;
    
    setIsDragging(false);
    
    // Final position update
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    
    onUpdateCardPosition(selectedCardId, deltaX, deltaY, cardRotation);
  };
  
  // Reset velocity when card changes
  useEffect(() => {
    setLastVelocity({ x: 0, y: 0 });
    setCardRotation(0);
  }, [selectedCardId]);
  
  return (
    <div 
      className="absolute inset-0 z-20"
      style={{ touchAction: "none", pointerEvents: selectedCardId ? "auto" : "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
};

export default MouseInteractionLayer;
