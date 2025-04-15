
import React from 'react';
import { CardData } from '@/types/card';

interface CardFrontProps {
  card: CardData;
  activeEffects?: string[];
}

const CardFront: React.FC<CardFrontProps> = ({ card, activeEffects = [] }) => {
  // Combine all active effects
  const effectClasses = activeEffects.map(effect => `effect-${effect.toLowerCase()}`).join(' ');
  
  // For testing purposes, let's use a fallback image if the card image isn't loading properly
  const testImageUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
  const imageUrl = card.imageUrl || testImageUrl;
  
  return (
    <div className="card-face absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden">
      {/* Card background with stronger gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-500/20 to-gray-900/40 z-0" />
      
      {/* Debug outline */}
      <div className="absolute inset-0 border border-dashed border-red-500 opacity-30 z-50 pointer-events-none" />
      
      {/* Card image with enhanced visibility */}
      <div className="relative w-full h-full z-10">
        <img 
          src={imageUrl} 
          alt={card.name || 'Card'} 
          className="w-full h-full object-cover brightness-110 contrast-105"
          style={{ opacity: 1 }} // Force image to be visible
          onError={(e) => {
            console.error("Image failed to load:", imageUrl);
            e.currentTarget.src = testImageUrl;
          }}
        />
      </div>
      
      {/* Light overlay to enhance visibility */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-15" />
      
      {/* Effects layer - positioned above the image but below text */}
      <div className={`absolute inset-0 pointer-events-none z-20 ${effectClasses}`} />
      
      {/* Card info overlay - highest z-index to ensure visibility */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-30">
        <h3 className="font-bold text-white text-lg truncate">{card.name}</h3>
        {card.team && (
          <p className="text-white/80 text-sm truncate">
            {card.team}
            {card.jersey && ` • ${card.jersey}`}
          </p>
        )}
      </div>
      
      {/* Debug information */}
      <div className="absolute top-2 left-2 text-xs text-white bg-black/50 p-1 rounded z-40">
        Image: {card.imageUrl ? '✓' : '✗'} | Effects: {activeEffects.length}
      </div>
    </div>
  );
};

export default CardFront;
