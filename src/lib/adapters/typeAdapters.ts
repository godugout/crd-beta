
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
    designMetadata: {
      cardStyle: {
        template: 'standard',
        effect: 'standard',
        borderRadius: '8px',
        borderColor: '#000000',
        shadowColor: '#000000',
        frameWidth: 5,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'standard',
        series: 'default',
        cardType: 'standard'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: false
      }
    },
    rarity: 'common',
  };
  
  // Merge provided card with defaults, ensuring all required fields exist
  return {
    ...defaultCardData,
    ...card,
    // Ensure thumbnailUrl has a value if not provided
    thumbnailUrl: card.thumbnailUrl || card.imageUrl || defaultCardData.thumbnailUrl,
    // Ensure designMetadata is an object with required properties
    designMetadata: {
      ...defaultCardData.designMetadata,
      ...card.designMetadata
    },
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

/**
 * Converts an index card to a card types card
 * This handles compatibility between different card schemas
 */
export const convertIndexCardToCardTypesCard = (card: any): Card => {
  return adaptCard(card);
};
