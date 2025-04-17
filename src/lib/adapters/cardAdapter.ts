
import { Card } from '@/lib/types';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

/**
 * Adapts any card-like object to the standard Card type
 */
export const adaptToCard = (card: any): Card => {
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
    designMetadata: DEFAULT_DESIGN_METADATA
  };
  
  // Merge provided card with defaults, ensuring all required fields exist
  const adaptedCard = {
    ...defaultCardData,
    ...card,
    // Ensure thumbnailUrl has a value if not provided
    thumbnailUrl: card.thumbnailUrl || card.imageUrl || defaultCardData.thumbnailUrl,
    // Ensure tags is an array
    tags: Array.isArray(card.tags) ? card.tags : [],
    // Ensure effects is an array
    effects: Array.isArray(card.effects) ? card.effects : [],
    // Ensure rarity has a value
    rarity: card.rarity || 'common',
    // Ensure designMetadata is properly structured with required fields
    designMetadata: {
      ...DEFAULT_DESIGN_METADATA,
      ...card.designMetadata
    }
  };
  
  return adaptedCard as Card;
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
