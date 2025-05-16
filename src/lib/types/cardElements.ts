
/**
 * Definition for card elements like stickers, logos, etc.
 */
export type ElementType = 'sticker' | 'logo' | 'frame' | 'badge' | 'overlay' | 'decoration';
export type ElementCategory = string;

export interface CardElement {
  id: string;
  name: string;
  description?: string;
  type: ElementType;
  category: ElementCategory;
  url: string;
  thumbnailUrl?: string;
  assetUrl?: string;
  tags: string[];
  isOfficial?: boolean;
  isPremium?: boolean;
  price?: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  width?: number;
  height?: number;
  scale?: number;
  position: { 
    x: number; 
    y: number;
    z?: number; 
    rotation?: number;
  };
  size: {
    width: number;
    height: number;
    scale?: number;
    aspectRatio?: number;
    preserveAspectRatio?: boolean;
  };
  style?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ElementCategory {
  id: string;
  name: string;
  description?: string;
  count?: number;
  tags?: string[];
  thumbnailUrl?: string;
}

export interface ElementLibrary {
  categories: ElementCategory[];
  elements: Record<string, CardElement[]>;
  featured: string[];
  recentlyUsed: string[];
}
