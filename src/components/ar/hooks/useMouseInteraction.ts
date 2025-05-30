
import { useState, useEffect } from 'react';
import { Card } from '@/lib/types';

export interface CardPosition {
  x: number;
  y: number;
  rotation: number;
}

interface UseMouseInteractionProps {
  cards: Card[];
  selectedCardId: string | null;
  onUpdateCardPosition: (cardId: string, x: number, y: number, rotation: number) => void;
}

export const useMouseInteraction = ({
  cards,
  selectedCardId,
  onUpdateCardPosition
}: UseMouseInteractionProps) => {
  const [positions, setPositions] = useState<Record<string, CardPosition>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [mouseMoveSpeed, setMouseMoveSpeed] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [lastMoveTime, setLastMoveTime] = useState(0);

  console.log("useMouseInteraction hook with cards:", cards, "selectedCardId:", selectedCardId);

  // Initialize positions for all cards - centered by default
  useEffect(() => {
    const initialPositions: Record<string, CardPosition> = {};
    cards.forEach((card) => {
      if (!positions[card.id]) {
        initialPositions[card.id] = {
          x: 0,
          y: 0,
          rotation: 0
        };
      }
    });
    
    if (Object.keys(initialPositions).length > 0) {
      console.log("Initializing positions for cards:", initialPositions);
      setPositions(prev => ({ ...prev, ...initialPositions }));
    }
  }, [cards]);

  // Calculate mouse speed
  const calculateMouseSpeed = (x: number, y: number, time: number) => {
    if (time - lastMoveTime === 0) return;
    
    const deltaX = x - lastMousePos.x;
    const deltaY = y - lastMousePos.y;
    const deltaTime = time - lastMoveTime;
    
    const speedX = Math.abs(deltaX) / deltaTime * 100;
    const speedY = Math.abs(deltaY) / deltaTime * 100;
    
    setMouseMoveSpeed({ x: speedX, y: speedY });
    setLastMousePos({ x, y });
    setLastMoveTime(time);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedCardId) return;
    
    console.log("Mouse down on card:", selectedCardId);
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setLastMousePos({ x: e.clientX, y: e.clientY });
    setLastMoveTime(Date.now());
    
    // Prevent default to avoid text selection
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Always calculate mouse speed for spin effect
    calculateMouseSpeed(e.clientX, e.clientY, Date.now());
    
    if (isDragging && selectedCardId) {
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;
      
      // Apply a sensitivity factor to make movement smoother
      const sensitivity = 0.5;
      const moveX = deltaX * sensitivity;
      const moveY = deltaY * sensitivity;
      
      // Update position in local state
      setPositions(prev => {
        const newPositions = { ...prev };
        if (newPositions[selectedCardId]) {
          newPositions[selectedCardId] = {
            ...newPositions[selectedCardId],
            x: newPositions[selectedCardId].x + moveX,
            y: newPositions[selectedCardId].y + moveY
          };
        }
        return newPositions;
      });
      
      // Notify parent component
      if (positions[selectedCardId]) {
        const pos = positions[selectedCardId];
        onUpdateCardPosition(
          selectedCardId,
          pos.x + moveX,
          pos.y + moveY,
          pos.rotation
        );
      }
      
      // Reset drag start position
      setDragStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Apply spin based on mouse speed
    if (selectedCardId && (mouseMoveSpeed.x > 10 || mouseMoveSpeed.y > 10)) {
      const speed = Math.max(mouseMoveSpeed.x, mouseMoveSpeed.y);
      const rotationDelta = Math.min(speed * 2, 90); // Cap the rotation to avoid extreme spins
      
      setPositions(prev => {
        const newPositions = { ...prev };
        if (newPositions[selectedCardId]) {
          const newRotation = newPositions[selectedCardId].rotation + rotationDelta;
          newPositions[selectedCardId] = {
            ...newPositions[selectedCardId],
            rotation: newRotation
          };
          
          // Notify parent
          onUpdateCardPosition(
            selectedCardId,
            newPositions[selectedCardId].x,
            newPositions[selectedCardId].y,
            newRotation
          );
        }
        return newPositions;
      });
    }
  };

  return {
    isDragging,
    mouseMoveSpeed,
    lastMousePos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
