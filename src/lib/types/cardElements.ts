
/**
 * Definition for card elements like stickers, logos, etc.
 */
export interface CardElement {
  id: string;
  name: string;
  description?: string;
  type: 'sticker' | 'logo' | 'frame' | 'badge' | 'overlay' | 'decoration';
  category: string;
  url: string;
  thumbnailUrl?: string;
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
  rotation?: number;
  position?: { x: number; y: number };
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
