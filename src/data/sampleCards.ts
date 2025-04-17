import { CardRarity } from '@/lib/types';

// Sample cards for demo purposes
export const sampleCards = [
  {
    id: 'card-001',
    title: 'Prince',
    description: 'Special tribute artwork celebrating the Minneapolis legend in Wolves colors. Fan-created artwork reimagining Prince as a basketball player for his hometown team.',
    imageUrl: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png', 
    thumbnailUrl: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
    tags: ['music', 'prince', 'wolves', 'minneapolis'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    effects: ['Holographic'],
    rarity: CardRarity.COMMON,
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'classic',
        borderRadius: '4px',
        borderColor: '#5B23A9',
        frameColor: '#5B23A9',
        frameWidth: 2,
        shadowColor: 'rgba(91, 35, 169, 0.4)',
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'left',
        titleWeight: 'bold',
        descriptionColor: '#FFFFFF',
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      },
      cardMetadata: {
        category: 'artist-series',
        cardType: 'music-legends',
        series: 'artist-reimagined'
      }
    }
  },
  {
    id: 'card-002',
    title: 'Michael Jordan',
    description: 'Classic illustration of the GOAT in his legendary Bulls uniform. This fan art captures the iconic silhouette and spirit of Jordan\'s tremendous impact on the game.',
    imageUrl: '/lovable-uploads/371b81a2-cafa-4637-9358-218d4120c658.png',
    thumbnailUrl: '/lovable-uploads/371b81a2-cafa-4637-9358-218d4120c658.png',
    tags: ['basketball', 'bulls', 'jordan', 'nba'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    effects: ['Refractor', 'Chrome'],
    rarity: CardRarity.RARE,
    designMetadata: {
      cardStyle: {
        template: 'nifty',
        effect: 'nifty',
        borderRadius: '12px',
        borderColor: '#CE1141',
        frameColor: '#CE1141',
        frameWidth: 4,
        shadowColor: 'rgba(206, 17, 65, 0.6)',
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'left',
        titleWeight: 'bold',
        descriptionColor: '#FFFFFF',
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      },
      cardMetadata: {
        category: 'sports',
        cardType: 'artist-series',
        series: 'basketball-legends'
      }
    }
  },
  {
    id: 'card-003',
    title: 'Elvis Presley',
    description: 'Memphis legend reimagined as a Grizzlies player. This creative interpretation connects Elvis to his hometown through the lens of basketball culture.',
    imageUrl: '/lovable-uploads/236e3ad9-f7c2-4e5b-b29a-ca52a49ff3ed.png',
    thumbnailUrl: '/lovable-uploads/236e3ad9-f7c2-4e5b-b29a-ca52a49ff3ed.png',
    tags: ['music', 'elvis', 'grizzlies', 'memphis'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    effects: ['Vintage'],
    rarity: CardRarity.COMMON,
    designMetadata: {
      cardStyle: {
        template: 'nostalgic',
        effect: 'nostalgic',
        borderRadius: '8px',
        borderColor: '#5D9AD3',
        frameColor: '#5D9AD3',
        frameWidth: 3,
        shadowColor: 'rgba(93, 154, 211, 0.5)',
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'left',
        titleWeight: 'bold',
        descriptionColor: '#FFFFFF',
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: false
      },
      cardMetadata: {
        category: 'music-legends',
        cardType: 'artist-series',
        series: 'memphis-icons'
      }
    }
  },
  {
    id: 'card-004',
    title: 'Bob Marley',
    description: 'Reggae icon in Lakers gold. This fan creation reimagines what Bob Marley might look like as an LA Laker, combining music and basketball culture.',
    imageUrl: '/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png',
    thumbnailUrl: '/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png',
    tags: ['music', 'marley', 'lakers', 'reggae'],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    effects: ['Chrome', 'Holographic'],
    rarity: CardRarity.COMMON,
    designMetadata: {
      cardStyle: {
        template: 'nostalgic',
        effect: 'nostalgic',
        borderRadius: '8px',
        borderColor: '#FDB927',
        frameColor: '#FDB927',
        frameWidth: 3,
        shadowColor: 'rgba(253, 185, 39, 0.5)',
      },
      textStyle: {
        titleColor: '#552583',
        titleAlignment: 'left',
        titleWeight: 'bold',
        descriptionColor: '#FFFFFF',
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      },
      cardMetadata: {
        category: 'music-legends',
        cardType: 'artist-series',
        series: 'gold-edition'
      }
    }
  },
  {
    id: 'card-005',
    title: 'Tupac Shakur',
    description: 'Hip-hop legend reimagined as a Blue Devil. This creative fan art brings Tupac\'s intensity to the basketball court as a Duke University player.',
    imageUrl: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
    thumbnailUrl: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
    tags: ['music', 'tupac', 'duke', 'hip-hop'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    effects: ['Vintage', 'Holographic'],
    rarity: CardRarity.COMMON,
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'classic',
        borderRadius: '4px',
        borderColor: '#001A57',
        frameColor: '#001A57',
        frameWidth: 2,
        shadowColor: 'rgba(0, 26, 87, 0.4)',
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'left',
        titleWeight: 'bold',
        descriptionColor: '#FFFFFF',
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      },
      cardMetadata: {
        category: 'music-legends',
        cardType: 'artist-series',
        series: 'hip-hop-icons'
      }
    }
  },
  {
    id: 'card-006',
    title: 'Notorious B.I.G.',
    description: 'Brooklyn\'s finest in his hometown jersey. This fan creation honors Biggie by visualizing him as a player for his hometown Brooklyn Nets.',
    imageUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    thumbnailUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    tags: ['music', 'biggie', 'nets', 'brooklyn', 'hip-hop'],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    effects: ['Chrome', 'Holographic'],
    rarity: CardRarity.COMMON,
    designMetadata: {
      cardStyle: {
        template: 'nifty',
        effect: 'nifty',
        borderRadius: '12px',
        borderColor: '#FF0063',
        frameColor: '#FF0063',
        frameWidth: 4,
        shadowColor: 'rgba(255, 0, 99, 0.6)',
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'left',
        titleWeight: 'bold',
        descriptionColor: '#FFFFFF',
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      },
      cardMetadata: {
        category: 'music-legends',
        cardType: 'artist-series',
        series: 'brooklyn-icons'
      }
    }
  }
];
