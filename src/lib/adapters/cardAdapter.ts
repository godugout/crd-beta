
import { Card } from '@/lib/types/cardTypes';
import { v4 as uuidv4 } from 'uuid';

// Default card structure with required fields
export const createEmptyCard = (): Card => {
  return {
    id: uuidv4(),
    title: '',
    description: '',
    imageUrl: '',
    tags: [],
    userId: '',
    effects: [],
    designMetadata: {
      cardStyle: {
        template: 'basic',
        effect: 'none',
        borderRadius: '12px',
        borderColor: '#000000',
        shadowColor: '#000000',
        frameWidth: 0,
        frameColor: '#000000'
      },
      textStyle: {
        fontFamily: 'Inter',
        fontSize: '16px',
        fontWeight: '400',
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {},
      marketMetadata: {}
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Function to adapt any card-like object to a standard Card type
export const adaptToCard = (source: any): Card => {
  // Start with an empty card
  const baseCard = createEmptyCard();
  
  // Merge the source data with our base card, with proper fallbacks
  const adaptedCard: Card = {
    ...baseCard,
    ...source,
    // Ensure designMetadata exists and has the right structure
    designMetadata: {
      ...baseCard.designMetadata,
      ...(source.designMetadata || {}),
      // Ensure cardStyle exists and has required fields
      cardStyle: {
        ...baseCard.designMetadata.cardStyle,
        ...(source.designMetadata?.cardStyle || {})
      },
      // Ensure textStyle exists and has required fields
      textStyle: {
        ...baseCard.designMetadata.textStyle,
        ...(source.designMetadata?.textStyle || {})
      },
      // Ensure other metadata structures exist
      cardMetadata: {
        ...baseCard.designMetadata.cardMetadata,
        ...(source.designMetadata?.cardMetadata || {})
      },
      marketMetadata: {
        ...baseCard.designMetadata.marketMetadata,
        ...(source.designMetadata?.marketMetadata || {})
      }
    },
    // Ensure tags is an array
    tags: Array.isArray(source.tags) ? source.tags : baseCard.tags,
    // Ensure effects is an array
    effects: Array.isArray(source.effects) ? source.effects : baseCard.effects,
  };
  
  // Ensure thumbnail exists or use main image
  if (!adaptedCard.thumbnailUrl && adaptedCard.imageUrl) {
    adaptedCard.thumbnailUrl = adaptedCard.imageUrl;
  }
  
  return adaptedCard;
};

// Function to convert an array of card-like objects to Card[] type
export const adaptCardsArray = (cards: any[]): Card[] => {
  return cards.map(card => adaptToCard(card));
};
