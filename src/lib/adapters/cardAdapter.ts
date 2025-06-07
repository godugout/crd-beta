
import { Card } from '@/lib/types/cardTypes';

/**
 * Adapter function to ensure a card object has all required properties with proper defaults
 */
export function adaptToCard(input: Partial<Card>): Card {
  return {
    id: input.id || '',
    title: input.title || 'Untitled Card',
    description: input.description || '',
    imageUrl: input.imageUrl || '/images/card-placeholder.png',
    thumbnailUrl: input.thumbnailUrl || input.imageUrl || '/images/card-placeholder.png',
    tags: input.tags || [],
    userId: input.userId || '',
    effects: input.effects || [],
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString(),
    designMetadata: {
      cardStyle: {
        template: input.designMetadata?.cardStyle?.template || 'classic',
        effect: input.designMetadata?.cardStyle?.effect || 'none',
        borderRadius: input.designMetadata?.cardStyle?.borderRadius || '8px',
        borderColor: input.designMetadata?.cardStyle?.borderColor || '#000000',
        frameColor: input.designMetadata?.cardStyle?.frameColor || '#000000',
        frameWidth: input.designMetadata?.cardStyle?.frameWidth || 2,
        shadowColor: input.designMetadata?.cardStyle?.shadowColor || 'rgba(0,0,0,0.2)',
        ...input.designMetadata?.cardStyle
      },
      textStyle: {
        titleColor: input.designMetadata?.textStyle?.titleColor || '#000000',
        titleAlignment: input.designMetadata?.textStyle?.titleAlignment || 'center',
        titleWeight: input.designMetadata?.textStyle?.titleWeight || 'bold',
        descriptionColor: input.designMetadata?.textStyle?.descriptionColor || '#333333',
        ...input.designMetadata?.textStyle
      },
      marketMetadata: {
        isPrintable: input.designMetadata?.marketMetadata?.isPrintable || false,
        isForSale: input.designMetadata?.marketMetadata?.isForSale || false,
        includeInCatalog: input.designMetadata?.marketMetadata?.includeInCatalog || false,
        ...input.designMetadata?.marketMetadata
      },
      cardMetadata: {
        category: input.designMetadata?.cardMetadata?.category || 'general',
        cardType: input.designMetadata?.cardMetadata?.cardType || 'standard',
        series: input.designMetadata?.cardMetadata?.series || 'base',
        ...input.designMetadata?.cardMetadata
      },
      ...input.designMetadata
    },
    // Pass through all other properties
    ...input
  } as Card;
}
