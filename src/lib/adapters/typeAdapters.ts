
import { Card, CardRarity } from '@/lib/types';

/**
 * Safely adapts any card-like object to a valid Card type
 * Ensures all required properties are present
 * 
 * @param cardData Partial card object to adapt
 * @returns Complete Card object with all required properties
 */
export const adaptToCard = (cardData: Partial<Card>): Card => {
  // Ensure the rarity is a valid CardRarity enum value
  let rarity = cardData.rarity || CardRarity.COMMON;
  
  // If rarity is a string, convert it to the enum
  if (typeof rarity === 'string') {
    rarity = ensureCardRarity(rarity);
  }
  
  // Create a card with all required properties
  const card: Card = {
    id: cardData.id || `card-${Date.now()}`,
    title: cardData.title || 'Untitled Card',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    userId: cardData.userId || 'anonymous',
    effects: cardData.effects || [],
    isFavorite: cardData.isFavorite !== undefined ? cardData.isFavorite : false,
    tags: cardData.tags || [],
    rarity: rarity,
    designMetadata: cardData.designMetadata || {}
  };
  
  return card;
};

/**
 * Function to ensure a CardRarity enum is used rather than a string
 * This is crucial for type safety throughout the application
 * 
 * @param rarity String or CardRarity enum
 * @returns Properly typed CardRarity enum
 */
export const ensureCardRarity = (rarity: string | CardRarity | undefined): CardRarity => {
  if (rarity === undefined) return CardRarity.COMMON;
  
  if (typeof rarity === 'string') {
    switch (rarity.toLowerCase()) {
      case 'common':
        return CardRarity.COMMON;
      case 'uncommon':
        return CardRarity.UNCOMMON;
      case 'rare':
        return CardRarity.RARE;
      case 'ultra-rare':
      case 'ultra_rare':
        return CardRarity.ULTRA_RARE;
      case 'legendary':
        return CardRarity.LEGENDARY;
      case 'mythic':
        return CardRarity.MYTHIC;
      case 'one-of-one':
      case 'one_of_one':
        return CardRarity.ONE_OF_ONE;
      default:
        return CardRarity.COMMON;
    }
  }
  
  return rarity;
};

/**
 * Type guard to check if an object is a valid Card
 */
export const isCard = (obj: any): obj is Card => {
  return obj && 
    typeof obj === 'object' && 
    typeof obj.id === 'string' && 
    typeof obj.title === 'string' && 
    typeof obj.description === 'string' && 
    typeof obj.imageUrl === 'string' && 
    Array.isArray(obj.effects);
};

/**
 * Type guard to check if an object is a valid Collection
 */
export const isCollection = (obj: any): obj is any => {
  return obj && 
    typeof obj === 'object' && 
    typeof obj.id === 'string' && 
    typeof obj.name === 'string';
};

/**
 * Type guard to check if an object is a valid User
 */
export const isUser = (obj: any): obj is any => {
  return obj && 
    typeof obj === 'object' && 
    typeof obj.id === 'string' && 
    typeof obj.email === 'string';
};

/**
 * Type guard to check if an object is valid OaklandMemoryData
 */
export const isOaklandMemoryData = (obj: any): obj is any => {
  return obj && 
    typeof obj === 'object' && 
    typeof obj.title === 'string' && 
    typeof obj.description === 'string';
};
