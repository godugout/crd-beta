
import { CardRarity, DesignMetadata } from './cardTypes';
import { BaseEntity } from '.';
import { Reaction } from './interaction';

/**
 * Card statistics including rarity, views, likes, and other metrics
 */
export interface CardStats {
  rarity: CardRarity;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  averageRating: number;
  totalRatings: number;
  [key: string]: number | string | CardRarity;
}

/**
 * Fabric swatch for baseball cards and memorabilia
 */
export interface FabricSwatch {
  id: string;
  name: string;
  color: string;
  fabricType: string;
  imageUrl?: string;
  thumbnail?: string;
  isAvailable: boolean;
  type?: string;
  team?: string;
  year?: string;
  manufacturer?: string;
  position?: string;
  size?: string;
}

/**
 * Core Card interface used throughout the application
 * Consolidated from multiple definitions to ensure consistency
 */
export interface Card extends BaseEntity {
  title: string;
  description: string; // Required field
  imageUrl: string;
  thumbnailUrl: string; // Made required to match most usage
  collectionId?: string;
  userId: string; // Made required to match most usage
  teamId?: string;
  isPublic?: boolean;
  tags: string[]; // Made required with empty array default
  designMetadata?: DesignMetadata;
  reactions?: Reaction[];
  effects: string[]; // Required field
  rarity: CardRarity; // Using enum type
  
  // Player info commonly used throughout the app
  player?: string;
  team?: string;
  year?: string;
  name?: string;
  
  // Collection and favorites - now ensuring isFavorite is included
  isFavorite: boolean; // Required field
  stats?: CardStats;
  
  // Artist and market data
  artistId?: string;
  marketData?: any;
  editionSize?: number;
  cardNumber?: string;
  price?: number;
  edition?: {
    number: number;
    total: number;
  };
  
  // Creator info
  creatorName?: string;
  creatorAvatar?: string;
  
  // Release information
  releaseDate?: string;
  
  // Display properties
  fabricSwatches?: FabricSwatch[];
  isAnimated?: boolean;
  hasAudio?: boolean;
  hasInteractiveElements?: boolean;
  isInUserCollection?: boolean;
}

/**
 * EnhancedCard includes additional fields for the application
 * Retained for backward compatibility
 * NOTE: EnhancedCard uses a different edition type than Card
 */
export interface EnhancedCard extends Omit<Card, 'edition'> {
  views: number;
  likes: number;
  shares: number;
  edition?: number; // Different from Card's edition format
}
