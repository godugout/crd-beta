
import { Card as CardType } from '@/lib/types/cardTypes';
import { Card as LegacyCard } from '@/lib/types/card';
import { CardData } from '@/types/card';

/**
 * Adapts a card object to ensure it has all the required fields for the Card type
 */
export const adaptToCard = (input: Partial<CardType>): CardType => {
  return {
    id: input.id || `card-${Date.now()}`,
    title: input.title || 'Untitled Card',
    description: input.description || '',
    imageUrl: input.imageUrl || '',
    thumbnailUrl: input.thumbnailUrl || input.imageUrl || '',
    tags: input.tags || [],
    userId: input.userId || 'default-user',
    effects: input.effects || [],
    collectionId: input.collectionId,
    teamId: input.teamId,
    isPublic: input.isPublic ?? true,
    player: input.player || '',
    team: input.team || '',
    year: input.year || '',
    designMetadata: input.designMetadata || {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        frameWidth: 2,
        frameColor: '#000000',
        shadowColor: 'rgba(0,0,0,0.2)',
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#DDDDDD',
      },
      marketMetadata: {},
      cardMetadata: {}
    },
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString(),
  } as CardType;
};

/**
 * Adapts a card object to ensure it has all the required fields for the legacy Card type
 */
export const adaptToLegacyCard = (input: Partial<CardType>): LegacyCard => {
  return {
    id: input.id || `card-${Date.now()}`,
    title: input.title || 'Untitled Card',
    description: input.description || '',
    imageUrl: input.imageUrl || '',
    thumbnailUrl: input.thumbnailUrl || input.imageUrl || '',
    tags: input.tags || [],
    userId: input.userId || 'default-user',
    effects: input.effects || [],
    collectionId: input.collectionId,
    player: input.player || '',
    team: input.team || '',
    year: input.year || '',
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString(),
    designMetadata: input.designMetadata || {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        frameWidth: 2,
        frameColor: '#000000',
        shadowColor: 'rgba(0,0,0,0.2)',
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#DDDDDD',
      },
      marketMetadata: {},
      cardMetadata: {}
    }
  } as LegacyCard;
};

/**
 * Converts a Card to a CardData format (for legacy systems)
 */
export const adaptCardToCardData = (card: Partial<CardType>): CardData => {
  return {
    id: card.id || `card-${Date.now()}`,
    title: card.title || 'Untitled Card',
    description: card.description || '',
    imageUrl: card.imageUrl || '',
    thumbnailUrl: card.thumbnailUrl || card.imageUrl || '',
    tags: card.tags || [],
    userId: card.userId || 'default-user',
    effects: card.effects || [],
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
    name: card.player || card.name || '',
    team: card.team || '',
    jersey: card.jersey || '',
    year: card.year || '',
    set: card.set || '',
    cardType: card.cardType || '',
    designMetadata: card.designMetadata || {
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
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard',
      },
      marketMetadata: {
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 0,
        editionNumber: 0
      }
    }
  } as CardData;
};

/**
 * Converts a legacy CardData to a Card format
 */
export const adaptCardDataToCard = (cardData: CardData): CardType => {
  return adaptToCard({
    id: cardData.id,
    title: cardData.title,
    description: cardData.description,
    imageUrl: cardData.imageUrl,
    thumbnailUrl: cardData.thumbnailUrl,
    tags: cardData.tags,
    userId: cardData.userId,
    effects: cardData.effects,
    player: cardData.name,
    team: cardData.team,
    year: cardData.year,
    jersey: cardData.jersey,
    set: cardData.set,
    cardType: cardData.cardType,
    designMetadata: cardData.designMetadata,
    createdAt: cardData.createdAt,
    updatedAt: cardData.updatedAt
  });
};

/**
 * For adapting cards to specific schemas/formats needed by components
 */
export const adaptCardToSchema = (card: CardType, schemaName?: string): any => {
  // Base adaptation
  const adapted = { ...card };
  
  // Convert description from optional to required if necessary
  if (!adapted.description) {
    adapted.description = '';
  }
  
  return adapted;
};
