
import { DesignMetadata, CardStyle, TextStyle } from '@/lib/types';

// Fallback image URL for when a card image doesn't load
export const FALLBACK_IMAGE_URL = '/placeholder-card.png';

// Default CardStyle
export const DEFAULT_CARD_STYLE: CardStyle = {
  template: 'standard',
  effect: 'none',
  borderRadius: '8px',
  borderColor: '#000000',
  borderWidth: 1,
  shadowColor: 'rgba(0,0,0,0.2)',
  frameWidth: 2,
  frameColor: '#000000',
  backgroundColor: '#ffffff'
};

// Default TextStyle
export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: 'Inter',
  fontSize: '14px',
  fontWeight: '400',
  color: '#000000',
  titleColor: '#000000',
  titleAlignment: 'center',
  titleWeight: 'bold',
  descriptionColor: '#333333'
};

// Complete default DesignMetadata
export const DEFAULT_DESIGN_METADATA: DesignMetadata = {
  cardStyle: DEFAULT_CARD_STYLE,
  textStyle: DEFAULT_TEXT_STYLE,
  cardMetadata: {
    category: 'Standard',
    series: 'Base',
    cardType: 'Standard',
    cardNumber: '1',
    artist: 'Unknown'
  },
  marketMetadata: {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false
  }
};
