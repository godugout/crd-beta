
import { DesignMetadata } from '@/lib/types/cardTypes';

/**
 * Card Template Interface
 * Standardized definition for card templates
 */
export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  previewUrl: string; // URL to template preview image
  sport?: string; // Category/sport this template is designed for
  style?: string; // Visual style (e.g., "modern", "retro", "classic")
  designMetadata: DesignMetadata; // Pre-configured design settings
  tags: string[];
  created: string;
  popularity: number; // Usage count or rating
  featured: boolean;
  previewOverrides?: Record<string, any>; // Optional overrides for preview display
}

/**
 * Default templates library
 */
const defaultTemplates: CardTemplate[] = [
  {
    id: 'classic-baseball',
    name: 'Classic Baseball',
    description: 'Traditional baseball card layout with clean borders',
    previewUrl: '/images/card-placeholder.png',
    sport: 'baseball',
    style: 'classic',
    designMetadata: {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderWidth: 2,
        borderColor: '#000000',
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0,0,0,0.2)',
        frameWidth: 2,
        frameColor: '#000000',
      },
      textStyle: {
        fontFamily: 'Inter',
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#000000',
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333',
      },
      cardMetadata: {
        category: 'sports',
        series: 'baseball',
        cardType: 'player',
      },
      marketMetadata: {
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 1,
        editionNumber: 1,
      }
    },
    tags: ['baseball', 'classic', 'traditional'],
    created: '2023-01-01',
    popularity: 100,
    featured: true
  },
  {
    id: 'modern-basketball',
    name: 'Modern Basketball',
    description: 'Contemporary design for basketball players',
    previewUrl: '/images/card-placeholder.png',
    sport: 'basketball',
    style: 'modern',
    designMetadata: {
      cardStyle: {
        template: 'modern',
        effect: 'gloss',
        borderRadius: '16px',
        borderWidth: 0,
        borderColor: '#000000',
        backgroundColor: '#f8f8f8',
        shadowColor: 'rgba(0,0,0,0.3)',
        frameWidth: 0,
        frameColor: '#000000',
      },
      textStyle: {
        fontFamily: 'Arial',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#000000',
        titleColor: '#333333',
        titleAlignment: 'left',
        titleWeight: 'bold',
        descriptionColor: '#666666',
      },
      cardMetadata: {
        category: 'sports',
        series: 'basketball',
        cardType: 'player',
      },
      marketMetadata: {
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 1,
        editionNumber: 1,
      }
    },
    tags: ['basketball', 'modern', 'sleek'],
    created: '2023-02-15',
    popularity: 85,
    featured: true
  },
  {
    id: 'vintage-football',
    name: 'Vintage Football',
    description: 'Retro-styled football card design',
    previewUrl: '/images/card-placeholder.png',
    sport: 'football',
    style: 'vintage',
    designMetadata: {
      cardStyle: {
        template: 'vintage',
        effect: 'none',
        borderRadius: '4px',
        borderWidth: 2,
        borderColor: '#d4a76a',
        backgroundColor: '#f9f2e1',
        shadowColor: 'rgba(139, 69, 19, 0.2)',
        frameWidth: 5,
        frameColor: '#8b4513',
      },
      textStyle: {
        fontFamily: 'Georgia',
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#543b22',
        titleColor: '#3c2b15',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#6b563d',
      },
      cardMetadata: {
        category: 'sports',
        series: 'football',
        cardType: 'player',
      },
      marketMetadata: {
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 1,
        editionNumber: 1,
      }
    },
    tags: ['football', 'vintage', 'retro'],
    created: '2023-03-10',
    popularity: 70,
    featured: false
  }
];

export { defaultTemplates };
