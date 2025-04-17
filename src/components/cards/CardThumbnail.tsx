
import React from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import CardBase from './CardBase';

export interface CardThumbnailProps {
  /**
   * Card data to display
   */
  card: Card;
  
  /**
   * Optional className for styling
   */
  className?: string;
  
  /**
   * Function to call when the card is clicked
   */
  onClick?: (cardId: string) => void;
  
  /**
   * Whether to apply special effects to the card
   * @default false
   */
  enableEffects?: boolean;
  
  /**
   * List of effects to apply to the card
   */
  activeEffects?: string[];
  
  /**
   * Whether to show info overlay
   * @default false
   */
  showInfo?: boolean;
}

const CardThumbnail: React.FC<CardThumbnailProps> = ({
  card,
  className,
  onClick,
  enableEffects = false,
  activeEffects = [],
  showInfo = false
}) => {
  // Handle click on the card
  const handleClick = () => {
    if (onClick) {
      onClick(card.id);
    }
  };

  // Use a fallback image if the card image is not available
  const imageUrl = card.thumbnailUrl || card.imageUrl || '/placeholder-card.png';

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300",
        className
      )}
      onClick={handleClick}
    >
      {/* Card Image */}
      <div className="aspect-[2.5/3.5] bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={card.title}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Info Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 flex flex-col justify-end p-3",
          showInfo ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
              {card.tags.length > 3 && (
                <span className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded-full">
                  +{card.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-white font-semibold line-clamp-1">{card.title}</h3>
          
          {/* Description */}
          {card.description && (
            <p className="text-white/80 text-xs line-clamp-2 mt-1">{card.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardThumbnail;
