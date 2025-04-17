import { Card } from '@/lib/types';

/**
 * Utility function to convert a string ID to a Card object
 * Used primarily for type conversion when passing string IDs to functions expecting Card objects
 */
export const cardIdToCard = (cardId: string): Card => {
  return {
    id: cardId,
    title: `Card ${cardId.slice(-4)}`,
    imageUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: []
  };
};

/**
 * Alias for cardIdToCard for backwards compatibility
 * @deprecated Use cardIdToCard instead
 */
export const cardIdToCardObject = cardIdToCard;

/**
 * Helper function to safely get the card description
 * Ensures a string is always returned even if description is undefined
 */
export const getCardDescription = (card: Card | undefined): string => {
  return card?.description || '';
};

/**
 * Helper function to create an empty card object
 */
export const createEmptyCard = (): Card => {
  return {
    id: `card-${Date.now()}`,
    title: 'New Card',
    description: '',  // Ensure description is present
    imageUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    isFavorite: false,  // Add isFavorite
    tags: [],
    userId: 'anonymous'
  };
};
