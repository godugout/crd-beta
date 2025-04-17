import { Card, CardRarity } from '@/lib/types';

export const sampleCardData: Card[] = [
  {
    id: 'card-1',
    title: 'Rickey Henderson',
    description: 'Hall of Fame Outfielder',
    imageUrl: '/imgs/rickey.jpg',
    thumbnailUrl: '/imgs/rickey-thumb.jpg',
    tags: ['Hall of Fame', 'Outfield', 'Athletics'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1',
    teamId: 'team-1',
    collectionId: 'collection-1',
    isPublic: true,
    effects: ['holographic'],
    isFavorite: false,
    rarity: CardRarity.LEGENDARY,
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'holographic',
        borderRadius: '10px',
        borderColor: '#f0c14b',
        shadowColor: '#f0c14b',
        frameWidth: 2,
        frameColor: '#f0c14b'
      },
      textStyle: {
        titleColor: '#ffffff',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#ffffff'
      },
      cardMetadata: {
        category: 'baseball',
        series: 'legends',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      },
      player: 'Rickey Henderson',
      team: 'Oakland Athletics',
      year: '1989'
    }
  },
  {
    id: 'card-2',
    title: 'Dave Stewart',
    description: 'Ace Pitcher',
    imageUrl: '/imgs/stew.jpg',
    thumbnailUrl: '/imgs/stew-thumb.jpg',
    tags: ['Pitcher', 'Athletics', '1989'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1',
    teamId: 'team-1',
    collectionId: 'collection-1',
    isPublic: true,
    effects: ['refractor'],
    isFavorite: false,
    rarity: CardRarity.RARE,
    designMetadata: {
      cardStyle: {
        template: 'modern',
        effect: 'refractor',
        borderRadius: '10px',
        borderColor: '#a9a9a9',
        shadowColor: '#a9a9a9',
        frameWidth: 2,
        frameColor: '#a9a9a9'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'left',
        titleWeight: 'bold',
        descriptionColor: '#666666'
      },
      cardMetadata: {
        category: 'baseball',
        series: 'world series 89',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      },
      player: 'Dave Stewart',
      team: 'Oakland Athletics',
      year: '1989'
    }
  },
  {
    id: 'card-3',
    title: 'Mark McGwire',
    description: 'Power Hitter',
    imageUrl: '/imgs/mcgwire.jpg',
    thumbnailUrl: '/imgs/mcgwire-thumb.jpg',
    tags: ['First Base', 'Athletics', 'Power Hitter'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1',
    teamId: 'team-1',
    collectionId: 'collection-1',
    isPublic: true,
    effects: ['shimmer'],
    isFavorite: false,
    rarity: CardRarity.UNCOMMON,
    designMetadata: {
      cardStyle: {
        template: 'holo',
        effect: 'shimmer',
        borderRadius: '10px',
        borderColor: '#ffffff',
        shadowColor: '#000000',
        frameWidth: 2,
        frameColor: '#ffffff'
      },
      textStyle: {
        titleColor: '#ffffff',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#ffffff'
      },
      cardMetadata: {
        category: 'baseball',
        series: 'home run heroes',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      },
      player: 'Mark McGwire',
      team: 'Oakland Athletics',
      year: '1998'
    }
  },
  {
    id: 'card-4',
    title: 'Dennis Eckersley',
    description: 'Hall of Fame Closer',
    imageUrl: '/imgs/eck.jpg',
    thumbnailUrl: '/imgs/eck-thumb.jpg',
    tags: ['Closer', 'Hall of Fame', 'Athletics'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1',
    teamId: 'team-1',
    collectionId: 'collection-1',
    isPublic: true,
    effects: ['vintage'],
    isFavorite: false,
    rarity: CardRarity.COMMON,
    designMetadata: {
      cardStyle: {
        template: 'vintage',
        effect: 'sepia',
        borderRadius: '5px',
        borderColor: '#000000',
        shadowColor: '#000000',
        frameWidth: 2,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'normal',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'baseball',
        series: 'vintage collection',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      },
      player: 'Dennis Eckersley',
      team: 'Oakland Athletics',
      year: '1992'
    }
  },
  {
    id: 'card-5',
    title: 'Jose Canseco',
    description: 'Power Hitter',
    imageUrl: '/imgs/canseco.jpg',
    thumbnailUrl: '/imgs/canseco-thumb.jpg',
    tags: ['Outfield', 'Athletics', 'Power Hitter'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'user-1',
    teamId: 'team-1',
    collectionId: 'collection-1',
    isPublic: true,
    effects: ['holographic'],
    isFavorite: false,
    rarity: CardRarity.ULTRA_RARE,
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'holographic',
        borderRadius: '10px',
        borderColor: '#f0c14b',
        shadowColor: '#f0c14b',
        frameWidth: 2,
        frameColor: '#f0c14b'
      },
      textStyle: {
        titleColor: '#ffffff',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#ffffff'
      },
      cardMetadata: {
        category: 'baseball',
        series: 'Bash Brothers',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      },
      player: 'Jose Canseco',
      team: 'Oakland Athletics',
      year: '1989'
    }
  }
];

export default sampleCardData;
