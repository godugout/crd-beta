
import { JsonValue } from './index';

/**
 * Base type for all card elements
 */
export interface CardElement {
  id: string;
  type: ElementType;
  name: string;
  assetUrl: string;
  thumbnailUrl?: string;
  description?: string;
  tags: string[];
  category: ElementCategory;
  isOfficial: boolean;
  position: ElementPosition;
  size: ElementSize;
  style?: ElementStyle;
  metadata?: Record<string, JsonValue>;
  createdAt: string;
  updatedAt: string;
  creatorId?: string;
}

/**
 * Available element types
 */
export type ElementType = 'sticker' | 'logo' | 'frame' | 'badge' | 'overlay';

/**
 * Element categories for organization
 */
export type ElementCategory = 
  'sports' | 'entertainment' | 'achievement' | 'decorative' | 
  'seasonal' | 'holiday' | 'teams' | 'brands' | 'custom' | 'other';

/**
 * Element position properties
 */
export interface ElementPosition {
  x: number;
  y: number;
  z: number;
  rotation: number;
}

/**
 * Element size properties
 */
export interface ElementSize {
  width: number;
  height: number;
  scale: number;
  aspectRatio: number;
  preserveAspectRatio: boolean;
}

/**
 * Element style properties
 */
export interface ElementStyle {
  opacity: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  blendMode?: ElementBlendMode;
}

/**
 * Blend modes for element compositing
 */
export type ElementBlendMode = 
  'normal' | 'multiply' | 'screen' | 'overlay' | 
  'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 
  'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 
  'color' | 'luminosity';

/**
 * Sticker specific properties
 */
export interface StickerElement extends CardElement {
  type: 'sticker';
  isAnimated: boolean;
  animationData?: {
    frameCount?: number;
    duration?: number;
    loop?: boolean;
    autoPlay?: boolean;
  };
}

/**
 * Logo specific properties
 */
export interface LogoElement extends CardElement {
  type: 'logo';
  isVector: boolean;
  vectorData?: string; // SVG content for vector logos
  colorScheme?: string[];
  originalSize?: {
    width: number;
    height: number;
  };
}

/**
 * Frame specific properties
 */
export interface FrameElement extends CardElement {
  type: 'frame';
  frameType: 'full' | 'corners' | 'top' | 'bottom' | 'left' | 'right' | 'custom';
  thickness: number;
  colorScheme?: string[];
  pattern?: string;
  isResizable: boolean;
  innerPadding?: number;
}

/**
 * Badge specific properties
 */
export interface BadgeElement extends CardElement {
  type: 'badge';
  badgeType: 'achievement' | 'rank' | 'certification' | 'special' | 'custom';
  badgeTier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  value?: string;
  issuedBy?: string;
  issuedDate?: string;
}

/**
 * Overlay specific properties
 */
export interface OverlayElement extends CardElement {
  type: 'overlay';
  overlayType: 'filter' | 'texture' | 'pattern' | 'gradient' | 'light' | 'custom';
  blendMode: ElementBlendMode;
  intensity: number;
  colorScheme?: string[];
  isInteractive?: boolean;
  interactiveData?: Record<string, JsonValue>;
}

/**
 * Element upload metadata
 */
export interface ElementUploadMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  hasTransparency?: boolean;
  isAnimated?: boolean;
}

/**
 * Element library collection
 */
export interface ElementLibraryCollection {
  id: string;
  name: string;
  description?: string;
  elementIds: string[];
  thumbnail?: string;
  category?: ElementCategory;
  isPublic: boolean;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Element placement options
 */
export interface ElementPlacementOptions {
  position?: Partial<ElementPosition>;
  size?: Partial<ElementSize>;
  style?: Partial<ElementStyle>;
  snapToGrid?: boolean;
  centerOnCard?: boolean;
  lockAspectRatio?: boolean;
}

/**
 * Element transformation matrix
 */
export interface ElementTransform {
  translateX: number;
  translateY: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
}
