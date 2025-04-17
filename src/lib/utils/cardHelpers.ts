
import { Card } from '@/lib/types';
import { adaptToCard } from '@/lib/adapters/typeAdapters';

/**
 * Utility function to convert a string ID to a Card object
 * Used primarily for type conversion when passing string IDs to functions expecting Card objects
 */
export const cardIdToCard = (cardId: string): Card => {
  return adaptToCard({
    id: cardId,
    title: `Card ${cardId.slice(-4)}`,
    imageUrl: '',
    description: '', 
    effects: [],
    isFavorite: false
  });
};

/**
 * Helper function to ensure a card is an EnhancedCard type
 */
export const ensureEnhancedCard = (card: Card): any => {
  return {
    ...card,
    views: 0,
    likes: 0,
    shares: 0
  };
};

// Export an alias for backward compatibility
export const cardIdToCardObject = cardIdToCard;
