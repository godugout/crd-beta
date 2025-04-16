
import React from 'react';
import { Card as CardType } from '@/lib/types';
import { cn } from '@/lib/utils';
import CardThumbnail from './CardThumbnail';

interface CardProps {
  /**
   * Card data to display
   */
  card: CardType;
  
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
}

/**
 * Standard card component that displays a card with its thumbnail
 */
const Card: React.FC<CardProps> = ({
  card,
  className,
  onClick,
  enableEffects = false,
  activeEffects = []
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(card.id);
    }
  };

  return (
    <div 
      className={cn("relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow", 
        className
      )}
      onClick={handleClick}
    >
      <CardThumbnail
        src={card.thumbnailUrl || card.imageUrl}
        alt={card.title}
        className="aspect-[2.5/3.5] w-full"
      />
      
      <div className="p-3">
        <h3 className="font-medium text-base truncate">{card.title}</h3>
        {card.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{card.description}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
