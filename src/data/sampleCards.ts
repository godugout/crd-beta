
import { Card } from '@/lib/types';

const sampleCards: Card[] = [
  {
    id: 'card-001',
    title: 'Oakland Athletics - Classic Card',
    description: 'A classic baseball card featuring the Oakland Athletics team from the golden era.',
    imageUrl: '/lovable-uploads/236e3ad9-f7c2-4e5b-b29a-ca52a49ff3ed.png',
    thumbnailUrl: '/lovable-uploads/236e3ad9-f7c2-4e5b-b29a-ca52a49ff3ed.png',
    tags: ['Baseball', 'Oakland', 'Historic'],
    userId: 'user-1',
    teamId: 'team-oakland',
    isPublic: true,
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-04-15T10:30:00Z',
    effects: ['Vintage'],
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'vintage',
        borderRadius: '12px'
      }
    },
    rarity: 'rare',
    player: 'Team Card',
    team: 'Oakland Athletics',
    year: '1989',
    artist: 'CRD Design Team',
    set: 'Classic Series'
  },
  {
    id: 'card-002',
    title: 'Modern Baseball Star',
    description: 'A modern baseball card featuring one of today\'s star players.',
    imageUrl: '/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png',
    thumbnailUrl: '/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png',
    tags: ['Baseball', 'Modern', 'Star'],
    userId: 'user-1',
    teamId: 'team-modern',
    isPublic: true,
    createdAt: '2023-05-20T14:45:00Z',
    updatedAt: '2023-05-22T09:15:00Z',
    effects: ['Holographic'],
    designMetadata: {
      cardStyle: {
        template: 'modern',
        effect: 'holographic',
        borderRadius: '8px'
      }
    },
    rarity: 'uncommon',
    player: 'Michael Johnson',
    team: 'San Francisco Giants',
    year: '2023',
    artist: 'Digital Creations',
    set: 'Modern Heroes'
  },
  {
    id: 'card-003',
    title: 'Vintage Oakland Memory',
    description: 'A special card commemorating a memorable day at the Oakland Coliseum.',
    imageUrl: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
    thumbnailUrl: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
    tags: ['Oakland', 'Memory', 'Vintage'],
    userId: 'user-2',
    teamId: 'team-oakland',
    isPublic: true,
    createdAt: '2023-03-10T11:20:00Z',
    updatedAt: '2023-03-10T11:20:00Z',
    effects: ['Sepia', 'GoldFoil'],
    designMetadata: {
      cardStyle: {
        template: 'memory',
        effect: 'sepia',
        borderRadius: '12px'
      },
      oaklandMemory: {
        date: '1989-10-28',
        location: 'Oakland Coliseum',
        event: 'World Series Game'
      }
    },
    rarity: 'rare',
    player: 'Historic Game',
    team: 'Oakland Athletics',
    year: '1989',
    artist: 'Memory Archive',
    set: 'Oakland Memories'
  }
];

export default sampleCards;
