
// Export element types needed by ElementLibrary.ts
export interface CardElement {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  tags?: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
  creatorId?: string;
  isOfficial?: boolean;
  metadata?: any; // Added for ElementLibrary
  
  // Additional properties needed by adapters and components
  imageUrl?: string;
  assetUrl?: string;
  position?: ElementPosition;
  size?: ElementSize;
  style?: Record<string, any>;
}

/**
 * Position interface with rotation for element placement
 */
export interface ElementPosition {
  x: number;
  y: number;
  z: number;
  rotation?: number;
}

/**
 * Size interface with scale and aspect ratio
 */
export interface ElementSize {
  width: number;
  height: number;
  scale?: number;
  aspectRatio?: number;
}

/**
 * Element transform interface for placement engine
 */
export interface ElementTransform {
  position: ElementPosition;
  size: ElementSize;
  opacity?: number;
  zIndex?: number;
}

/**
 * Element placement options
 */
export interface ElementPlacementOptions {
  snapToGrid?: boolean;
  constrainToCanvas?: boolean;
  preventOverlap?: boolean;
  alignCenter?: boolean;
}

export interface StickerElement extends CardElement {
  type: 'sticker';
  isAnimated?: boolean;
}

export interface LogoElement extends CardElement {
  type: 'logo';
  team?: string;
  league?: string;
}

export interface FrameElement extends CardElement {
  type: 'frame';
  borderWidth?: number;
}

export interface BadgeElement extends CardElement {
  type: 'badge';
  rarity?: string;
}

export interface OverlayElement extends CardElement {
  type: 'overlay';
  opacity?: number;
}

export interface ElementLibraryCollection {
  id: string;
  name: string;
  elements: CardElement[];
  elementIds?: string[]; // For backward compatibility
  updatedAt?: string;
  createdAt?: string;
  isOfficial?: boolean;
  category?: string;
}

// Element type enum for matching string literals
export enum ElementType {
  Sticker = 'sticker',
  Logo = 'logo',
  Frame = 'frame',
  Badge = 'badge',
  Overlay = 'overlay'
}

// Expanded ElementCategory enum with all needed categories
export enum ElementCategory {
  Sports = 'sports',
  Entertainment = 'entertainment',
  Art = 'art',
  Seasonal = 'seasonal',
  Special = 'special',
  
  // Additional categories needed by components
  STICKERS = 'stickers',
  TEAMS = 'teams',
  BADGES = 'badges',
  FRAMES = 'frames',
  EFFECTS = 'effects',
  BACKGROUNDS = 'backgrounds',
  DECORATIVE = 'decorative',
  LOGO = 'logo',
  OVERLAY = 'overlay',
  TEXTURE = 'texture',
  ICON = 'icon',
  SHAPE = 'shape'
}

// Type for element upload metadata
export interface ElementUploadMetadata {
  title?: string;
  description?: string;
  tags?: string[];
  category: ElementCategory;
  type: ElementType;
  isAnimated?: boolean;
  mimeType?: string;
  fileName?: string; // For ElementUploader
  fileSize?: number; // For ElementUploader
  dimensions?: { // For ElementUploader
    width: number;
    height: number;
  };
  hasTransparency?: boolean; // For ElementUploader
  
  // Additional properties needed by components
  name?: string;
  attribution?: string;
  imageUrl?: string;
  metadata?: any;
}
