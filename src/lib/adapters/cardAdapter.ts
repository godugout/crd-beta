
import { Card as CardTypes } from "@/lib/types/cardTypes";
import { Card as LegacyCard } from "@/lib/types/card";

// Default values for mandatory fields
const DEFAULT_CARD_VALUES = {
  description: '',
  thumbnailUrl: '',
  tags: [] as string[],
  effects: [] as string[],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  designMetadata: {
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
    marketMetadata: {
      isPrintable: false,
      isForSale: false,
      includeInCatalog: false,
    },
    cardMetadata: {
      category: 'general',
      cardType: 'standard',
      series: 'base',
    },
  }
};

// Adapt any card-like object to a fully valid Card type
export function adaptToCard(partialCard: Partial<CardTypes>): CardTypes {
  return {
    ...DEFAULT_CARD_VALUES,
    id: partialCard.id || '',
    title: partialCard.title || '',
    imageUrl: partialCard.imageUrl || '',
    userId: partialCard.userId || '',
    ...partialCard,
    // Ensure we have required nested objects
    designMetadata: {
      ...DEFAULT_CARD_VALUES.designMetadata,
      ...partialCard.designMetadata,
      cardStyle: {
        ...DEFAULT_CARD_VALUES.designMetadata.cardStyle,
        ...partialCard.designMetadata?.cardStyle
      },
      textStyle: {
        ...DEFAULT_CARD_VALUES.designMetadata.textStyle,
        ...partialCard.designMetadata?.textStyle
      }
    },
    description: partialCard.description || DEFAULT_CARD_VALUES.description,
    thumbnailUrl: partialCard.thumbnailUrl || partialCard.imageUrl || DEFAULT_CARD_VALUES.thumbnailUrl,
    tags: partialCard.tags || DEFAULT_CARD_VALUES.tags,
    effects: partialCard.effects || DEFAULT_CARD_VALUES.effects,
  };
}

// Convert between Card versions
export function convertCardTypes(card: CardTypes | LegacyCard): CardTypes {
  return adaptToCard(card as Partial<CardTypes>);
}
