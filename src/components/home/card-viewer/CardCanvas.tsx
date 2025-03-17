
import React from 'react';
import { CardData } from '@/types/card';
import CardFront from './card-elements/CardFront';
import CardBack from './card-elements/CardBack';
import CardEffectsLayer, { useCardEffects } from './card-elements/CardEffectsLayer';

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
  
  return (
    <div
      ref={cardRef}
      className={`dynamic-card ${effectsLayer.getCardClasses()}`}
      style={effectsLayer.getFilterStyle()}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="card-inner relative w-full h-full">
        {/* Front face of the card */}
        {!isFlipped && <CardFront card={card} />}
        
        {/* Back face of the card */}
        {isFlipped && <CardBack card={card} />}
      </div>
    </div>
  );
};

export default CardCanvas;
