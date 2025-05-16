
import { Card } from '@/lib/types/cardTypes';

/**
 * Legacy CardData type for backward compatibility
 */
export interface CardData {
  id: string;
  title: string;
  description: string; // Required by OldCardCreator
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  userId?: string;  // Make userId optional
  ownerId?: string;  // Add ownerId as an alternative
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
  textColor?: string; // Add textColor for sampleCards
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
      isPrintable?: boolean;
      isForSale?: boolean;
      includeInCatalog?: boolean;
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
  const defaultDesignMetadata = {
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
      editionNumber: 0,
      isPrintable: false,
      isForSale: false,
      includeInCatalog: false
    }
  };

  // Make sure we have all required properties in designMetadata
  let adaptedDesignMetadata = card.designMetadata || defaultDesignMetadata;
  adaptedDesignMetadata = {
    cardStyle: {
      template: adaptedDesignMetadata.cardStyle?.template || defaultDesignMetadata.cardStyle.template,
      effect: adaptedDesignMetadata.cardStyle?.effect || defaultDesignMetadata.cardStyle.effect,
      borderRadius: adaptedDesignMetadata.cardStyle?.borderRadius || defaultDesignMetadata.cardStyle.borderRadius,
      borderColor: adaptedDesignMetadata.cardStyle?.borderColor || defaultDesignMetadata.cardStyle.borderColor,
      frameColor: adaptedDesignMetadata.cardStyle?.frameColor || defaultDesignMetadata.cardStyle.frameColor,
      frameWidth: adaptedDesignMetadata.cardStyle?.frameWidth || defaultDesignMetadata.cardStyle.frameWidth,
      shadowColor: adaptedDesignMetadata.cardStyle?.shadowColor || defaultDesignMetadata.cardStyle.shadowColor
    },
    textStyle: {
      titleColor: adaptedDesignMetadata.textStyle?.titleColor || defaultDesignMetadata.textStyle.titleColor,
      titleAlignment: adaptedDesignMetadata.textStyle?.titleAlignment || defaultDesignMetadata.textStyle.titleAlignment,
      titleWeight: adaptedDesignMetadata.textStyle?.titleWeight || defaultDesignMetadata.textStyle.titleWeight,
      descriptionColor: adaptedDesignMetadata.textStyle?.descriptionColor || defaultDesignMetadata.textStyle.descriptionColor
    },
    cardMetadata: adaptedDesignMetadata.cardMetadata || defaultDesignMetadata.cardMetadata,
    marketMetadata: adaptedDesignMetadata.marketMetadata || defaultDesignMetadata.marketMetadata
  };

  return {
    id: card.id,
    title: card.title,
    description: card.description || '', // Ensure description exists for CardData
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
    textColor: card.textColor,
    designMetadata: adaptedDesignMetadata
  };
}

// Import types from cardTypes.ts
import { CardStyle, TextStyle } from '@/lib/types/cardTypes';

// Export from @/types/card to prevent errors in other imports
export type { Card, CardStyle, TextStyle, CardTemplate };
