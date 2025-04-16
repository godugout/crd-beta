
import { Card } from '@/lib/types';

/**
 * Adapts a card object to ensure it has all required properties
 * This is useful when dealing with cards from different sources or schemas
 */
export const adaptCard = (card: any): Card => {
  // Default values for required properties
  const defaultCardData: Partial<Card> = {
    title: 'Untitled Card',
    description: '',
    imageUrl: '',
    thumbnailUrl: '',
    tags: [],
    userId: 'anonymous',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    designMetadata: {},
    rarity: 'common',
  };
  
  // Merge provided card with defaults, ensuring all required fields exist
  return {
    ...defaultCardData,
    ...card,
    // Ensure thumbnailUrl has a value if not provided
    thumbnailUrl: card.thumbnailUrl || card.imageUrl || defaultCardData.thumbnailUrl,
    // Ensure designMetadata is an object
    designMetadata: card.designMetadata || {},
    // Ensure tags is an array
    tags: Array.isArray(card.tags) ? card.tags : [],
    // Ensure effects is an array
    effects: Array.isArray(card.effects) ? card.effects : [],
  };
};

/**
 * Type guard to check if an object is a valid Card
 */
export const isCard = (obj: any): obj is Card => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.imageUrl === 'string' &&
    Array.isArray(obj.tags)
  );
};
