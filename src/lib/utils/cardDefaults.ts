
import { DesignMetadata } from '@/lib/types/cardTypes';

export const FALLBACK_IMAGE_URL = '/images/card-placeholder.png';
export const FALLBACK_BACK_IMAGE_URL = '/images/card-back-placeholder.png';
// Aliases for backward compatibility
export const FALLBACK_FRONT_IMAGE_URL = FALLBACK_IMAGE_URL;

// Helper function to handle image load errors
export const handleImageLoadError = (event: React.SyntheticEvent<HTMLImageElement>, fallbackUrl: string = FALLBACK_IMAGE_URL) => {
  const img = event.target as HTMLImageElement;
  if (img.src !== fallbackUrl) {
    console.warn('Image failed to load, using fallback:', img.src);
    img.src = fallbackUrl;
  }
};

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
  }
};
