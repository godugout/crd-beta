
import { DesignMetadata } from '@/lib/types/cardTypes';

export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: {
    template: 'standard',
    effect: 'standard',
    borderRadius: '8px',
    borderColor: '#000000',
    shadowColor: '#000000',
    frameWidth: 5,
    frameColor: '#000000'
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333'
  },
  cardMetadata: {
    category: 'standard',
    series: 'default',
    cardType: 'standard'
  },
  marketMetadata: {
    isPrintable: true,
    isForSale: false,
    includeInCatalog: false
  }
};

export const DEFAULT_CARD = {
  title: 'New Card',
  description: '',
  imageUrl: '',
  thumbnailUrl: '',
  tags: [],
  isPublic: true,
  userId: 'anonymous',
  effects: [],
  rarity: 'common',
  designMetadata: DEFAULT_DESIGN_METADATA
};
