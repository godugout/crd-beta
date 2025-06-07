
import { DesignMetadata } from '@/lib/types/cardTypes';

export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: {
    template: 'standard',
    effect: 'none',
    borderRadius: '8px',
    borderColor: '#000000',
    frameWidth: 2,
    frameColor: '#000000',
    shadowColor: 'rgba(0,0,0,0.2)'
  },
  textStyle: {
    titleColor: '#000000',
    descriptionColor: '#333333'
  },
  cardMetadata: {
    category: 'Standard',
    series: 'Base',
    cardType: 'Standard'
  },
  marketMetadata: {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false
  }
};

export const FALLBACK_IMAGE_URL = '/images/card-placeholder.png';

// Image size configurations for different use cases
export const IMAGE_SIZES = {
  thumbnail: { width: 200, height: 280, quality: 75 },
  preview: { width: 400, height: 560, quality: 85 },
  card: { width: 800, height: 1120, quality: 90 },
  fullsize: { width: 1200, height: 1680, quality: 95 }
};

export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
