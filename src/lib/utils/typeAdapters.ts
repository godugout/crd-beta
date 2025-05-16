
/**
 * Type conversion utility functions for CardShow (CRD) application
 */
import { ElementType, ElementCategory } from '@/lib/types/cardElements';
import { CardMetadata, CardStyle, Card, DEFAULT_CARD_METADATA, ensureValidCardMetadata } from '@/lib/types/cardTypes';
import { CardData } from '@/types/card';

/**
 * Map string to ElementCategory enum
 * @param category Category string
 * @returns ElementCategory enum value
 */
export function mapToElementCategory(category: string): ElementCategory {
  if (Object.values(ElementCategory).includes(category as ElementCategory)) {
    return category as ElementCategory;
  }
  
  // Default to STICKERS if not found
  return ElementCategory.STICKERS;
}

/**
 * Map string to ElementType enum
 * @param type Type string
 * @returns ElementType enum value
 */
export function mapToElementType(type: string): ElementType {
  if (Object.values(ElementType).includes(type as ElementType)) {
    return type as ElementType;
  }
  
  // Default to Sticker if not found
  return ElementType.Sticker;
}

/**
 * Convert Record to CardMetadata ensuring required fields
 * @param data Record data
 * @returns Valid CardMetadata
 */
export function mapToCardMetadata(data: Record<string, any> | undefined): CardMetadata {
  if (!data) {
    return { ...DEFAULT_CARD_METADATA };
  }
  
  return ensureValidCardMetadata(data);
}

/**
 * Create a minimal Card object from essential data
 * @param data Basic card data
 * @returns Card object with default values
 */
export function createMinimalCard(data: {
  id: string;
  title: string;
  imageUrl: string;
  userId?: string;
}): Card {
  const now = new Date().toISOString();
  
  return {
    id: data.id,
    title: data.title,
    description: '',
    imageUrl: data.imageUrl,
    thumbnailUrl: data.imageUrl,
    userId: data.userId,
    createdAt: now,
    updatedAt: now,
    tags: [],
    isPublic: false,
    designMetadata: {
      cardStyle: {},
      textStyle: {},
      cardMetadata: { ...DEFAULT_CARD_METADATA },
      marketMetadata: {}
    }
  };
}

/**
 * Convert CardData to Card for backward compatibility
 * @param cardData Legacy CardData format
 * @returns Card in new format
 */
export function convertCardDataToCard(cardData: CardData): Card {
  return {
    id: cardData.id,
    title: cardData.title,
    description: cardData.description || '',
    imageUrl: cardData.imageUrl,
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl,
    userId: cardData.userId,
    ownerId: cardData.ownerId,
    createdAt: cardData.createdAt,
    updatedAt: cardData.updatedAt,
    tags: cardData.tags || [],
    effects: cardData.effects || [],
    isPublic: true,
    player: cardData.player || cardData.name,
    team: cardData.team,
    year: cardData.year,
    cardType: cardData.cardType,
    set: cardData.set,
    artist: cardData.artist,
    cardNumber: cardData.cardNumber,
    backgroundColor: cardData.backgroundColor,
    specialEffect: cardData.specialEffect,
    designMetadata: cardData.designMetadata || {
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
      cardMetadata: { ...DEFAULT_CARD_METADATA },
      marketMetadata: {}
    }
  };
}
