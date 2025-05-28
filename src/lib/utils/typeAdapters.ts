
import { Card } from '@/lib/types/cardTypes';
import { ElementPosition, ElementTransform } from '@/lib/types/elementTypes';

export const adaptElementPosition = (position: any): ElementPosition => {
  return {
    x: position?.x || 0,
    y: position?.y || 0,
    z: position?.z || 0,
  };
};

export const adaptElementTransform = (transform: any): ElementTransform => {
  return {
    translateX: transform?.translateX || 0,
    translateY: transform?.translateY || 0,
    rotation: transform?.rotate || 0,
    scaleX: transform?.scaleX || 1,
    scaleY: transform?.scaleY || 1,
    scale: transform?.scale || 1,
  };
};

export const adaptCardData = (cardData: any): Partial<Card> => {
  return {
    id: cardData.id,
    title: cardData.title || '',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
    tags: cardData.tags || [],
    effects: cardData.effects || [],
    userId: cardData.userId || 'anonymous',
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    designMetadata: cardData.designMetadata || {
      cardStyle: {
        template: 'standard',
        effect: 'none',
        borderRadius: '8px',
        borderColor: '#000000',
        frameWidth: 2,
        frameColor: '#000000',
        shadowColor: 'rgba(0,0,0,0.2)'
      },
      textStyle: {
        titleColor: '#000000',
        titleAlignment: 'center',
        titleWeight: 'bold',
        descriptionColor: '#333333'
      },
      cardMetadata: {
        category: 'Standard',
        series: 'Base',
        cardType: 'Standard'
      },
      marketMetadata: {
        isPrintable: false,
        isForSale: false,
        includeInCatalog: false
      }
    }
  };
};
