
import React, { useState } from 'react';
import { CardData } from '@/types/card';

interface CardFrontProps {
  card: CardData;
  activeEffects?: string[];
}

const CardFront: React.FC<CardFrontProps> = ({ card, activeEffects = [] }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  
  // Combine all active effects
  const effectClasses = activeEffects.map(effect => `effect-${effect.toLowerCase()}`).join(' ');
  
  // Use a fallback image if the card image isn't loading properly
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
  const imageUrl = card.imageUrl || fallbackImage;
  
  return (
    <div className="card-face absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden">
      {/* Card background with stronger gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-500/20 to-gray-900/40 z-0" />
      
      {/* Loading state */}
      {!isImageLoaded && !isImageError && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center z-50">
          <div className="text-white opacity-50">Loading image...</div>
        </div>
      )}
      
      {/* Error state */}
      {isImageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-50">
          <div className="text-center text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <div>Image Failed to Load</div>
          </div>
        </div>
      )}
      
      {/* Card image with enhanced visibility */}
      <div className="relative w-full h-full z-10">
        <img 
          src={imageUrl} 
          alt={card.name || 'Card'} 
          className="w-full h-full object-cover brightness-110 contrast-105"
          style={{ opacity: isImageLoaded ? 1 : 0 }} 
          onLoad={() => {
            console.log("Card image loaded successfully:", imageUrl);
            setIsImageLoaded(true);
          }}
          onError={(e) => {
            console.error("Image failed to load:", imageUrl);
            if (imageUrl !== fallbackImage) {
              console.log("Trying fallback image");
              (e.currentTarget as HTMLImageElement).src = fallbackImage;
            } else {
              setIsImageError(true);
            }
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
      
      {/* Debug information - remove in production */}
      {false && (
        <div className="absolute top-2 left-2 text-xs text-white bg-black/50 p-1 rounded z-40">
          Image: {isImageLoaded ? '✓' : '✗'} | Effects: {activeEffects.length}
        </div>
      )}
    </div>
  );
};

export default CardFront;
