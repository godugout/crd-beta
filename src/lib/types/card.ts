
/**
 * @deprecated This file is maintained for backward compatibility.
 * Please use the centralized type definitions from src/lib/types/cardTypes.ts instead.
 */

import { BaseEntity } from './index';
import { Reaction, Comment } from './interaction';
import { 
  Card as CardType, 
  FabricSwatch as FabricSwatchType,
  DesignMetadata 
} from './cardTypes';

export interface FabricSwatch extends FabricSwatchType {}

// Base Card interface that contains all common properties
export interface BaseCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  userId: string;
  collectionId?: string;
  metadata?: Record<string, any>;
  effects: string[];
  reactions?: Reaction[];
  comments?: Comment[];
  viewCount?: number;
  isPublic?: boolean;
  
  // Player-related properties
  player?: string;
  team?: string;
  year?: string;
  jersey?: string;
  set?: string;
  cardNumber?: string;
  cardType?: string;
  
  // Visual properties
  artist?: string;
  backgroundColor?: string;
  textColor?: string;
  specialEffect?: string;
  fabricSwatches?: FabricSwatch[];
  
  // Additional metadata
  name?: string;
  cardStyle?: string;
  backTemplate?: string;
  
  // Timestamps and IDs
  createdAt: string;
  updatedAt: string;
  creatorId?: string;
  teamId?: string;
  
  // Design metadata
  designMetadata: DesignMetadata;
  
  // Market data
  price?: number;
  estimatedValue?: string;
  condition?: string;
  rarity?: string;
}

export interface Card extends BaseCard {}

// Re-export the new types for gradual migration
export type { CardType as CardNew, FabricSwatchType as FabricSwatchNew };
