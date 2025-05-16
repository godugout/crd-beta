
import { CardStyle, TextStyle, CardMetadata, MarketMetadata, DesignMetadata } from '@/lib/types/cardTypes';

// Default values for card styles
export const DEFAULT_CARD_STYLE: CardStyle = {
  template: 'basic',
  effect: 'none',
  borderRadius: '12px',
  borderColor: '#e2e8f0',
  backgroundColor: '#ffffff',
  shadowColor: '#000000',
  frameWidth: 0,
  frameColor: '#ffffff'
};

// Default values for text styles
export const DEFAULT_TEXT_STYLE: TextStyle = {
  titleFont: 'Arial',
  titleSize: '24px',
  titleColor: '#ffffff',
  titleAlignment: 'center',
  titleWeight: 'bold',
  descriptionFont: 'Arial',
  descriptionSize: '16px',
  descriptionColor: '#dddddd'
};

// Default values for card metadata
export const DEFAULT_CARD_METADATA: CardMetadata = {
  category: 'sports',
  series: 'standard',
  cardType: 'baseball'
};

// Default values for market metadata
export const DEFAULT_MARKET_METADATA: MarketMetadata = {
  isPrintable: false,
  isForSale: false,
  includeInCatalog: false
};

// Consolidated default design metadata
export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: DEFAULT_CARD_STYLE,
  textStyle: DEFAULT_TEXT_STYLE,
  cardMetadata: DEFAULT_CARD_METADATA,
  marketMetadata: DEFAULT_MARKET_METADATA
};
