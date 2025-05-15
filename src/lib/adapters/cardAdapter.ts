
import { Card as CardTypesCard } from '@/lib/types/cardTypes';
import { Card as SchemaCard } from '@/lib/schema/types';
import { CardData } from '@/types/card';

/**
 * Convert from one card type to another based on the specific requirements
 * This adapter ensures consistency between different card type formats
 */
export const adaptToCard = (source: any): CardTypesCard => {
  // Ensure we have a valid designMetadata
  const designMetadata = source.designMetadata || {
    cardStyle: {
      template: 'classic',
      effect: 'none',
      borderRadius: '8px',
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
      category: 'general',
      series: 'base',
      cardType: 'standard',
    },
    marketMetadata: {
      price: 0,
      currency: 'USD',
      availableForSale: false,
      editionSize: 1,
      editionNumber: 1,
    }
  };

  return {
    id: source.id || `card-${Date.now()}`,
    title: source.title || '',
    description: source.description || '',
    imageUrl: source.imageUrl || source.image || '',
    thumbnailUrl: source.thumbnailUrl || source.imageUrl || '',
    tags: source.tags || [],
    userId: source.userId || source.creatorId || '',
    effects: source.effects || [],
    
    // Properties for compatibility
    player: source.player || '',
    team: source.team || '',
    year: source.year || '',
    
    // Metadata
    designMetadata,
    
    // Standard fields
    createdAt: source.createdAt || new Date().toISOString(),
    updatedAt: source.updatedAt || new Date().toISOString(),
  };
};

/**
 * Convert from Card type to CardData type for backwards compatibility
 */
export const adaptCardToCardData = (card: CardTypesCard): CardData => {
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
    name: card.player || card.name || '',
    team: card.team,
    jersey: card.jersey || '',
    year: card.year,
    set: card.set || '',
    cardType: card.cardType || '',
    artist: card.artist || '',
    cardNumber: card.cardNumber || '',
    backgroundColor: card.backgroundColor || '',
    specialEffect: card.specialEffect || '',
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
};
