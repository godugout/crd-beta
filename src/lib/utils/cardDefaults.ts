
import { DesignMetadata } from '@/lib/types';

// Fallback image URLs
export const FALLBACK_FRONT_IMAGE_URL = '/images/placeholder-card.png';
export const FALLBACK_BACK_IMAGE_URL = '/images/placeholder-card-back.png';
export const FALLBACK_IMAGE_URL = '/images/placeholder-card.png';

// Default design metadata
export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: {
    template: 'standard',
    effect: 'none',
    borderRadius: '16px',
    borderColor: '#000000',
    frameColor: '#ffffff',
    frameWidth: 8,
    shadowColor: 'rgba(0,0,0,0.2)',
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#444444',
  },
  marketMetadata: {
    isPrintable: true,
    isForSale: false,
    includeInCatalog: true,
  },
  cardMetadata: {
    category: 'standard',
    cardType: 'collectible',
    series: 'default',
    cardNumber: '001',
    artist: 'Unknown Artist',
  },
};

// Helper function to handle image loading errors
export const handleImageLoadError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc: string = FALLBACK_FRONT_IMAGE_URL) => {
  const target = event.target as HTMLImageElement;
  
  // Prevent infinite loop by checking if we're already using the fallback
  if (target.src !== fallbackSrc) {
    console.warn('Image failed to load, using fallback:', target.src, '→', fallbackSrc);
    target.src = fallbackSrc;
  }
};
