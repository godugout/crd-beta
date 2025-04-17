
// Import enum if needed
import { JsonValue } from './index';

// Define card rarity as an enum
export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  ULTRA_RARE = 'ultra-rare',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic'
}

// Define CardStyle type
export interface CardStyle {
  template: string;
  effect: string;
  borderRadius: string;
  borderColor: string;
  shadowColor: string;
  frameWidth: number;
  frameColor: string;
}

// Define TextStyle type
export interface TextStyle {
  titleColor: string;
  titleAlignment: string;
  titleWeight: string;
  descriptionColor: string;
}

// Define CardMetadata type
export interface CardMetadata {
  category: string;
  series: string;
  cardType: string;
  artist?: string;    // Added missing property
  cardNumber?: string; // Added missing property
}

// Define MarketMetadata type
export interface MarketMetadata {
  isPrintable: boolean;
  isForSale: boolean;
  includeInCatalog: boolean;
}

// Define HotspotData type
export interface HotspotData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetId?: string;
  targetType?: string;
  description?: string;
  title?: string;    // Added missing property
  content?: any;     // Added missing property
}

// Define DesignMetadata type
export interface DesignMetadata {
  cardStyle?: CardStyle;
  textStyle?: TextStyle;
  cardMetadata?: CardMetadata;
  marketMetadata?: MarketMetadata;
  oaklandMemory?: any;
  layers?: any[];
  player?: string;    // Added missing property
  team?: string;      // Added missing property
  year?: string;      // Added missing property
  [key: string]: any;
}

// Define Card type
export interface Card {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  userId?: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
  rarity: CardRarity;
  effects: string[];
  designMetadata?: DesignMetadata;
  reactions?: any[];
  collectionId?: string;  // Added missing property
  player?: string;        // Added missing property
  team?: string;          // Added missing property
  year?: string;          // Added missing property
  name?: string;          // Added missing property (used in some components)
}

// Export all types
export * from './card';
