
import { Card } from '@/lib/types';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

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
    rarity: 'common',
    designMetadata: DEFAULT_DESIGN_METADATA,
  };
  
  // Merge provided card with defaults, ensuring all required fields exist
  return {
    ...defaultCardData,
    ...card,
    // Ensure thumbnailUrl has a value if not provided
    thumbnailUrl: card.thumbnailUrl || card.imageUrl || defaultCardData.thumbnailUrl,
    // Ensure designMetadata is an object with required properties
    designMetadata: {
      ...DEFAULT_DESIGN_METADATA,
      ...card.designMetadata
    },
    // Ensure tags is an array
    tags: Array.isArray(card.tags) ? card.tags : [],
    // Ensure effects is an array
    effects: Array.isArray(card.effects) ? card.effects : [],
    // Ensure rarity has a value
    rarity: card.rarity || 'common',
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

/**
 * Converts an index card to a card types card
 * This handles compatibility between different card schemas
 */
export const convertIndexCardToCardTypesCard = (card: any): Card => {
  return adaptCard(card);
};
