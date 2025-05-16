import { CardData } from '@/types/card';

const sampleCards: CardData[] = [
  {
    id: '1',
    title: 'Sample Card 1',
    description: 'This is a sample card for development',
    imageUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    tags: ['sample', 'development'],
    userId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0,0,0,0.2)',
        frameWidth: 2,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false,
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 1,
        editionNumber: 1
      }
    }
  },
  {
    id: '2',
    title: 'Sample Card 2',
    description: 'Another sample card for testing',
    imageUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    tags: ['sample', 'testing'],
    userId: 'user2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0,0,0,0.2)',
        frameWidth: 2,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false,
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 1,
        editionNumber: 1
      }
    }
  },
  {
    id: '3',
    title: 'Sample Card 3',
    description: 'A third sample card for demonstration',
    imageUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    tags: ['sample', 'demonstration'],
    userId: 'user3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0,0,0,0.2)',
        frameWidth: 2,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false,
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 1,
        editionNumber: 1
      }
    }
  },
  {
    id: '4',
    title: 'Sample Card 4',
    description: 'A fourth sample card for illustration',
    imageUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    tags: ['sample', 'illustration'],
    userId: 'user4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0,0,0,0.2)',
        frameWidth: 2,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false,
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 1,
        editionNumber: 1
      }
    }
  },
  {
    id: '5',
    title: 'Sample Card 5',
    description: 'A fifth sample card for presentation',
    imageUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    tags: ['sample', 'presentation'],
    userId: 'user5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0,0,0,0.2)',
        frameWidth: 2,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false,
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 1,
        editionNumber: 1
      }
    }
  },
  {
    id: '6',
    title: 'Sample Card 6',
    description: 'A sixth sample card for showcasing',
    imageUrl: '/placeholder.svg',
    thumbnailUrl: '/placeholder.svg',
    tags: ['sample', 'showcasing'],
    userId: 'user6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    effects: [],
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0,0,0,0.2)',
        frameWidth: 2,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false,
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 1,
        editionNumber: 1
      }
    }
  },
];

export default sampleCards;
