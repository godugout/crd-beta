
import React, { memo } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CardMedia } from './CardMedia';

interface CardItemProps {
  /**
   * Card data to display
   */
  card: Card;
  
  /**
   * Optional callback for when the card is clicked
   */
  onClick?: () => void;
  
  /**
   * Optional active effects to apply to the card
   */
  activeEffects?: string[];
  
  /**
   * Optional class names to apply to the container
   */
  className?: string;
  
  /**
   * Optional highlight behavior
   */
  highlight?: boolean;
}

export const CardItem = memo(({
  card,
  onClick,
  activeEffects = [],
  className = "",
  highlight = false
}: CardItemProps) => {
  // Combine all active effect classes
  const effectClasses = activeEffects.map(effect => {
    switch (effect) {
      case 'Holographic':
        return 'card-holographic';
      case 'Refractor':
        return 'card-refractor';
      case 'Shimmer':
        return 'card-shimmer';
      case 'Vintage':
        return 'card-vintage';
      default:
        return '';
    }
  }).join(' ');

  return (
    <div
      className={cn(
        'card-container relative transition-transform duration-300 hover:scale-[1.02]',
        highlight && 'ring-2 ring-cardshow-blue ring-offset-2',
        effectClasses,
        className
      )}
      onClick={onClick}
    >
      <CardMedia
        src={card.imageUrl}
        alt={card.title}
      />
      
      <div className="p-2 mt-1">
        <h3 className="font-medium text-sm line-clamp-1">{card.title}</h3>
        
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {card.tags.slice(0, 2).map((tag, i) => (
              <span 
                key={i} 
                className="text-xs px-1.5 py-0.5 bg-cardshow-blue/10 text-cardshow-blue rounded-full"
              >
                {tag}
              </span>
            ))}
            {card.tags.length > 2 && (
              <span className="text-xs text-cardshow-slate">+{card.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

CardItem.displayName = 'CardItem';
