
import React from 'react';
import { CardData } from '@/types/card';

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
  const getCardClasses = () => {
    const classes = [
      'w-64 h-96 relative transition-all duration-300 rounded-lg shadow-xl overflow-hidden',
      isFlipped ? 'scale-x-[-1]' : '',
    ];
    
    // Apply all active effects to the card
    if (activeEffects.includes('Classic Holographic')) {
      classes.push('card-holographic');
    }
    
    if (activeEffects.includes('Refractor')) {
      classes.push('card-refractor');
    }
    
    if (activeEffects.includes('Prismatic')) {
      classes.push('card-prismatic');
    }
    
    if (activeEffects.includes('Electric')) {
      classes.push('card-electric');
    }
    
    // Add new effect classes
    if (activeEffects.includes('Gold Foil')) {
      classes.push('card-gold-foil');
    }
    
    if (activeEffects.includes('Chrome')) {
      classes.push('card-chrome');
    }
    
    if (activeEffects.includes('Vintage')) {
      classes.push('card-vintage');
    }
    
    return classes.join(' ');
  };

  const getFilterStyle = () => {
    let filterStyle: React.CSSProperties = {};
    
    // Apply filters based on active effects
    if (activeEffects.includes('Classic Holographic')) {
      filterStyle = {
        ...filterStyle,
        filter: 'contrast(1.1) brightness(1.1) saturate(1.3)',
      };
    }
    
    // Add filter modifications for new effects
    if (activeEffects.includes('Vintage')) {
      filterStyle = {
        ...filterStyle,
        filter: `${filterStyle.filter || ''} sepia(0.3) contrast(0.95) brightness(0.9)`.trim(),
      };
    }
    
    if (activeEffects.includes('Refractor') || activeEffects.includes('Gold Foil') || 
        activeEffects.includes('Chrome') || activeEffects.includes('Prismatic')) {
      filterStyle = {
        ...filterStyle,
        borderRadius: '12px',
      };
    }
    
    // Add card base color
    filterStyle.backgroundColor = card.backgroundColor;
    
    return filterStyle;
  };

  return (
    <div 
      ref={cardRef}
      className={getCardClasses()}
      style={getFilterStyle()}
    >
      {!isFlipped ? (
        card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt={card.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
            {card.name}
          </div>
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl scale-x-[-1]">
          {card.set}
        </div>
      )}
      
      {!isFlipped && !card.imageUrl && (
        <div className="absolute bottom-4 left-4 text-white">
          #{card.jersey}
        </div>
      )}
    </div>
  );
};

export default CardCanvas;
