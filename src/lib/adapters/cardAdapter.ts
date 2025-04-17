
import { Card, DesignMetadata } from '@/lib/types';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';

/**
 * Adapts partial card data to a complete Card object
 */
export const adaptToCard = (data: Partial<Card>): Card => {
  const now = new Date().toISOString();
  
  // Ensure designMetadata has all required properties
  const designMetadata: DesignMetadata = {
    ...DEFAULT_DESIGN_METADATA,
    ...data.designMetadata,
    cardStyle: {
      ...DEFAULT_DESIGN_METADATA.cardStyle,
      ...data.designMetadata?.cardStyle
    },
    textStyle: {
      ...DEFAULT_DESIGN_METADATA.textStyle,
      ...data.designMetadata?.textStyle
    },
    cardMetadata: {
      ...DEFAULT_DESIGN_METADATA.cardMetadata,
      ...data.designMetadata?.cardMetadata
    },
    marketMetadata: {
      ...DEFAULT_DESIGN_METADATA.marketMetadata,
      ...data.designMetadata?.marketMetadata
    }
  };

  return {
    id: data.id || `card-${Date.now()}`,
    title: data.title || 'Untitled Card',
    description: data.description || '',
    imageUrl: data.imageUrl || '/placeholder-card.png',
    thumbnailUrl: data.thumbnailUrl || data.imageUrl || '/placeholder-card-thumb.png',
    tags: data.tags || [],
    userId: data.userId || 'anonymous',
    effects: data.effects || [],
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    player: data.player,
    team: data.team,
    year: data.year,
    collectionId: data.collectionId,
    reactions: data.reactions || [],
    comments: data.comments || [],
    rarity: data.rarity,
    fabricSwatches: data.fabricSwatches || [],
    designMetadata
  };
};
