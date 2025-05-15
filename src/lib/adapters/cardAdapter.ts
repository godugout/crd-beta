
import { Card } from '@/lib/types/cardTypes';

/**
 * Adapts a Card object to ensure all required fields are present
 */
export const adaptCardToSchema = (card: Card): Card => {
  // Ensure description exists
  const description = card.description || '';
  
  // Ensure thumbnailUrl exists
  const thumbnailUrl = card.thumbnailUrl || card.imageUrl;
  
  // Ensure designMetadata has all required nested properties
  const designMetadata = {
    cardStyle: {
      template: 'default',
      effect: 'none',
      borderRadius: '12px',
      borderColor: '#000000',
      shadowColor: '#000000',
      frameWidth: 0,
      frameColor: '#000000',
      ...(card.designMetadata?.cardStyle || {})
    },
    textStyle: {
      titleColor: '#000000',
      titleAlignment: 'center',
      titleWeight: 'bold',
      descriptionColor: '#666666',
      ...(card.designMetadata?.textStyle || {})
    },
    marketMetadata: {
      ...(card.designMetadata?.marketMetadata || {})
    },
    cardMetadata: {
      ...(card.designMetadata?.cardMetadata || {})
    },
    ...(card.designMetadata || {})
  };
  
  return {
    ...card,
    description,
    thumbnailUrl,
    designMetadata
  };
};
