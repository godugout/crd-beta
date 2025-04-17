
import { Card, Collection, CardRarity } from '@/lib/types';

export const fetchCollectionById = (id: string): Collection | undefined => {
  const mockCollection: Collection = {
    id: '1',
    name: 'My Collection',
    description: 'A great collection of cards',
    coverImageUrl: '/collection-cover.jpg',
    userId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cards: [
      {
        id: 'card-1',
        title: 'Example Card',
        description: 'This is an example card',
        imageUrl: '/card-image.jpg',
        thumbnailUrl: '/card-thumb.jpg',
        tags: ['example', 'card'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user-1',
        effects: [],
        rarity: CardRarity.COMMON,
        isFavorite: false,
        designMetadata: {}
      }
    ]
  };
  
  return id === '1' ? mockCollection : undefined;
};

export const fetchCollections = (): Collection[] => {
  const mockCollections: Collection[] = [
    {
      id: '1',
      name: 'My Collection',
      description: 'A great collection of cards',
      coverImageUrl: '/collection-cover.jpg',
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards: [
        {
          id: 'card-1',
          title: 'Example Card',
          description: 'This is an example card',
          imageUrl: '/card-image.jpg',
          thumbnailUrl: '/card-thumb.jpg',
          tags: ['example', 'card'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'user-1',
          effects: [],
          rarity: CardRarity.COMMON,
          isFavorite: false,
          designMetadata: {}
        }
      ]
    }
  ];
  
  return mockCollections;
};
