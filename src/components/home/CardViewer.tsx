
import React from 'react';
import { CardData } from '@/types/card';
import { toast } from 'sonner';
import './CardEffects.css';
import CardCanvas from './card-viewer/CardCanvas';
import CardControls from './card-viewer/CardControls';
import { useCardEffects } from './card-viewer/useCardEffects';

interface CardViewerProps {
  card: CardData;
  isFlipped: boolean;
  flipCard: () => void;
  onBackToCollection: () => void;
  activeEffects: string[];
  onSnapshot: () => void;
}

const CardViewer = ({ 
  card, 
  isFlipped, 
  flipCard, 
  onBackToCollection, 
  activeEffects,
  onSnapshot
}: CardViewerProps) => {
  const { 
    cardRef,
    containerRef,
    canvasRef,
    isMoving,
    handleCanvasMouseMove,
    handleMouseMove,
    handleMouseLeave
  } = useCardEffects();
  
  const handleSnapshot = () => {
    onSnapshot();
    toast.success('Snapshot captured!', {
      description: 'Effect combination saved to gallery'
    });
  };

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-96 md:h-[500px] flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden"
      onMouseMove={handleCanvasMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic background */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
      
      {/* Card container with 3D perspective */}
      <div 
        ref={containerRef}
        className={`card-3d-container relative w-80 h-[450px] flex items-center justify-center transition-transform duration-200 ${isMoving ? 'mouse-move' : 'dynamic-card floating-card'}`}
        onMouseMove={handleMouseMove}
      >
        {/* Card representation */}
        <CardCanvas 
          card={card}
          isFlipped={isFlipped}
          activeEffects={activeEffects}
          containerRef={containerRef}
          cardRef={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      
      {/* Controls */}
      <CardControls 
        flipCard={flipCard}
        onBackToCollection={onBackToCollection}
        onSnapshot={handleSnapshot}
        activeEffectsCount={activeEffects.length}
      />
    </div>
  );
};

export default CardViewer;
