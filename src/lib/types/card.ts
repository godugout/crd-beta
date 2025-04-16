
/**
 * @deprecated This file is maintained for backward compatibility.
 * Please use the centralized type definitions from src/lib/types/cardTypes.ts instead.
 */

import { BaseEntity } from './index';
import { Reaction, Comment } from './interaction';
import { 
  Card as CardType, 
  FabricSwatch as FabricSwatchType 
} from './cardTypes';

export interface FabricSwatch extends FabricSwatchType {}

// Base Card interface that contains all common properties
export interface BaseCard {
  id: string;
  title: string;
  description: string; // Changed from optional to required
  imageUrl: string; // Changed from optional to required
  thumbnailUrl: string; // Changed from optional to required
  tags: string[]; // Changed from optional to required
  userId: string; // Changed from optional to required
  collectionId?: string;
  metadata?: Record<string, any>;
  effects: string[]; // Required for card viewer
  reactions?: Reaction[];
  comments?: Comment[];
  viewCount?: number;
  isPublic?: boolean;
  player?: string;
  team?: string;
  year?: string;
  jersey?: string;
  set?: string;
  cardNumber?: string;
  cardType?: string;
  artist?: string;
  backgroundColor?: string;
  textColor?: string;
  specialEffect?: string;
  fabricSwatches?: FabricSwatch[];
  name?: string;
  cardStyle?: string;
  backTemplate?: string;
  createdAt: string; // Changed from optional to required
  updatedAt: string; // Changed from optional to required
  designMetadata: any; // Changed from optional to required
}

export interface Card extends BaseCard {}

// Re-export the new types for gradual migration
export type { CardType as CardNew, FabricSwatchType as FabricSwatchNew };
