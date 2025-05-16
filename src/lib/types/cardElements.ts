
import { BaseEntity } from './index';

/**
 * Element category enum
 */
export enum ElementCategory {
  DECORATIVE = 'decorative',
  STICKERS = 'stickers',
  TEAMS = 'teams',
  BADGES = 'badges',
  FRAMES = 'frames',
  EFFECTS = 'effects',
  BACKGROUNDS = 'backgrounds',
  USER_GENERATED = 'user-generated'
}

/**
 * Card element interface for stickers, logos, frames, etc.
 */
export interface CardElement extends BaseEntity {
  name: string;
  description?: string;
  type: string;
  category: ElementCategory | string;
  url?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  metadata?: any;
}

/**
 * Element upload metadata interface
 */
export interface ElementUploadMetadata {
  id?: string;
  name: string;
  description?: string;
  type: string;
  category: ElementCategory | string;
  url?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
}

/**
 * Element placement interface for positioned elements on cards
 */
export interface ElementPlacement {
  elementId: string;
  elementType: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number;
    height: number;
  };
  rotation: number;
  opacity: number;
  element?: CardElement;
}
