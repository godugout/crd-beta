
import { CardMetadata, CardMarketMetadata, CardDesignMetadata, CardStyle, TextStyle } from '@/lib/types/cardTypes';

export const DEFAULT_CARD_METADATA: CardMetadata = {
  category: 'general',
  series: 'base',
  cardType: 'standard',
};

export const DEFAULT_MARKET_METADATA: CardMarketMetadata = {
  price: 0,
  currency: 'USD',
  availableForSale: false,
  editionSize: 1,
  editionNumber: 1,
  isPrintable: false,
  isForSale: false,
  includeInCatalog: false,
};

export const DEFAULT_CARD_STYLE: CardStyle = {
  template: 'classic',
  effect: 'none',
  borderRadius: '8px',
  borderColor: '#000000',
  frameColor: '#000000',
  frameWidth: 2,
  shadowColor: 'rgba(0,0,0,0.2)',
};

export const DEFAULT_TEXT_STYLE: TextStyle = {
  titleColor: '#000000',
  titleAlignment: 'center',
  titleWeight: 'bold',
  descriptionColor: '#333333',
};

export const DEFAULT_DESIGN_METADATA: CardDesignMetadata = {
  cardStyle: DEFAULT_CARD_STYLE,
  textStyle: DEFAULT_TEXT_STYLE,
  cardMetadata: DEFAULT_CARD_METADATA,
  marketMetadata: DEFAULT_MARKET_METADATA,
};
