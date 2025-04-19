
import React from 'react';
import { CardData } from '@/types/card';

interface CardFrontProps {
  card: CardData;
  activeEffects: string[];
}

const CardFront: React.FC<CardFrontProps> = ({ card, activeEffects = [] }) => {
  // Determine which effects to apply to the card front
  const hasHolographic = activeEffects.includes('Holographic');
  const hasRefractor = activeEffects.includes('Refractor');
  const hasChrome = activeEffects.includes('Chrome');
  const hasGoldFoil = activeEffects.includes('Gold Foil');

  // Build class names based on active effects
  const effectClasses = [
    hasHolographic ? 'effect-holographic' : '',
    hasRefractor ? 'effect-refractor' : '',
    hasChrome ? 'effect-chrome' : '',
    hasGoldFoil ? 'effect-gold-foil' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`card-front w-full h-full rounded-lg overflow-hidden ${effectClasses}`}>
      {/* Card Background Image */}
      <div className="absolute inset-0 bg-no-repeat bg-cover bg-center">
        {card.imageUrl && (
          <img
            src={card.imageUrl}
            alt={card.title || card.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/assets/images/fallback-card.png';
            }}
          />
        )}
      </div>
      
      {/* Apply holographic pattern if that effect is active */}
      {hasHolographic && (
        <div className="absolute inset-0 bg-holographic opacity-50 mix-blend-overlay pointer-events-none" />
      )}
      
      {/* Apply refractor pattern if that effect is active */}
      {hasRefractor && (
        <div className="absolute inset-0 bg-refractor opacity-40 mix-blend-color-dodge pointer-events-none" />
      )}
      
      {/* Card Content Overlay */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="card-header">
          <h3 className="card-title text-lg font-bold text-white drop-shadow-md">
            {card.title || card.name}
          </h3>
          {card.team && (
            <div className="card-team text-sm text-white/90 drop-shadow-md">
              {card.team} | {card.year}
            </div>
          )}
        </div>
        
        <div className="card-footer">
          {card.description && (
            <p className="card-description text-sm text-white drop-shadow-md">
              {card.description}
            </p>
          )}
          
          {/* Card tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {card.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardFront;
