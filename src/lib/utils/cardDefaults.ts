
/**
 * Default card design metadata for use across the application
 */

import { DesignMetadata } from '@/lib/types/cardTypes';

// Default design metadata structure for cards that don't have it
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
