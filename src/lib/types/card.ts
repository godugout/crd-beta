import { CardRarity, DesignMetadata } from './cardTypes';
import { BaseEntity } from '.';
import { Reaction } from './interaction';

export interface CardStats {
  rarity: string;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  averageRating: number;
  totalRatings: number;
  [key: string]: number | string;
}

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
  player?: string;
  team?: string;
  year?: string;
  name?: string;
  isFavorite?: boolean;
  stats?: CardStats;
}

// EnhancedCard includes additional fields for the application
export interface EnhancedCard extends Card {
  views?: number;
  likes?: number;
  shares?: number;
  isAnimated?: boolean;
  hasAudio?: boolean;
  hasInteractiveElements?: boolean;
  isInUserCollection?: boolean;
  price?: number;
  edition?: {
    number: number;
    total: number;
  };
  creatorName?: string;
  creatorAvatar?: string;
}

export interface FabricSwatch {
  id: string;
  name: string;
  color: string;
  fabricType: string;
  imageUrl?: string;
  thumbnail?: string;
  isAvailable: boolean;
}
