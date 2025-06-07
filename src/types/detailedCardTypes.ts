

import { Card, DesignMetadata, CardRarity, CardStats } from '@/lib/types/cardTypes';

/**
 * Card type with required fields for detail views
 * This type ensures all properties that are optional in the base Card type
 * but required in detail views are explicitly defined as required
 */
export interface DetailedViewCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  effects: string[];
  isFavorite: boolean;
  rarity: CardRarity;
  designMetadata: DesignMetadata; // Use the flexible DesignMetadata type from cardTypes
  
  // Add baseball card properties
  player?: string;
  team?: string;
  year?: string;
  cardNumber?: string;
  set?: string;
  cardType?: string;
  stats?: CardStats;
}

/**
 * Ensures a card has all required properties for detailed views
 * Handles optional properties by providing defaults
 */
export function ensureDetailedViewCard(card: Card): DetailedViewCard {
  // Ensure designMetadata has the required structure with proper defaults
  const ensuredDesignMetadata: DesignMetadata = {
    cardStyle: {
      template: card.designMetadata?.cardStyle?.template || 'standard',
      effect: card.designMetadata?.cardStyle?.effect || 'none',
      borderRadius: card.designMetadata?.cardStyle?.borderRadius || '8px',
      borderColor: card.designMetadata?.cardStyle?.borderColor || '#000000',
      frameWidth: card.designMetadata?.cardStyle?.frameWidth || 2,
      frameColor: card.designMetadata?.cardStyle?.frameColor || '#000000',
      shadowColor: card.designMetadata?.cardStyle?.shadowColor || 'rgba(0,0,0,0.2)',
      // Preserve any additional properties from the original
      ...(card.designMetadata?.cardStyle || {})
    },
    textStyle: {
      titleColor: card.designMetadata?.textStyle?.titleColor || '#000000',
      descriptionColor: card.designMetadata?.textStyle?.descriptionColor || '#333333',
      // Preserve any additional properties from the original
      ...(card.designMetadata?.textStyle || {})
    },
    cardMetadata: {
      category: card.designMetadata?.cardMetadata?.category || 'Standard',
      series: card.designMetadata?.cardMetadata?.series || 'Base',
      cardType: card.designMetadata?.cardMetadata?.cardType || 'Standard',
      // Preserve any additional properties from the original
      ...(card.designMetadata?.cardMetadata || {})
    },
    marketMetadata: {
      isPrintable: card.designMetadata?.marketMetadata?.isPrintable || false,
      isForSale: card.designMetadata?.marketMetadata?.isForSale || false,
      includeInCatalog: card.designMetadata?.marketMetadata?.includeInCatalog || false,
      // Preserve any additional properties from the original
      ...(card.designMetadata?.marketMetadata || {})
    },
    // Preserve any additional top-level properties from the original designMetadata
    ...(card.designMetadata || {})
  };

  return {
    id: card.id,
    title: card.title || 'Untitled Card',
    description: card.description || '',
    imageUrl: card.imageUrl || '/placeholder-card.png',
    thumbnailUrl: card.thumbnailUrl || card.imageUrl || '/placeholder-card-thumb.png',
    tags: card.tags || [],
    createdAt: card.createdAt || new Date().toISOString(),
    updatedAt: card.updatedAt || new Date().toISOString(),
    userId: card.userId || 'unknown-user',
    effects: card.effects || [],
    isFavorite: false, // Since Card type doesn't have isFavorite, we set a default value
    rarity: card.rarity || 'common', // This will be compatible with CardRarity
    designMetadata: ensuredDesignMetadata,
    // Copy optional baseball card properties
    player: card.player,
    team: card.team,
    year: card.year,
    cardNumber: card.cardNumber,
    set: card.set,
    cardType: card.cardType,
    stats: card.stats,
  };
}

