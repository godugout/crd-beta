
/**
 * Element types and interfaces for the CRD card element system
 */

import { BaseEntity, JsonValue } from './index';
import { User } from './user';

/**
 * Element categories enum
 */
export enum ElementCategory {
  STICKER = 'sticker',
  LOGO = 'logo',
  FRAME = 'frame',
  BADGE = 'badge',
  OVERLAY = 'overlay',
  BACKGROUND = 'background',
  TEXTURE = 'texture',
  DECORATION = 'decoration',
  ICON = 'icon',
  SHAPE = 'shape'
}

/**
 * Element types enum
 */
export type ElementType = 
  | 'sticker'
  | 'logo'
  | 'frame'
  | 'badge'
  | 'overlay'
  | 'background'
  | 'texture'
  | 'decoration'
  | 'icon'
  | 'shape';

/**
 * Element dimensions interface
 */
export interface ElementDimensions {
  width: number;
  height: number;
  aspectRatio?: number;
}

/**
 * Element position interface
 */
export interface ElementPosition {
  x: number;
  y: number;
  z?: number;
}

/**
 * Element size interface
 */
export interface ElementSize {
  width: number | 'auto';
  height: number | 'auto';
  scale?: number;
}

/**
 * Element transform interface
 */
export interface ElementTransform {
  rotation: number;
  flipX?: boolean;
  flipY?: boolean;
  skewX?: number;
  skewY?: number;
}

/**
 * Element placement options interface
 */
export interface ElementPlacementOptions {
  position?: ElementPosition;
  size?: ElementSize;
  transform?: ElementTransform;
  opacity?: number;
  blendMode?: string;
}

/**
 * Element upload metadata interface
 */
export interface ElementUploadMetadata {
  category: ElementCategory;
  tags?: string[];
  description?: string;
  source?: string;
  attribution?: string;
  premium?: boolean;
  dimensions?: ElementDimensions;
  rasterizable?: boolean;
  customizable?: boolean;
}

/**
 * Base card element interface
 */
export interface CardElement extends BaseEntity {
  name: string;
  type: ElementType;
  category: ElementCategory;
  imageUrl: string;
  thumbnailUrl: string;
  description?: string;
  tags: string[];
  metadata?: Record<string, any>;
  premium?: boolean;
  creator?: User;
  creatorId?: string;
  usage?: number;
  rating?: number;
  dimensions?: ElementDimensions;
}

/**
 * Sticker element interface
 */
export interface StickerElement extends CardElement {
  type: 'sticker';
  category: ElementCategory.STICKER;
  transparent: boolean;
}

/**
 * Logo element interface
 */
export interface LogoElement extends CardElement {
  type: 'logo';
  category: ElementCategory.LOGO;
  team?: string;
  league?: string;
  year?: string;
}

/**
 * Frame element interface
 */
export interface FrameElement extends CardElement {
  type: 'frame';
  category: ElementCategory.FRAME;
  innerWidth: number;
  innerHeight: number;
  borderWidth: number;
}

/**
 * Badge element interface
 */
export interface BadgeElement extends CardElement {
  type: 'badge';
  category: ElementCategory.BADGE;
  achievement?: string;
  level?: string;
}

/**
 * Overlay element interface
 */
export interface OverlayElement extends CardElement {
  type: 'overlay';
  category: ElementCategory.OVERLAY;
  opacity: number;
  blendMode: string;
}

/**
 * Element library collection interface
 */
export interface ElementLibraryCollection {
  id: string;
  name: string;
  description?: string;
  elements: CardElement[];
  category?: ElementCategory;
  tags?: string[];
  featured?: boolean;
}
