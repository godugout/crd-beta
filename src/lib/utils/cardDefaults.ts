
import { DesignMetadata } from '@/lib/types/cardTypes';

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
