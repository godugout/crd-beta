
import React from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface CardBaseProps {
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
   * Additional props to pass to the component
   */
  [x: string]: any;
}

/**
 * Base card component that handles common card functionality
 */
export const CardBase: React.FC<CardBaseProps> = ({
  card,
  className,
  onClick,
  enableEffects = false,
  activeEffects = [],
  ...props
}) => {
  const handleCardClick = () => {
    if (onClick) onClick(card.id);
  };

  return (
    <div
      className={cn(
        "card-base relative aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-md cursor-pointer",
        enableEffects && "card-with-effects",
        className
      )}
      onClick={handleCardClick}
      data-card-id={card.id}
      {...props}
    >
      {props.children}
    </div>
  );
};

export default CardBase;
