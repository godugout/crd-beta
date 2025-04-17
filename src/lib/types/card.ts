
/**
 * @deprecated This file is maintained for backward compatibility.
 * Please use the centralized type definitions from src/lib/types/cardTypes.ts instead.
 */

import { BaseEntity } from './index';
import { Reaction, Comment } from './interaction';
import { CardRarity as CardRarityEnum } from './cardTypes';
import { DesignMetadata } from './cardTypes';

// Fabric swatch interface
export interface FabricSwatch {
  id?: string;
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

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
  teamId?: string;
  metadata?: Record<string, any>;
  effects: string[];
  reactions?: Reaction[];
  comments?: Comment[];
  viewCount?: number;
  isPublic?: boolean;
  rarity?: CardRarityEnum;
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
  createdAt: string;
  updatedAt: string;
  designMetadata: DesignMetadata;
  isFavorite?: boolean;
}

export interface Card extends BaseCard {}

// Export the CardRarity enum
export { CardRarityEnum as CardRarity };
