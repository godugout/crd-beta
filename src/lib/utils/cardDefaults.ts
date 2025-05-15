
import { DesignMetadata } from '@/lib/types/cardTypes';

// Default fallback image URL if card image can't be loaded
export const FALLBACK_IMAGE_URL = '/placeholder-card.png';

// Default design metadata for new cards
export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: {
    template: 'classic',
    effect: 'none',
    borderRadius: '8px',
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0,0,0,0.2)',
    frameWidth: 2,
    frameColor: '#000000',
  },
  textStyle: {
    titleFont: 'Inter',
    titleSize: '24px',
    titleColor: '#000000',
    titleAlignment: 'center',
    descriptionFont: 'Inter',
    descriptionSize: '16px',
    descriptionColor: '#333333',
  },
  cardMetadata: {
    category: 'Sports',
    series: 'Standard',
    cardType: 'Player',
  },
  marketMetadata: {
    isPrintable: true,
    isForSale: false,
    includeInCatalog: true,
  }
};

// Utils for card creation
export const createEmptyCard = () => {
  return {
    id: '',
    title: '',
    description: '',
    imageUrl: '',
    thumbnailUrl: '',
    tags: [],
    userId: '',
    effects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designMetadata: DEFAULT_DESIGN_METADATA
  };
};

export const generateCardId = () => {
  return `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
