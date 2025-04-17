
import { Card } from '@/lib/types';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

const sampleCards: Card[] = [
  {
    id: '1',
    title: 'Vintage Baseball Card',
    description: 'A classic baseball card from the golden era',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
    tags: ['baseball', 'vintage', 'collectible'],
    userId: 'anonymous',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    rarity: 'common',
    designMetadata: DEFAULT_DESIGN_METADATA
  },
  {
    id: '2',
    title: 'Basketball Legend',
    description: 'Limited edition basketball trading card',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=200',
    tags: ['basketball', 'limited', 'sports'],
    userId: 'anonymous',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: ['Holographic'],
    rarity: 'rare',
    designMetadata: DEFAULT_DESIGN_METADATA
  }
];

export default sampleCards;
