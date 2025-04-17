
import { Card } from '@/lib/types';
import { CardRarity } from '@/lib/types/cardTypes';

/**
 * Utility function to convert a string ID to a Card object
 * Used primarily for type conversion when passing string IDs to functions expecting Card objects
 */
export const cardIdToCard = (cardId: string): Card => {
  return {
    id: cardId,
    title: `Card ${cardId.slice(-4)}`,
    imageUrl: '',
    thumbnailUrl: '', // Add required thumbnailUrl
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    description: '', // Add required description
    isFavorite: false, // Add required isFavorite
    rarity: CardRarity.COMMON, // Explicitly use enum value
    tags: [],
    userId: 'user-default'
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
    description: '',
    imageUrl: '',
    thumbnailUrl: '', // Add thumbnailUrl
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    isFavorite: false,
    tags: [],
    userId: 'anonymous',
    rarity: CardRarity.COMMON // Use enum value
  };
};
