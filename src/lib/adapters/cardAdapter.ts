
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
