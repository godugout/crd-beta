
import React from 'react';
import { Card as CardType } from '@/lib/types';
import { cn } from '@/lib/utils';
import Card from './Card';

interface CardListProps {
  /**
   * List of cards to display
   */
  cards: CardType[];
  
  /**
   * Function to call when a card is clicked
   */
  onCardClick: (cardId: string) => void;
  
  /**
   * Optional className for styling
   */
  className?: string;
  
  /**
   * Whether to enable card effects
   * @default false
   */
  enableEffects?: boolean;
  
  /**
   * Get active effects for a specific card
   */
  getCardEffects?: (cardId: string) => string[];
}

/**
 * Component for displaying a vertical list of cards
 */
const CardList: React.FC<CardListProps> = ({
  cards,
  onCardClick,
  className,
  enableEffects = false,
  getCardEffects
}) => {
  // Check if there are no cards to display
  if (cards.length === 0) {
    return (
      <div className="p-4 text-center bg-gray-50 rounded-md">
        <p className="text-gray-500">No cards available</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          onClick={onCardClick}
          enableEffects={enableEffects}
          activeEffects={getCardEffects ? getCardEffects(card.id) : []}
          className="border"
        />
      ))}
    </div>
  );
};

export default CardList;
