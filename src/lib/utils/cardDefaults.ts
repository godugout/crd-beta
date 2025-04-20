
import { getFallbackImageUrl } from './imageUtils';

export const FALLBACK_FRONT_IMAGE_URL = getFallbackImageUrl('front');
export const FALLBACK_BACK_IMAGE_URL = getFallbackImageUrl('back');
export const FALLBACK_IMAGE_URL = FALLBACK_FRONT_IMAGE_URL;

export const DEFAULT_DESIGN_METADATA = {
  cardStyle: {
    template: 'classic',
    effect: 'none',
    borderRadius: '8px',
    borderColor: '#000000',
    frameColor: '#000000',
    frameWidth: 2,
    shadowColor: 'rgba(0,0,0,0.2)'
  },
  cardMetadata: {
    series: 'Base Set',
    year: '1999',
    rarity: 'Common',
    version: 'Unlimited',
    category: 'Default',
    cardType: 'Standard',
    cardNumber: 'N/A',
    artist: 'Unknown'
  },
  textStyle: {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333'
  },
  marketMetadata: {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false
  },
  stats: {
    attack: 50,
    defense: 30,
    speed: 70,
    special: 60
  },
  oaklandMemory: {
    date: '2023-07-22',
    opponent: 'San Francisco Giants',
    location: 'Oakland Coliseum',
    attendance: 20000
  }
};

