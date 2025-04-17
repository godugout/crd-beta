
import { Card } from '@/lib/types';
import { CardRarity } from '@/lib/types/cardTypes';
import { adaptToCard } from './typeAdapters';

/**
 * Safely adapts any card-like object to a valid Card type
 * For backward compatibility with other adapter patterns
 */
export { adaptToCard } from './typeAdapters';

/**
 * Default design metadata for cards that don't have it
 */
export const DEFAULT_DESIGN_METADATA = {
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
};

/**
 * Create a new card with default values
 */
export function createDefaultCard(partial: Partial<Card> = {}): Card {
  return adaptToCard({
    id: `card-${Date.now()}`,
    title: 'New Card',
    description: '',
    imageUrl: '',
    thumbnailUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'anonymous',
    effects: [],
    rarity: CardRarity.COMMON,
    designMetadata: DEFAULT_DESIGN_METADATA,
    isFavorite: false,
    ...partial
  });
}
