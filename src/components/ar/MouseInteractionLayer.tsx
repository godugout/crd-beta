
import React from 'react';
import { Card } from '@/lib/types';
import MouseTrail from './card-elements/MouseTrail';
import { useMouseInteraction } from './hooks/useMouseInteraction';

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
  console.log("MouseInteractionLayer rendering with cards:", cards, "selectedCardId:", selectedCardId);
  
  const {
    isDragging,
    mouseMoveSpeed,
    lastMousePos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useMouseInteraction({
    cards,
    selectedCardId,
    onUpdateCardPosition
  });

  return (
    <div 
      className="absolute inset-0 z-30 cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Visualize the mouse speed as a subtle glow/trail */}
      <MouseTrail 
        isDragging={isDragging && selectedCardId !== null}
        mouseMoveSpeed={mouseMoveSpeed}
        position={lastMousePos}
      />
    </div>
  );
};

export default MouseInteractionLayer;
