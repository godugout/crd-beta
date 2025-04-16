
import { v4 as uuidv4 } from 'uuid';

const sampleCards = [
  {
    id: uuidv4(),
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
    designMetadata: {
      cardStyle: {
        template: 'standard',
        effect: 'standard',
        borderRadius: '8px',
        borderColor: '#000000',
        shadowColor: '#000000',
        frameWidth: 5,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'sports',
        series: 'baseball',
        cardType: 'standard'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: false
      }
    }
  },
  {
    id: uuidv4(),
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
    designMetadata: {
      cardStyle: {
        template: 'premium',
        effect: 'holographic',
        borderRadius: '8px',
        borderColor: '#000000',
        shadowColor: '#000000',
        frameWidth: 5,
        frameColor: '#000000'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'sports',
        series: 'basketball',
        cardType: 'premium'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: false
      }
    }
  }
];

export default sampleCards;
