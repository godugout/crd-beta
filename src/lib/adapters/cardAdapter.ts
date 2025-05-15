
import { Card as CardType } from '@/lib/types/cardTypes';
import { Card as CardSchema } from '@/lib/schema/types';
import { Card as CardData } from '@/types/card';

// Default values for required fields
const DEFAULT_CARD_STYLE = {
  template: 'classic',
  effect: 'none',
  borderRadius: '8px',
  borderColor: '#000000',
  shadowColor: 'rgba(0,0,0,0.2)',
  frameWidth: 2,
  frameColor: '#000000',
};

const DEFAULT_TEXT_STYLE = {
  titleColor: '#000000',
  titleAlignment: 'center',
  titleWeight: 'bold',
  descriptionColor: '#333333',
};

const DEFAULT_DESIGN_METADATA = {
  cardStyle: DEFAULT_CARD_STYLE,
  textStyle: DEFAULT_TEXT_STYLE,
  cardMetadata: {
    edition: 'standard',
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
};

/**
 * Adapts any card-like object to standardized Card type
 */
export function adaptToCard(source: any): CardType {
  if (!source) {
    throw new Error('Cannot adapt null or undefined to Card');
  }
  
  // Default fallback image
  const fallbackImageUrl = '/images/card-placeholder.png';
  
  // Start with base properties that should exist on all card types
  const adaptedCard: CardType = {
    id: source.id || crypto.randomUUID?.() || String(Date.now()),
    title: source.title || source.name || 'Unnamed Card',
    description: source.description || '',
    imageUrl: source.imageUrl || source.image || fallbackImageUrl,
    thumbnailUrl: source.thumbnailUrl || source.imageUrl || source.image || fallbackImageUrl,
    tags: Array.isArray(source.tags) ? source.tags : [],
    createdAt: source.createdAt || new Date().toISOString(),
    updatedAt: source.updatedAt || new Date().toISOString(),
    userId: source.userId || source.creatorId || 'anonymous',
    effects: Array.isArray(source.effects) ? source.effects : [],
    designMetadata: source.designMetadata || DEFAULT_DESIGN_METADATA,
  };
  
  // Ensure designMetadata has all required nested objects
  if (!adaptedCard.designMetadata.cardStyle) {
    adaptedCard.designMetadata.cardStyle = DEFAULT_CARD_STYLE;
  }
  
  if (!adaptedCard.designMetadata.textStyle) {
    adaptedCard.designMetadata.textStyle = DEFAULT_TEXT_STYLE;
  }
  
  if (!adaptedCard.designMetadata.cardMetadata) {
    adaptedCard.designMetadata.cardMetadata = {
      edition: 'standard',
      series: 'base',
      cardType: 'standard',
    };
  }
  
  if (!adaptedCard.designMetadata.marketMetadata) {
    adaptedCard.designMetadata.marketMetadata = {
      price: 0,
      currency: 'USD',
      availableForSale: false,
      editionSize: 0,
      editionNumber: 0
    };
  }
  
  // Copy over other potentially useful properties without type errors
  if (source.player) adaptedCard.player = source.player;
  if (source.team) adaptedCard.team = source.team;
  if (source.year) adaptedCard.year = source.year;
  if (source.set) adaptedCard.set = source.set;
  if (source.fabricSwatches) adaptedCard.fabricSwatches = source.fabricSwatches;
  
  return adaptedCard;
}

/**
 * Adapts an array of card-like objects to standardized Card type
 */
export function adaptCardsArray(sources: any[]): CardType[] {
  if (!Array.isArray(sources)) {
    return [];
  }
  
  return sources
    .filter(source => source != null)
    .map(source => {
      try {
        return adaptToCard(source);
      } catch (error) {
        console.error('Failed to adapt card:', error, source);
        return null;
      }
    })
    .filter((card): card is CardType => card !== null);
}
