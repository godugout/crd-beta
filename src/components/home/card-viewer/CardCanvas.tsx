
import React from 'react';
import { CardData } from '@/types/card';
import CardFront from './card-elements/CardFront';
import CardBack from './card-elements/CardBack';
import CardEffectsLayer from './card-elements/CardEffectsLayer';

interface CardCanvasProps {
  card: CardData;
  isFlipped: boolean;
  activeEffects: string[];
  containerRef: React.RefObject<HTMLDivElement>;
  cardRef: React.RefObject<HTMLDivElement>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

const CardCanvas = ({ 
  card, 
  isFlipped, 
  activeEffects,
  containerRef,
  cardRef,
  onMouseMove,
  onMouseLeave
}: CardCanvasProps) => {
  const { getCardClasses, getFilterStyle } = CardEffectsLayer({ activeEffects, isFlipped });

  // Add card background color to the filter styles
  const combinedStyle = {
    ...getFilterStyle(),
    backgroundColor: card.backgroundColor
  };

  return (
    <div 
      ref={cardRef}
      className={getCardClasses()}
      style={combinedStyle}
    >
      {!isFlipped ? (
        <CardFront card={card} />
      ) : (
        <CardBack card={card} />
      )}
    </div>
  );
};

export default CardCanvas;
