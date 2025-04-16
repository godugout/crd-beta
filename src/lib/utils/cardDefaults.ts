
import { DesignMetadata } from '@/lib/types/cardTypes';

// Default design metadata structure for cards
export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: {
    template: 'classic',
    effect: 'classic',
    borderRadius: '4px',
    borderColor: '#000000',
    frameColor: '#000000',
    frameWidth: 2,
    shadowColor: 'rgba(0, 0, 0, 0.4)'
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'left',
    titleWeight: 'bold',
    descriptionColor: '#444444'
  },
  marketMetadata: {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false
  },
  cardMetadata: {
    category: 'general',
    cardType: 'standard',
    series: 'base'
  }
};

// Default card property values
export const DEFAULT_CARD_VALUES = {
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: 'anonymous',
  tags: [],
  effects: []
};

// Fallback image URL for missing card images
export const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

// Helper function to get a fallback image URL based on card tags or title
export function getFallbackImageUrl(tags?: string[], title?: string): string {
  // In a real app, you might use tags or title to get a more relevant fallback image
  return FALLBACK_IMAGE_URL;
}
