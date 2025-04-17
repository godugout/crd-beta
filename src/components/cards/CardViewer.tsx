
import React, { useState } from 'react';
import { Card } from '@/lib/types';

interface CardViewerProps {
  card: Card;
  isFullscreen?: boolean;
  isFlipped?: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
  showLightingControls?: boolean;
}

const CardViewer: React.FC<CardViewerProps> = ({
  card,
  isFullscreen = false,
  isFlipped = false,
  activeEffects = [],
  effectIntensities = {},
  showLightingControls = false
}) => {
  // Ensure we have a valid URL
  const imageUrl = card?.imageUrl || card?.thumbnailUrl || '/placeholder.svg';

  return (
    <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full max-w-md'}`}>
      <div 
        className={`aspect-[2.5/3.5] overflow-hidden rounded-lg ${isFullscreen ? 'shadow-2xl' : 'shadow-md'}`}
      >
        <div className="w-full h-full relative">
          {/* Card image */}
          <img 
            src={imageUrl}
            alt={card?.title || 'Card'}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          
          {/* Apply effects */}
          {activeEffects?.map((effect, index) => (
            <div 
              key={index}
              className={`absolute inset-0 pointer-events-none effect-${effect.toLowerCase()}`}
              style={{ opacity: effectIntensities?.[effect] || 0.5 }}
            />
          ))}
        </div>
      </div>
      
      {/* Card details (when not fullscreen) */}
      {!isFullscreen && card.title && (
        <div className="mt-2 px-1">
          <h3 className="text-sm font-medium truncate">{card.title}</h3>
          {card.player && <p className="text-xs text-gray-600">{card.player}</p>}
          {card.team && <p className="text-xs text-gray-600">{card.team}</p>}
        </div>
      )}
    </div>
  );
};

export default CardViewer;
