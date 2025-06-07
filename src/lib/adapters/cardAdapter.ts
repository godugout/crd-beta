
import { Card } from '@/lib/types/cardTypes';
import { CardData } from '@/lib/types/CardData';

/**
 * Adapter function to convert various card data formats to the base Card type
 * Ensures all required fields are present with sensible defaults
 */
export function adaptToCard(cardData: Partial<Card> | CardData | any): Card {
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
  return {
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
      },
      textStyle: {
        titleColor: card.designMetadata?.textStyle?.titleColor || '#000000',
        titleAlignment: card.designMetadata?.textStyle?.titleAlignment || 'center',
        titleWeight: card.designMetadata?.textStyle?.titleWeight || 'bold',
        descriptionColor: card.designMetadata?.textStyle?.descriptionColor || '#333333',
      },
      marketMetadata: {
        isPrintable: card.designMetadata?.marketMetadata?.isPrintable || false,
        isForSale: card.designMetadata?.marketMetadata?.isForSale || false,
        includeInCatalog: card.designMetadata?.marketMetadata?.includeInCatalog || false,
      },
      cardMetadata: {
        category: card.designMetadata?.cardMetadata?.category || 'general',
        cardType: card.designMetadata?.cardMetadata?.cardType || 'standard',
        series: card.designMetadata?.cardMetadata?.series || 'base',
      },
    },
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
    // Include any additional properties safely
    ...(card.player && { player: card.player }),
    ...(card.team && { team: card.team }),
    ...(card.year && { year: card.year }),
    ...(card.jersey && { jersey: card.jersey }),
    ...(card.set && { set: card.set }),
    ...(card.cardNumber && { cardNumber: card.cardNumber }),
    ...(card.cardType && { cardType: card.cardType }),
    ...(card.artist && { artist: card.artist }),
    ...(card.backgroundColor && { backgroundColor: card.backgroundColor }),
    ...(card.specialEffect && { specialEffect: card.specialEffect }),
  };
}
