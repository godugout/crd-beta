
import React from 'react';
import { CardData } from '@/types/card';

interface CardFrontProps {
  card: CardData;
  activeEffects?: string[];
}

const CardFront: React.FC<CardFrontProps> = ({ card, activeEffects = [] }) => {
  // Combine all active effects
  const effectClasses = activeEffects.map(effect => `effect-${effect.toLowerCase()}`).join(' ');
  
  return (
    <div className="card-face absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden">
      {/* Card background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-700/10 to-gray-900/20 z-0" />
      
      {/* Card image - ensure it's always visible */}
      <div className="relative w-full h-full z-10">
        <img 
          src={card.imageUrl} 
          alt={card.name || 'Card'} 
          className="w-full h-full object-cover"
          style={{ opacity: 1 }} // Force image to be visible
        />
      </div>
      
      {/* Effects layer - positioned above the image but below text */}
      <div className={`absolute inset-0 pointer-events-none z-20 ${effectClasses}`} />
      
      {/* Card info overlay - highest z-index to ensure visibility */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent z-30">
        <h3 className="font-bold text-white text-lg truncate">{card.name}</h3>
        {card.team && (
          <p className="text-white/80 text-sm truncate">
            {card.team}
            {card.jersey && ` • ${card.jersey}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default CardFront;
