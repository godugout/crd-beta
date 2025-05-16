
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
  
  // Additional properties needed by adapters and components
  imageUrl?: string;
  assetUrl?: string;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  size?: {
    width: number;
    height: number;
    scale?: number;
  };
  style?: Record<string, any>;
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
  
  // Additional properties needed by components
  name?: string;
  attribution?: string;
  imageUrl?: string;
  metadata?: any;
}
