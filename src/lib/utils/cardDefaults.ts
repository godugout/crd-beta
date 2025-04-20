import { getFallbackImageUrl } from './imageUtils';

export const FALLBACK_FRONT_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
export const FALLBACK_BACK_IMAGE_URL = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';

export const DEFAULT_DESIGN_METADATA = {
  cardMetadata: {
    series: 'Base Set',
    year: '1999',
    rarity: 'Common',
    version: 'Unlimited'
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

// Optional: Add a function to get a fallback based on card type
export const getCardBackPlaceholder = (cardType?: string) => {
  switch (cardType) {
    case 'baseball':
      return 'https://images.unsplash.com/photo-1546519638-68e109498ffc';
    case 'vintage':
      return 'https://images.unsplash.com/photo-1594736292631-6df61984a1a8';
    default:
      return FALLBACK_BACK_IMAGE_URL;
  }
};
