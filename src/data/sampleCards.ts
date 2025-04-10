
// Sample cards for demo purposes
export const sampleCards = [
  {
    id: 'card-001',
    title: 'Gundam RX-78-2',
    description: 'Classic Gundam mecha featured in the original Mobile Suit Gundam anime series.',
    imageUrl: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png', 
    thumbnailUrl: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
    tags: ['anime', 'mecha', 'gundam', 'collectible'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'classic',
        borderRadius: '4px',
        borderColor: '#f43f5e',
        frameColor: '#f43f5e',
        frameWidth: 2,
        shadowColor: 'rgba(244, 63, 94, 0.4)',
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
        category: 'pop-art',
        cardType: 'vintage',
        series: 'anime-classics'
      }
    }
  },
  {
    id: 'card-002',
    title: 'Lakers Kobe Bryant',
    description: 'Limited edition Kobe Bryant collectible card featuring the Lakers legend.',
    imageUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    thumbnailUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    tags: ['basketball', 'lakers', 'kobe', 'nba'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    designMetadata: {
      cardStyle: {
        template: 'nifty',
        effect: 'nifty',
        borderRadius: '12px',
        borderColor: '#a855f7',
        frameColor: '#a855f7',
        frameWidth: 4,
        shadowColor: 'rgba(168, 85, 247, 0.6)',
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
        cardType: 'handcrafted',
        series: 'basketball-legends'
      }
    }
  },
  {
    id: 'card-003',
    title: 'Football Running Back',
    description: 'Dynamic action shot of an NFL running back breaking through defenses.',
    imageUrl: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png',
    thumbnailUrl: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png',
    tags: ['football', 'nfl', 'sports', 'running-back'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    designMetadata: {
      cardStyle: {
        template: 'nostalgic',
        effect: 'nostalgic',
        borderRadius: '8px',
        borderColor: '#22c55e',
        frameColor: '#22c55e',
        frameWidth: 3,
        shadowColor: 'rgba(34, 197, 94, 0.5)',
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
        category: 'sports',
        cardType: 'photograph',
        series: 'vintage-baseball'
      }
    }
  },
  {
    id: 'card-004',
    title: 'Golden Gate Quarterback',
    description: 'Iconic San Francisco quarterback with the Golden Gate bridge backdrop.',
    imageUrl: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png',
    thumbnailUrl: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png',
    tags: ['football', '49ers', 'san-francisco', 'vintage'],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    designMetadata: {
      cardStyle: {
        template: 'nostalgic',
        effect: 'nostalgic',
        borderRadius: '8px',
        borderColor: '#22c55e',
        frameColor: '#22c55e',
        frameWidth: 3,
        shadowColor: 'rgba(34, 197, 94, 0.5)',
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
        cardType: 'photograph',
        series: 'vintage-baseball'
      }
    }
  },
  {
    id: 'card-005',
    title: 'Garbage Pail Kids - Bob Ooze',
    description: 'Vintage 80s Garbage Pail Kids collectible card featuring classic gross-out humor.',
    imageUrl: '/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png',
    thumbnailUrl: '/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png',
    tags: ['vintage', '80s', 'garbage-pail-kids', 'collectible'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'classic',
        borderRadius: '4px',
        borderColor: '#f43f5e',
        frameColor: '#f43f5e', 
        frameWidth: 2,
        shadowColor: 'rgba(244, 63, 94, 0.4)',
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
        category: 'pop-art',
        cardType: 'vintage',
        series: '80s-vcr'
      }
    }
  },
  {
    id: 'card-006',
    title: 'LeBron James - Lakers Legend',
    description: 'Special edition Lakers LeBron James card with artistic surreal background.',
    imageUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    thumbnailUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    tags: ['basketball', 'lakers', 'lebron', 'nba'],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    userId: 'demo-user',
    designMetadata: {
      cardStyle: {
        template: 'nifty',
        effect: 'nifty',
        borderRadius: '12px',
        borderColor: '#a855f7',
        frameColor: '#a855f7',
        frameWidth: 4,
        shadowColor: 'rgba(168, 85, 247, 0.6)',
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
        category: 'sports',
        cardType: 'ai-generated',
        series: 'basketball-legends'
      }
    }
  }
];
