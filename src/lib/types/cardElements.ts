
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
  USER_GENERATED = 'user-generated',
  LOGO = 'logo',
  OVERLAY = 'overlay',
  TEXTURE = 'texture',
  ICON = 'icon',
  SHAPE = 'shape'
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
    z?: number;
  };
  size?: {
    width: number;
    height: number;
    aspectRatio?: number;
  };
  rotation?: number;
  style?: Record<string, any>;
  assetUrl?: string; // Used in ElementPlacementCanvas
  metadata?: any;
  attribution?: string; // For giving credit to element creators
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
    z?: number;
  };
  size?: {
    width: number;
    height: number;
    aspectRatio?: number;
  };
  rotation?: number;
  attribution?: string; // Added for attribution requirements
  metadata?: any;
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
    aspectRatio?: number;
  };
  rotation: number;
  opacity: number;
  element?: CardElement;
  style?: Record<string, any>;
}
