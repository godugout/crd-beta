
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
