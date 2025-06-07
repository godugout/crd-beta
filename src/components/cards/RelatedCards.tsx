
import React from 'react';
import { Card } from '@/lib/types/cardTypes';
import { cn } from '@/lib/utils';
import CardThumbnail from './CardThumbnail';

interface RelatedCardsProps {
  /**
   * List of related cards to display
   */
  cards: Card[];
  
  /**
   * Current card ID to exclude from related cards
   */
  currentCardId: string;
  
  /**
   * Function to call when a card is clicked
   */
  onCardClick: (cardId: string) => void;
  
  /**
   * Optional className for styling
   */
  className?: string;
  
  /**
   * Title to display above the related cards
   * @default "Related Cards"
   */
  title?: string;
  
  /**
   * Maximum number of related cards to display
   * @default 4
   */
  maxCards?: number;
}

/**
 * Component for displaying a grid of related cards
 */
export const RelatedCards: React.FC<RelatedCardsProps> = ({
  cards,
  currentCardId,
  onCardClick,
  className,
  title = "Related Cards",
  maxCards = 4,
}) => {
  // Filter out the current card and limit to maxCards
  const relatedCards = cards
    .filter(card => card.id !== currentCardId)
    .slice(0, maxCards);
  
  if (relatedCards.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {relatedCards.map((card) => (
          <CardThumbnail
            key={card.id}
            card={card}
            onClick={() => onCardClick(card.id)}
            className="border hover:shadow-md transition-shadow"
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedCards;
