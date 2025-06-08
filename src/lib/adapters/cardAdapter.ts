
import { Card } from '@/lib/types/cardTypes';
import { CardData } from '@/lib/types/CardData';

/**
 * Properly typed Card interface for consistent usage
 */
interface ProcessedCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  userId: string;
  tags: string[];
  effects: string[];
  designMetadata: {
    cardStyle: {
      template: string;
      effect: string;
      borderRadius: string;
      borderColor: string;
      frameColor: string;
      frameWidth: number;
      shadowColor: string;
      [key: string]: any;
    };
    textStyle: {
      titleColor: string;
      titleAlignment: string;
      titleWeight: string;
      descriptionColor: string;
      [key: string]: any;
    };
    marketMetadata: {
      isPrintable: boolean;
      isForSale: boolean;
      includeInCatalog: boolean;
      [key: string]: any;
    };
    cardMetadata: {
      category: string;
      cardType: string;
      series: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  // Include optional properties from Card
  player?: string;
  team?: string;
  year?: string;
  jersey?: string;
  set?: string;
  cardNumber?: string;
  artist?: string;
  backgroundColor?: string;
  specialEffect?: string;
  [key: string]: any;
}

/**
 * Adapter function to convert various card data formats to a properly typed ProcessedCard
 * Ensures all required fields are present with sensible defaults
 */
export function adaptToCard(cardData: Partial<Card> | CardData | any): ProcessedCard {
  // Handle CardData type conversion
  if ('name' in cardData && 'team' in cardData) {
    const data = cardData as CardData;
    return {
      id: data.id,
      title: data.name,
      description: data.description || '',
      imageUrl: data.imageUrl || '/images/card-placeholder.png',
      thumbnailUrl: data.imageUrl || '/images/card-placeholder.png',
      userId: 'default-user',
      tags: data.effects || [],
      effects: data.effects || [],
      player: data.name,
      team: data.team,
      year: data.year,
      jersey: data.jersey,
      set: data.set,
      cardNumber: data.cardNumber,
      cardType: data.cardType,
      artist: data.artist,
      backgroundColor: data.backgroundColor,
      specialEffect: data.specialEffect,
      designMetadata: {
        cardStyle: {
          template: 'classic',
          effect: data.specialEffect || 'none',
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
        marketMetadata: {
          isPrintable: false,
          isForSale: false,
          includeInCatalog: false,
        },
        cardMetadata: {
          category: 'general',
          cardType: data.cardType || 'standard',
          series: data.set || 'base',
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Handle partial Card data with proper type enforcement
  const card = cardData as Partial<Card>;
  
  // Create a properly structured designMetadata with all required defaults
  const processedCard: ProcessedCard = {
    id: card.id || 'unknown',
    title: card.title || 'Untitled Card',
    description: card.description || '',
    imageUrl: card.imageUrl || '/images/card-placeholder.png',
    thumbnailUrl: card.thumbnailUrl || card.imageUrl || '/images/card-placeholder.png',
    userId: card.userId || 'default-user',
    tags: card.tags || [],
    effects: card.effects || [],
    designMetadata: {
      cardStyle: {
        template: card.designMetadata?.cardStyle?.template || 'classic',
        effect: card.designMetadata?.cardStyle?.effect || 'none',
        borderRadius: card.designMetadata?.cardStyle?.borderRadius || '8px',
        borderColor: card.designMetadata?.cardStyle?.borderColor || '#000000',
        frameColor: card.designMetadata?.cardStyle?.frameColor || '#000000',
        frameWidth: card.designMetadata?.cardStyle?.frameWidth || 2,
        shadowColor: card.designMetadata?.cardStyle?.shadowColor || 'rgba(0,0,0,0.2)',
        // Preserve any additional properties
        ...card.designMetadata?.cardStyle
      },
      textStyle: {
        titleColor: card.designMetadata?.textStyle?.titleColor || '#000000',
        titleAlignment: card.designMetadata?.textStyle?.titleAlignment || 'center',
        titleWeight: card.designMetadata?.textStyle?.titleWeight || 'bold',
        descriptionColor: card.designMetadata?.textStyle?.descriptionColor || '#333333',
        // Preserve any additional properties
        ...card.designMetadata?.textStyle
      },
      marketMetadata: {
        isPrintable: card.designMetadata?.marketMetadata?.isPrintable || false,
        isForSale: card.designMetadata?.marketMetadata?.isForSale || false,
        includeInCatalog: card.designMetadata?.marketMetadata?.includeInCatalog || false,
        // Preserve any additional properties
        ...card.designMetadata?.marketMetadata
      },
      cardMetadata: {
        category: card.designMetadata?.cardMetadata?.category || 'general',
        cardType: card.designMetadata?.cardMetadata?.cardType || 'standard',
        series: card.designMetadata?.cardMetadata?.series || 'base',
        // Preserve any additional properties
        ...card.designMetadata?.cardMetadata
      },
      // Preserve any additional metadata properties
      ...card.designMetadata
    },
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
  };

  // Add optional properties safely
  if (card.player) processedCard.player = card.player;
  if (card.team) processedCard.team = card.team;
  if (card.year) processedCard.year = card.year;
  if (card.jersey) processedCard.jersey = card.jersey;
  if (card.set) processedCard.set = card.set;
  if (card.cardNumber) processedCard.cardNumber = card.cardNumber;
  if (card.cardType) processedCard.cardType = card.cardType;
  if (card.artist) processedCard.artist = card.artist;
  if (card.backgroundColor) processedCard.backgroundColor = card.backgroundColor;
  if (card.specialEffect) processedCard.specialEffect = card.specialEffect;

  return processedCard;
}

// Export the ProcessedCard type for use in components
export type { ProcessedCard };
