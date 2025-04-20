
import { Card } from "@/lib/types/cardTypes";

export type DetailedViewCard = Card & {
  // Add any additional fields specific to the detailed view
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
    marketMetadata: {
      isPrintable: boolean;
      isForSale: boolean;
      includeInCatalog: boolean;
    };
    cardMetadata: {
      category: string;
      cardType: string;
      series: string;
    };
  };
};

export function ensureDetailedViewCard(card: Card): DetailedViewCard {
  // Ensure the card has all the required fields for detailed view
  const detailedCard: DetailedViewCard = {
    ...card,
    designMetadata: card.designMetadata || {
      cardStyle: {
        template: 'classic',
        effect: 'classic',
        borderRadius: '8px',
        borderColor: '#000000',
        frameColor: '#000000',
        frameWidth: 2,
        shadowColor: 'rgba(0,0,0,0.2)',
      },
      textStyle: {
        titleColor: '#FFFFFF',
        titleAlignment: 'left',
        titleWeight: 'bold',
        descriptionColor: '#FFFFFF',
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: true
      },
      cardMetadata: {
        category: 'sports',
        cardType: 'collectible',
        series: 'standard'
      }
    }
  };
  
  return detailedCard;
}
