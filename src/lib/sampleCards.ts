import { Card, CardRarity } from '@/lib/types';

export const sampleCards: Partial<Card>[] = [
  {
    id: '1',
    title: 'Vintage Baseball Card',
    description: 'A classic baseball card from the golden era',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
    tags: ['baseball', 'vintage', 'collectible'],
    userId: 'demo-user',
    effects: ['standard'],
    rarity: CardRarity.COMMON,
    isFavorite: false
  },
  {
    id: '2',
    title: 'Basketball Legend',
    description: 'Limited edition basketball trading card',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1',
    thumbnailUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=200',
    tags: ['basketball', 'limited', 'sports'],
    userId: 'demo-user',
    effects: ['holographic'],
    rarity: CardRarity.RARE,
    isFavorite: true
  },
  {
    id: '3',
    title: 'Football Star Rookie',
    description: 'Highly sought after rookie card',
    imageUrl: 'https://images.unsplash.com/photo-1556085253-79f9a3999831',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556085253-79f9a3999831?w=200',
    tags: ['football', 'rookie', 'sports'],
    userId: 'demo-user',
    effects: ['foil'],
    rarity: CardRarity.UNCOMMON,
    isFavorite: false
  },
  {
    id: '4',
    title: 'Hockey Great',
    description: 'Iconic hockey player card',
    imageUrl: 'https://images.unsplash.com/photo-1622541942249-c7421447e39c',
    thumbnailUrl: 'https://images.unsplash.com/photo-1622541942249-c7421447e39c?w=200',
    tags: ['hockey', 'iconic', 'sports'],
    userId: 'demo-user',
    effects: ['glitter'],
    rarity: CardRarity.LEGENDARY,
    isFavorite: true
  },
  {
    id: '5',
    title: 'Tennis Champion',
    description: 'Celebrating a grand slam winner',
    imageUrl: 'https://images.unsplash.com/photo-1560275774-c60cd241c5fa',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560275774-c60cd241c5fa?w=200',
    tags: ['tennis', 'champion', 'sports'],
    userId: 'demo-user',
    effects: ['standard'],
    rarity: CardRarity.MYTHIC,
    isFavorite: false
  },
  {
    id: '6',
    title: 'Golf Pro',
    description: 'A top golfer in action',
    imageUrl: 'https://images.unsplash.com/photo-1570176944759-4df9980749ca',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570176944759-4df9980749ca?w=200',
    tags: ['golf', 'pro', 'sports'],
    userId: 'demo-user',
    effects: ['standard'],
    rarity: CardRarity.ULTRA_RARE,
    isFavorite: true
  }
];
