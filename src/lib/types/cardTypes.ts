
import { BaseEntity } from './index';
import { JsonValue } from '../types';

/**
 * Core card types for the application
 */
export interface Card extends BaseEntity {
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  userId: string;
  effects: string[];
  backImageUrl?: string;
  player?: string;
  team?: string;
  teamId?: string; // Add teamId field to support existing code
  year?: string;
  sport?: string;
  cardType?: string;
  set?: string;
  condition?: string;
  manufacturer?: string;
  cardNumber?: string;
  grade?: string;
  gradingCompany?: string;
  artist?: string;
  rarity?: string; // Add rarity field
  isPublic?: boolean;
  designMetadata: any; // Changed from optional to required
  reactions?: any[];
  fabricSwatches?: any[];
  viewCount?: number;
  name?: string;
  height?: number;
  width?: number;
  collectionId?: string;
  cards?: Card[]; // For compatibility with collection references
}

export interface CardDesignState {
  title: string;
  description: string;
  tags: string[];
  borderColor: string;
  backgroundColor: string;
  borderRadius: string;
  imageUrl: string | null;
  player?: string;
  team?: string;
  year?: string;
  [key: string]: any;
}

export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape' | 'effect';
  content: string | any;
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number | 'auto';
    height: number | 'auto';
  };
  rotation: number;
  opacity: number;
  zIndex: number;
  visible?: boolean;
  style?: Record<string, any>;
  locked?: boolean;
  effectIds?: string[];
  textStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: string;
  };
  imageUrl?: string;
  shapeType?: string;
  color?: string;
  [key: string]: any;
}

// Card rarity levels
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' | 'exclusive';

// Card statistics for sports cards
export interface CardStats {
  season?: string;
  games?: number;
  points?: number;
  assists?: number;
  rebounds?: number;
  steals?: number;
  blocks?: number;
  fieldGoalPercentage?: number;
  threePointPercentage?: number;
  freeThrowPercentage?: number;
  [key: string]: any;
}

// Card condition ratings
export type CardCondition = 'mint' | 'near-mint' | 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';

// Export HotspotData from enhancedCardTypes for backward compatibility
export { HotspotData } from './enhancedCardTypes';
