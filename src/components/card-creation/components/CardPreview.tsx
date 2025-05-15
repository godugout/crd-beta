
import React, { forwardRef } from 'react';
import { Card } from '@/lib/types/cardTypes';

interface CardPreviewProps {
  card: Partial<Card>;
  className?: string;
}

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ card, className }, ref) => {
  // Safely access nested properties with fallbacks
  const cardStyle = card.designMetadata?.cardStyle || {};
  const textStyle = card.designMetadata?.textStyle || {};
  
  // Card style properties with fallbacks
  const borderRadius = cardStyle.borderRadius || '8px';
  const borderWidth = cardStyle.borderWidth || 2;
  const borderStyle = 'solid';
  const borderColor = cardStyle.borderColor || '#000000';
  const backgroundColor = cardStyle.backgroundColor || '#FFFFFF';
  
  // Text style properties with fallbacks
  const titleColor = textStyle.titleColor || '#000000';
  const titleAlignment = textStyle.titleAlignment || 'center';
  const titleWeight = textStyle.titleWeight || 'bold';
  const descriptionColor = textStyle.descriptionColor || '#333333';

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius,
        borderWidth,
        borderStyle,
        borderColor,
        backgroundColor,
        transition: 'all 0.3s ease',
        aspectRatio: '5/7',
      }}
    >
      {/* Card Image */}
      {card.imageUrl && (
        <div className="w-full h-3/5 overflow-hidden">
          <img 
            src={card.imageUrl} 
            alt={card.title || 'Card'} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Card Title */}
      <div className="p-4">
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ 
            color: titleColor,
            textAlign: titleAlignment as any,
            fontWeight: titleWeight,
          }}
        >
          {card.title || 'Untitled Card'}
        </h3>
        
        {/* Card Description */}
        {card.description && (
          <p 
            className="text-sm"
            style={{ color: descriptionColor }}
          >
            {card.description}
          </p>
        )}
        
        {/* Card Details */}
        <div className="mt-3 text-xs space-y-1">
          {card.player && <div><span className="opacity-70">Player: </span>{card.player}</div>}
          {card.team && <div><span className="opacity-70">Team: </span>{card.team}</div>}
          {card.year && <div><span className="opacity-70">Year: </span>{card.year}</div>}
        </div>
        
        {/* Card Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {card.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-gray-100 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Effects Overlay */}
      {card.effects && card.effects.length > 0 && (
        <div className={`absolute inset-0 pointer-events-none ${card.effects.join(' ')}`} />
      )}
    </div>
  );
});

CardPreview.displayName = 'CardPreview';

export default CardPreview;
