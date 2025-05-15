
import { Card } from '@/lib/types/cardTypes';
import { CardData } from '@/types/card';

/**
 * Adapts a card object to a standardized schema
 */
export const adaptCardToSchema = (card: Card | CardData): Card => {
  return {
    id: card.id,
    title: card.title,
    description: card.description || '',
    imageUrl: card.imageUrl,
    thumbnailUrl: card.thumbnailUrl || card.imageUrl,
    tags: card.tags || [],
    userId: card.userId,
    effects: card.effects || [],
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    designMetadata: 'designMetadata' in card ? card.designMetadata : {
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
};

/**
 * Convert arbitrary data to a Card object
 */
export const adaptToCard = (data: any): Card => {
  return {
    id: data.id || crypto.randomUUID(),
    title: data.title || 'Untitled Card',
    description: data.description || '',
    imageUrl: data.imageUrl || '/images/card-placeholder.png',
    thumbnailUrl: data.thumbnailUrl || data.imageUrl || '/images/card-placeholder.png',
    tags: Array.isArray(data.tags) ? data.tags : [],
    userId: data.userId || 'anonymous',
    effects: Array.isArray(data.effects) ? data.effects : [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
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
};

export default adaptToCard;
