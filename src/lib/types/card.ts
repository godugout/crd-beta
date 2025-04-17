
import { CardRarity, DesignMetadata } from './cardTypes';
import { BaseEntity } from '.';
import { Reaction } from './interaction';

/**
 * Card statistics including rarity, views, likes, and other metrics
 */
export interface CardStats {
  rarity: string;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  averageRating: number;
  totalRatings: number;
  [key: string]: number | string;
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
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  collectionId?: string;
  userId?: string;
  teamId?: string;
  isPublic?: boolean;
  tags?: string[];
  designMetadata?: DesignMetadata;
  reactions?: Reaction[];
  effects: string[];
  rarity?: CardRarity;
  
  // Player info commonly used throughout the app
  player?: string;
  team?: string;
  year?: string;
  name?: string;
  
  // Collection and favorites - now ensuring isFavorite is included
  isFavorite?: boolean;
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
 */
export interface EnhancedCard extends Card {
  views?: number;
  likes?: number;
  shares?: number;
}
