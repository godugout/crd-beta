
import { Card as CardType } from '../types/cardTypes';

/**
 * Adapts legacy card data to the current Card type
 */
export function adaptToLegacyCard(card: Partial<CardType>): any {
  return {
    id: card.id || '',
    title: card.title || '',
    description: card.description || '',
    imageUrl: card.imageUrl || '',
    thumbnailUrl: card.thumbnailUrl || card.imageUrl || '',
    tags: card.tags || [],
    userId: card.userId || '',
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
    effects: card.effects || [],
    // Ensure all required nested properties exist
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        frameWidth: 2,
        frameColor: '#000000',
        shadowColor: 'rgba(0,0,0,0.2)',
        ...(card.designMetadata?.cardStyle || {})
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#DDDDDD',
        ...(card.designMetadata?.textStyle || {})
      },
      cardMetadata: {
        ...(card.designMetadata?.cardMetadata || {})
      },
      marketMetadata: {
        ...(card.designMetadata?.marketMetadata || {})
      },
      ...(card.designMetadata || {})
    },
    // Include any other properties from the original card
    ...card
  };
}

/**
 * Adapts a card to match a specific schema format
 */
export function adaptCardToSchema(card: CardType): any {
  return {
    id: card.id,
    title: card.title,
    description: card.description || '',
    imageUrl: card.imageUrl,
    thumbnailUrl: card.thumbnailUrl || card.imageUrl,
    tags: card.tags || [],
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    userId: card.userId,
    effects: card.effects || [],
    designMetadata: card.designMetadata
  };
}

/**
 * Adapts any card format to the current Card type
 */
export function adaptToCard(cardData: any): CardType {
  // Ensure we have at least the basic required properties
  return {
    id: cardData.id || crypto.randomUUID(),
    title: cardData.title || 'Untitled Card',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || cardData.image || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || cardData.image || '',
    tags: cardData.tags || [],
    userId: cardData.userId || cardData.creatorId || '',
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    effects: cardData.effects || [],
    designMetadata: cardData.designMetadata || {
      cardStyle: {
        template: cardData.template || 'classic',
        effect: cardData.effect || 'none',
        borderRadius: cardData.borderRadius || '8px',
        borderColor: cardData.borderColor || '#000000',
        frameWidth: cardData.frameWidth || 2,
        frameColor: cardData.frameColor || '#000000',
        shadowColor: cardData.shadowColor || 'rgba(0,0,0,0.2)',
        backgroundColor: cardData.backgroundColor || '#FFFFFF'
      },
      textStyle: {
        titleColor: cardData.titleColor || cardData.textColor || '#FFFFFF',
        titleAlignment: cardData.titleAlignment || 'center',
        titleWeight: cardData.titleWeight || 'bold',
        descriptionColor: cardData.descriptionColor || '#DDDDDD'
      },
      cardMetadata: {},
      marketMetadata: {}
    }
  };
}
