
import { Card } from '@/lib/types/cardTypes';

/**
 * Legacy CardData type for backward compatibility
 */
export interface CardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  userId: string;
  effects: string[];
  createdAt: string;
  updatedAt: string;
  // Additional properties used in home components
  backgroundColor?: string;
  name?: string;
  team?: string;
  jersey?: string;
  set?: string;
  year?: string;
  specialEffect?: string;
  cardType?: string;
  artist?: string;
  cardNumber?: string;
  designMetadata: {
    cardStyle: {
      template: string;
      effect: string;
      borderRadius: string;
      borderColor: string;
      frameColor: string;
      frameWidth: number;
      shadowColor: string;
    };
    textStyle: {
      titleColor: string;
      titleAlignment: string;
      titleWeight: string;
      descriptionColor: string;
    };
    cardMetadata: {
      category?: string;
      series?: string;
      cardType?: string;
    };
    marketMetadata: {
      price?: number;
      currency?: string;
      availableForSale?: boolean;
      editionSize?: number;
      editionNumber?: number;
    };
  };
}

// Define CardTemplate type to fix template system issues
export interface CardTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail: string;
  category: string;
  designDefaults: {
    cardStyle: Partial<CardStyle>;
    textStyle?: Partial<TextStyle>;
    effects?: string[];
  };
}

/**
 * Helper function to convert between Card and CardData types
 */
export function adaptCardToCardData(card: Card): CardData {
  return {
    id: card.id,
    title: card.title,
    description: card.description || '',
    imageUrl: card.imageUrl,
    thumbnailUrl: card.thumbnailUrl || card.imageUrl,
    tags: card.tags || [],
    userId: card.userId,
    effects: card.effects || [],
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    // Map legacy fields
    name: card.player || card.name,
    team: card.team,
    jersey: card.jersey,
    year: card.year,
    set: card.set,
    cardType: card.cardType,
    artist: card.artist,
    cardNumber: card.cardNumber,
    backgroundColor: card.backgroundColor,
    specialEffect: card.specialEffect,
    designMetadata: card.designMetadata || {
      cardStyle: {
        template: 'classic',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        frameColor: '#000000',
        frameWidth: 2,
        shadowColor: 'rgba(0,0,0,0.2)',
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333',
      },
      cardMetadata: {
        category: 'general',
        series: 'base',
        cardType: 'standard',
      },
      marketMetadata: {
        price: 0,
        currency: 'USD',
        availableForSale: false,
        editionSize: 0,
        editionNumber: 0
      }
    }
  };
}

// Import types from cardTypes.ts
import { CardStyle, TextStyle } from '@/lib/types/cardTypes';

// Export from @/types/card to prevent errors in other imports
export { Card, CardStyle, TextStyle, CardTemplate };
