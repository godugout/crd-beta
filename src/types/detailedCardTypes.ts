
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
    designMetadata: card.designMetadata, // Use the designMetadata directly from the Card (which should have been processed by the adapter)
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
