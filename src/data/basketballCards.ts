
import { Card } from '@/lib/types';

// Original basketball cards with colored backgrounds and famous people
export const basketballCards: Card[] = [
  {
    id: 'basketball-1',
    title: 'Michael Jordan',
    description: 'Chicago Bulls Legend - 6x NBA Champion',
    imageUrl: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
    thumbnailUrl: '/lovable-uploads/667e6ad2-af96-40ac-bd16-a69778e14b21.png',
    tags: ['basketball', 'nba', 'chicago-bulls', 'legend'],
    userId: 'system',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    effects: ['holographic'],
    player: 'Michael Jordan',
    team: 'Chicago Bulls',
    year: '1991',
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'holographic',
        borderRadius: '12px',
        borderColor: '#DC2626',
        shadowColor: 'rgba(220, 38, 38, 0.4)',
        frameWidth: 3,
        frameColor: '#DC2626',
        backgroundColor: '#DC2626'
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#FEE2E2'
      },
      cardMetadata: {
        category: 'sports',
        series: 'NBA Legends',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      }
    }
  },
  {
    id: 'basketball-2',
    title: 'LeBron James',
    description: 'Lakers Superstar - 4x NBA Champion',
    imageUrl: '/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png',
    thumbnailUrl: '/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png',
    tags: ['basketball', 'nba', 'lakers', 'superstar'],
    userId: 'system',
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString(),
    effects: ['foil'],
    player: 'LeBron James',
    team: 'Los Angeles Lakers',
    year: '2020',
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'foil',
        borderRadius: '12px',
        borderColor: '#F59E0B',
        shadowColor: 'rgba(245, 158, 11, 0.4)',
        frameWidth: 3,
        frameColor: '#F59E0B',
        backgroundColor: '#F59E0B'
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#FEF3C7'
      },
      cardMetadata: {
        category: 'sports',
        series: 'NBA Legends',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      }
    }
  },
  {
    id: 'basketball-3',
    title: 'Stephen Curry',
    description: 'Warriors Point Guard - 3x NBA Champion',
    imageUrl: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
    thumbnailUrl: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
    tags: ['basketball', 'nba', 'warriors', 'shooter'],
    userId: 'system',
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-03').toISOString(),
    effects: ['refractor'],
    player: 'Stephen Curry',
    team: 'Golden State Warriors',
    year: '2022',
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'refractor',
        borderRadius: '12px',
        borderColor: '#3B82F6',
        shadowColor: 'rgba(59, 130, 246, 0.4)',
        frameWidth: 3,
        frameColor: '#3B82F6',
        backgroundColor: '#3B82F6'
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#DBEAFE'
      },
      cardMetadata: {
        category: 'sports',
        series: 'NBA Legends',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      }
    }
  },
  {
    id: 'basketball-4',
    title: 'Kobe Bryant',
    description: 'Lakers Legend - 5x NBA Champion',
    imageUrl: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png',
    thumbnailUrl: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png',
    tags: ['basketball', 'nba', 'lakers', 'legend', 'mamba'],
    userId: 'system',
    createdAt: new Date('2024-01-04').toISOString(),
    updatedAt: new Date('2024-01-04').toISOString(),
    effects: ['chrome'],
    player: 'Kobe Bryant',
    team: 'Los Angeles Lakers',
    year: '2009',
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'chrome',
        borderRadius: '12px',
        borderColor: '#7C3AED',
        shadowColor: 'rgba(124, 58, 237, 0.4)',
        frameWidth: 3,
        frameColor: '#7C3AED',
        backgroundColor: '#7C3AED'
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#EDE9FE'
      },
      cardMetadata: {
        category: 'sports',
        series: 'NBA Legends',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      }
    }
  },
  {
    id: 'basketball-5',
    title: 'Shaquille O\'Neal',
    description: 'Lakers Center - 4x NBA Champion',
    imageUrl: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png',
    thumbnailUrl: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png',
    tags: ['basketball', 'nba', 'lakers', 'center', 'dominant'],
    userId: 'system',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString(),
    effects: ['foil'],
    player: 'Shaquille O\'Neal',
    team: 'Los Angeles Lakers',
    year: '2001',
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'foil',
        borderRadius: '12px',
        borderColor: '#10B981',
        shadowColor: 'rgba(16, 185, 129, 0.4)',
        frameWidth: 3,
        frameColor: '#10B981',
        backgroundColor: '#10B981'
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#D1FAE5'
      },
      cardMetadata: {
        category: 'sports',
        series: 'NBA Legends',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      }
    }
  },
  {
    id: 'basketball-6',
    title: 'Magic Johnson',
    description: 'Lakers Point Guard - 5x NBA Champion',
    imageUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    thumbnailUrl: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    tags: ['basketball', 'nba', 'lakers', 'point-guard', 'showtime'],
    userId: 'system',
    createdAt: new Date('2024-01-06').toISOString(),
    updatedAt: new Date('2024-01-06').toISOString(),
    effects: ['holographic'],
    player: 'Magic Johnson',
    team: 'Los Angeles Lakers',
    year: '1987',
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'holographic',
        borderRadius: '12px',
        borderColor: '#EC4899',
        shadowColor: 'rgba(236, 72, 153, 0.4)',
        frameWidth: 3,
        frameColor: '#EC4899',
        backgroundColor: '#EC4899'
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#FCE7F3'
      },
      cardMetadata: {
        category: 'sports',
        series: 'NBA Legends',
        cardType: 'player'
      },
      marketMetadata: {
        isPrintable: true,
        isForSale: false,
        includeInCatalog: true
      }
    }
  }
];
