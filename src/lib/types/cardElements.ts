
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
}

// Element type enum for matching string literals
export enum ElementType {
  Sticker = 'sticker',
  Logo = 'logo',
  Frame = 'frame',
  Badge = 'badge',
  Overlay = 'overlay'
}

// Element category enum
export enum ElementCategory {
  Sports = 'sports',
  Entertainment = 'entertainment',
  Art = 'art',
  Seasonal = 'seasonal',
  Special = 'special'
}

// Type for element upload metadata
export interface ElementUploadMetadata {
  title: string;
  description?: string;
  tags?: string[];
  category: ElementCategory;
  type: ElementType;
  isAnimated?: boolean;
  mimeType?: string;
}
