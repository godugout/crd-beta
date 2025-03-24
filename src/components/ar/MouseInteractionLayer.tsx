
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { motion } from 'framer-motion';

interface MouseInteractionLayerProps {
  cards: Card[];
  selectedCardId: string | null;
  onUpdateCardPosition: (cardId: string, x: number, y: number, rotation: number) => void;
}

interface CardPosition {
  x: number;
  y: number;
  rotation: number;
}

const MouseInteractionLayer: React.FC<MouseInteractionLayerProps> = ({
  cards,
  selectedCardId,
  onUpdateCardPosition
}) => {
  const [positions, setPositions] = useState<Record<string, CardPosition>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [mouseMoveSpeed, setMouseMoveSpeed] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [lastMoveTime, setLastMoveTime] = useState(0);

  // Initialize positions for all cards
  useEffect(() => {
    const initialPositions: Record<string, CardPosition> = {};
    cards.forEach((card, i) => {
      if (!positions[card.id]) {
        initialPositions[card.id] = {
          x: 0,
          y: 0,
          rotation: 0
        };
      }
    });
    
    setPositions(prev => ({ ...prev, ...initialPositions }));
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
    
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setLastMousePos({ x: e.clientX, y: e.clientY });
    setLastMoveTime(Date.now());
    
    // Change cursor
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Always calculate mouse speed for spin effect
    calculateMouseSpeed(e.clientX, e.clientY, Date.now());
    
    if (isDragging && selectedCardId) {
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;
      
      // Update position in local state
      setPositions(prev => {
        const newPositions = { ...prev };
        if (newPositions[selectedCardId]) {
          newPositions[selectedCardId] = {
            ...newPositions[selectedCardId],
            x: newPositions[selectedCardId].x + deltaX * 0.05,
            y: newPositions[selectedCardId].y + deltaY * 0.05
          };
        }
        return newPositions;
      });
      
      // Notify parent component
      if (positions[selectedCardId]) {
        const pos = positions[selectedCardId];
        onUpdateCardPosition(
          selectedCardId,
          pos.x + deltaX * 0.05,
          pos.y + deltaY * 0.05,
          pos.rotation
        );
      }
      
      // Reset drag start position
      setDragStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
    
    // Apply spin based on mouse speed
    if (selectedCardId && (mouseMoveSpeed.x > 10 || mouseMoveSpeed.y > 10)) {
      const speed = Math.max(mouseMoveSpeed.x, mouseMoveSpeed.y);
      const rotationDelta = speed * 2; // Scale spin based on mouse speed
      
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

  return (
    <div 
      className="absolute inset-0 z-30"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Visualize the mouse speed as a subtle glow/trail */}
      {isDragging && selectedCardId && (
        <motion.div
          className="pointer-events-none fixed rounded-full bg-blue-500 opacity-20 blur-md"
          initial={{ width: 20, height: 20 }}
          animate={{ 
            width: 20 + Math.min(mouseMoveSpeed.x + mouseMoveSpeed.y, 100),
            height: 20 + Math.min(mouseMoveSpeed.x + mouseMoveSpeed.y, 100)
          }}
          style={{
            left: lastMousePos.x,
            top: lastMousePos.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
    </div>
  );
};

export default MouseInteractionLayer;
