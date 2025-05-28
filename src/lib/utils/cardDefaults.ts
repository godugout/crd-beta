
import { DesignMetadata } from '@/lib/types';

export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: {
    template: 'classic',
    effect: 'none',
    borderRadius: '8px',
    borderColor: '#000000',
    shadowColor: 'rgba(0,0,0,0.2)',
    frameWidth: 2,
    frameColor: '#000000'
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333'
  },
  cardMetadata: {
    category: 'sports',
    series: 'base',
    cardType: 'standard'
  },
  marketMetadata: {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: true
  }
};

export const FALLBACK_IMAGE_URL = '/placeholder-card.png';
