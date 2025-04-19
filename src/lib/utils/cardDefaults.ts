
// Default design metadata for cards
import { DesignMetadata } from '@/lib/types';

export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: {
    template: 'standard',
    effect: 'none',
    borderRadius: '8px',
    borderColor: '#000000',
    frameColor: '#FFFFFF',
    frameWidth: 2,
    shadowColor: '#000000'
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333'
  },
  marketMetadata: {
    isPrintable: true,
    isForSale: false,
    includeInCatalog: true
  },
  cardMetadata: {
    category: 'standard',
    cardType: 'basic',
    series: 'default'
  }
};

// Fallback image URLs
export const FALLBACK_IMAGE_URL = '/assets/images/fallback-card.png';
export const FALLBACK_FRONT_IMAGE_URL = '/assets/images/fallback-front.png';
export const FALLBACK_BACK_IMAGE_URL = '/assets/images/fallback-back.png';

// Image error handling
export const handleImageLoadError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  event.currentTarget.src = FALLBACK_IMAGE_URL;
  event.currentTarget.onerror = null; // Prevent infinite error loop
};
