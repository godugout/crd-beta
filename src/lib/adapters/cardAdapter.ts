
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
  
  // Get design metadata with defaults
  const cardStyleDefaults = {
    template: 'classic',
    effect: 'none',
    borderRadius: '8px',
    borderColor: '#000000',
    frameColor: '#000000',
    frameWidth: 2,
    shadowColor: 'rgba(0,0,0,0.2)',
  };

  const textStyleDefaults = {
    titleColor: '#000000',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#333333',
  };

  const marketMetadataDefaults = {
    isPrintable: false,
    isForSale: false,
    includeInCatalog: false,
  };

  const cardMetadataDefaults = {
    category: 'general',
    cardType: 'standard',
    series: 'base',
  };

  // Create a properly structured ProcessedCard with explicit defaults
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
        template: card.designMetadata?.cardStyle?.template || cardStyleDefaults.template,
        effect: card.designMetadata?.cardStyle?.effect || cardStyleDefaults.effect,
        borderRadius: card.designMetadata?.cardStyle?.borderRadius || cardStyleDefaults.borderRadius,
        borderColor: card.designMetadata?.cardStyle?.borderColor || cardStyleDefaults.borderColor,
        frameColor: card.designMetadata?.cardStyle?.frameColor || cardStyleDefaults.frameColor,
        frameWidth: card.designMetadata?.cardStyle?.frameWidth || cardStyleDefaults.frameWidth,
        shadowColor: card.designMetadata?.cardStyle?.shadowColor || cardStyleDefaults.shadowColor,
        // Preserve any additional properties
        ...(card.designMetadata?.cardStyle ? Object.fromEntries(
          Object.entries(card.designMetadata.cardStyle).filter(([key]) => 
            !['template', 'effect', 'borderRadius', 'borderColor', 'frameColor', 'frameWidth', 'shadowColor'].includes(key)
          )
        ) : {})
      },
      textStyle: {
        titleColor: card.designMetadata?.textStyle?.titleColor || textStyleDefaults.titleColor,
        titleAlignment: card.designMetadata?.textStyle?.titleAlignment || textStyleDefaults.titleAlignment,
        titleWeight: card.designMetadata?.textStyle?.titleWeight || textStyleDefaults.titleWeight,
        descriptionColor: card.designMetadata?.textStyle?.descriptionColor || textStyleDefaults.descriptionColor,
        // Preserve any additional properties
        ...(card.designMetadata?.textStyle ? Object.fromEntries(
          Object.entries(card.designMetadata.textStyle).filter(([key]) => 
            !['titleColor', 'titleAlignment', 'titleWeight', 'descriptionColor'].includes(key)
          )
        ) : {})
      },
      marketMetadata: {
        isPrintable: card.designMetadata?.marketMetadata?.isPrintable ?? marketMetadataDefaults.isPrintable,
        isForSale: card.designMetadata?.marketMetadata?.isForSale ?? marketMetadataDefaults.isForSale,
        includeInCatalog: card.designMetadata?.marketMetadata?.includeInCatalog ?? marketMetadataDefaults.includeInCatalog,
        // Preserve any additional properties
        ...(card.designMetadata?.marketMetadata ? Object.fromEntries(
          Object.entries(card.designMetadata.marketMetadata).filter(([key]) => 
            !['isPrintable', 'isForSale', 'includeInCatalog'].includes(key)
          )
        ) : {})
      },
      cardMetadata: {
        category: card.designMetadata?.cardMetadata?.category || cardMetadataDefaults.category,
        cardType: card.designMetadata?.cardMetadata?.cardType || cardMetadataDefaults.cardType,
        series: card.designMetadata?.cardMetadata?.series || cardMetadataDefaults.series,
        // Preserve any additional properties
        ...(card.designMetadata?.cardMetadata ? Object.fromEntries(
          Object.entries(card.designMetadata.cardMetadata).filter(([key]) => 
            !['category', 'cardType', 'series'].includes(key)
          )
        ) : {})
      },
      // Preserve any additional metadata properties
      ...(card.designMetadata ? Object.fromEntries(
        Object.entries(card.designMetadata).filter(([key]) => 
          !['cardStyle', 'textStyle', 'marketMetadata', 'cardMetadata'].includes(key)
        )
      ) : {})
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
