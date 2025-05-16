
import { CardData } from '@/types/card';

// Sample card data
const sampleCardsData: CardData[] = [
  {
    id: '1',
    title: 'Rickey Henderson Rookie Card',
    description: 'A classic Rickey Henderson rookie card from 1979.',
    imageUrl: '/assets/cards/rickey-henderson.jpg',
    thumbnailUrl: '/assets/cards/thumbnails/rickey-henderson-thumb.jpg',
    player: 'Rickey Henderson',
    team: 'Oakland Athletics',
    year: '1979',
    tags: ['baseball', 'rookie', 'oakland', 'athletics'],
    createdAt: '2023-02-15T10:30:00Z',
    updatedAt: '2023-02-15T10:30:00Z',
    userId: 'user-1',
    effects: ['holographic'],
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'holographic',
        borderRadius: '10px',
        borderColor: '#00a33d',
        frameWidth: 3,
        shadowColor: 'rgba(0,0,0,0.3)',
        frameColor: '#ffd700'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'baseball',
        series: 'vintage',
        cardType: 'rookie'
      },
      marketMetadata: {
        price: 299.99,
        currency: 'USD',
        availableForSale: true,
        editionSize: 1000,
        editionNumber: 42,
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      }
    }
  },
  {
    id: '2',
    title: 'Mark McGwire Home Run Record',
    description: 'Commemorative card for Mark McGwire\'s home run record.',
    imageUrl: '/assets/cards/mark-mcgwire.jpg',
    thumbnailUrl: '/assets/cards/thumbnails/mark-mcgwire-thumb.jpg',
    player: 'Mark McGwire',
    team: 'St. Louis Cardinals',
    year: '1998',
    tags: ['baseball', 'record', 'home run', 'cardinals'],
    createdAt: '2023-02-16T14:45:00Z',
    updatedAt: '2023-02-16T14:45:00Z',
    userId: 'user-2',
    effects: ['gold-foil'],
    designMetadata: {
      cardStyle: {
        template: 'premium',
        effect: 'gold-foil',
        borderRadius: '8px',
        borderColor: '#c41e3a',
        frameWidth: 4,
        shadowColor: 'rgba(0,0,0,0.4)',
        frameColor: '#ffd700'
      },
      textStyle: {
        titleColor: '#c41e3a',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'baseball',
        series: 'commemorative',
        cardType: 'special'
      },
      marketMetadata: {
        price: 149.99,
        currency: 'USD',
        availableForSale: true,
        editionSize: 500,
        editionNumber: 62,
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      }
    }
  },
  {
    id: '3',
    title: 'Ken Griffey Jr. All-Star',
    description: 'Ken Griffey Jr. All-Star card with special effects.',
    imageUrl: '/assets/cards/griffey-jr.jpg',
    thumbnailUrl: '/assets/cards/thumbnails/griffey-jr-thumb.jpg',
    player: 'Ken Griffey Jr.',
    team: 'Seattle Mariners',
    year: '1994',
    tags: ['baseball', 'all-star', 'mariners', '90s'],
    createdAt: '2023-02-17T09:20:00Z',
    updatedAt: '2023-02-17T09:20:00Z',
    userId: 'user-1',
    effects: ['refractor'],
    designMetadata: {
      cardStyle: {
        template: 'modern',
        effect: 'refractor',
        borderRadius: '12px',
        borderColor: '#0c2c56',
        frameWidth: 3,
        shadowColor: 'rgba(0,0,0,0.3)',
        frameColor: '#00ccff'
      },
      textStyle: {
        titleColor: '#0c2c56',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'baseball',
        series: 'all-star',
        cardType: 'premium'
      },
      marketMetadata: {
        price: 199.99,
        currency: 'USD',
        availableForSale: true,
        editionSize: 750,
        editionNumber: 24,
        isPrintable: true,
        isForSale: true,
        includeInCatalog: true
      }
    }
  }
];

// Export as default as well as named export for compatibility
export default sampleCardsData;

// Legacy named export for backward compatibility
export { sampleCardsData as cardData };
