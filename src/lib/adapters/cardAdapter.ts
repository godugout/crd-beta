
import { Card } from '@/lib/types/cardTypes';

/**
 * Adapts a Card object to ensure all required fields are present
 */
export const adaptCardToSchema = (card: Card): Card => {
  // Ensure description exists
  const description = card.description || '';
  
  // Ensure thumbnailUrl exists
  const thumbnailUrl = card.thumbnailUrl || card.imageUrl;
  
  // Ensure designMetadata has all required nested properties
  const designMetadata = {
    cardStyle: {
      template: 'default',
      effect: 'none',
      borderRadius: '12px',
      borderColor: '#000000',
      shadowColor: '#000000',
      frameWidth: 0,
      frameColor: '#000000',
      ...(card.designMetadata?.cardStyle || {})
    },
    textStyle: {
      titleColor: '#000000',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#666666',
      ...(card.designMetadata?.textStyle || {})
    },
    marketMetadata: {
      ...(card.designMetadata?.marketMetadata || {})
    },
    cardMetadata: {
      ...(card.designMetadata?.cardMetadata || {})
    },
    ...(card.designMetadata || {})
  };
  
  return {
    ...card,
    description,
    thumbnailUrl,
    designMetadata
  };
};

/**
 * Adapts any card-like object to a full Card object
 */
export const adaptToCard = (data: any): Card => {
  // Create a base Card with defaults for required fields
  const baseCard: Card = {
    id: data.id || `card-${Date.now()}`,
    title: data.title || 'Untitled Card',
    description: data.description || '',
    imageUrl: data.imageUrl || data.image || '',
    thumbnailUrl: data.thumbnailUrl || data.imageUrl || data.image || '',
    tags: data.tags || [],
    userId: data.userId || data.creator_id || 'unknown',
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
    updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
    effects: data.effects || [],
    designMetadata: data.designMetadata || {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        frameColor: '#000000',
        frameWidth: 2,
        shadowColor: 'rgba(0,0,0,0.2)',
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333',
      },
      cardMetadata: {},
      marketMetadata: {}
    }
  };

  // Add any additional fields from the input data
  return {
    ...baseCard,
    ...data,
    // Ensure these nested objects are properly merged
    designMetadata: {
      ...baseCard.designMetadata,
      ...(data.designMetadata || {}),
      cardStyle: {
        ...baseCard.designMetadata.cardStyle,
        ...(data.designMetadata?.cardStyle || {})
      },
      textStyle: {
        ...baseCard.designMetadata.textStyle,
        ...(data.designMetadata?.textStyle || {})
      }
    }
  };
};
