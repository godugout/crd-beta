
import React, { useRef, useEffect } from 'react';
import { CardData } from '@/types/card';
import CardFront from './card-elements/CardFront';
import CardBack from './card-elements/CardBack';
import CardEffectsLayer, { useCardEffects } from './card-elements/CardEffectsLayer';
import RefractorEffect from '../card-effects/RefractorEffect';

interface CardCanvasProps {
  card: CardData;
  isFlipped: boolean;
  activeEffects: string[];
  containerRef: React.RefObject<HTMLDivElement>;
  cardRef: React.RefObject<HTMLDivElement>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({
  card,
  isFlipped,
  activeEffects,
  containerRef,
  cardRef,
  onMouseMove,
  onMouseLeave
}) => {
  // Use the hook directly instead of trying to access methods on a React component
  const effectsLayer = useCardEffects({ activeEffects, isFlipped });
  const cardElementRef = useRef<HTMLDivElement>(null);
  
  // Set CSS variables for mouse position to use in the refractor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardElementRef.current) return;
      
      const rect = cardElementRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      cardElementRef.current.style.setProperty('--mouse-x', `${x}%`);
      cardElementRef.current.style.setProperty('--mouse-y', `${y}%`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Check if refractor effect is active
  const hasRefractorEffect = activeEffects.includes('Refractor');
  
  return (
    <div
      ref={cardRef}
      className={`dynamic-card ${effectsLayer.getCardClasses()}`}
      style={effectsLayer.getFilterStyle()}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div 
        ref={cardElementRef}
        className="card-inner relative w-full h-full"
      >
        {/* Front face of the card */}
        {!isFlipped && <CardFront card={card} />}
        
        {/* Back face of the card */}
        {isFlipped && <CardBack card={card} />}
        
        {/* Refractor WebGL effect overlay */}
        <RefractorEffect 
          active={hasRefractorEffect} 
          intensity={1.0}
          animated={true}
        />
      </div>
    </div>
  );
};

export default CardCanvas;
