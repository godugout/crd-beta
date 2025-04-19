
import { DesignMetadata } from '@/lib/types';

// Default design metadata
export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
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
  marketMetadata: {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false,
  },
  cardMetadata: {
    category: 'general',
    cardType: 'standard',
    series: 'base',
  },
};

// Fallback image URLs
export const FALLBACK_FRONT_IMAGE_URL = '/images/card-placeholder.png';
export const FALLBACK_BACK_IMAGE_URL = '/images/card-back-placeholder.png';
export const FALLBACK_IMAGE_URL = FALLBACK_FRONT_IMAGE_URL; // Alias for backward compatibility

// Image error handling helper
export const handleImageLoadError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = e.target as HTMLImageElement;
  console.warn(`Image failed to load: ${img.src}`);
  img.src = FALLBACK_FRONT_IMAGE_URL;
  img.onerror = null; // Prevent infinite error loop
};
