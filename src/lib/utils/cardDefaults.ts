
import { CardDesignMetadata } from '@/lib/types/cardTypes';

export const DEFAULT_CARD_METADATA = {
  category: 'general',
  series: 'base', 
  cardType: 'standard',
  effects: []
};

export const DEFAULT_DESIGN_METADATA: CardDesignMetadata = {
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
  cardMetadata: DEFAULT_CARD_METADATA,
  marketMetadata: {
    price: 0,
    currency: 'USD',
    availableForSale: false,
    editionSize: 1,
    editionNumber: 1,
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false
  }
};
