
/**
 * Card market metadata interface
 */
export interface CardMarketMetadata {
  price?: number;
  currency?: string;
  availableForSale?: boolean;
  editionSize?: number;
  editionNumber?: number;
  isPrintable?: boolean;
  isForSale?: boolean;
  includeInCatalog?: boolean;
}

// Export alias as MarketMetadata for backward compatibility
export type MarketMetadata = CardMarketMetadata;

/**
 * Card metadata interface
 */
export interface CardMetadata {
  category: string;
  series: string;
  cardType: string;
  effects?: string[];
  [key: string]: any;
}

/**
 * Card style interface
 */
export interface CardStyle {
  borderColor?: string;
  backgroundColor?: string;
  titleFont?: string;
  bodyFont?: string;
  cornerRadius?: string;
  borderRadius?: string; // Added for compatibility
  shadowColor?: string;
  frameWidth?: number;
  frameColor?: string;
  template?: string;
  effect?: string;
  borderWidth?: number;
}

/**
 * Text style interface
 */
export interface TextStyle {
  titleColor?: string;
  titleSize?: string;
  bodyColor?: string;
  bodySize?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  titleAlignment?: string;
  titleWeight?: string;
  descriptionColor?: string;
}

/**
 * Card design metadata interface
 */
export interface CardDesignMetadata {
  cardStyle?: CardStyle;
  textStyle?: TextStyle;
  cardMetadata: CardMetadata;
  marketMetadata: CardMarketMetadata;
  effects?: string[];
  player?: string;
  team?: string;
  year?: string;
  oaklandMemory?: any; // Add oaklandMemory property
}

// Export alias as DesignMetadata for backward compatibility
export type DesignMetadata = CardDesignMetadata;

/**
 * Card interface for basic card data
 */
export interface Card {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  player?: string;
  team?: string;
  year?: string;
  isPublic?: boolean; // Add isPublic property
  designMetadata?: CardDesignMetadata;
  ownerId?: string; 
  collectionId?: string;
  userId?: string; // Added for compatibility
  effects?: string[]; // Added for compatibility
  reactions?: any[]; // Added for compatibility
  artist?: string; // Added for compatibility
  set?: string; // Added for compatibility
  rarity?: string; // Added for compatibility
  viewCount?: number; // Add viewCount property
  cardNumber?: string; // Add cardNumber property
  fabricSwatches?: any[]; // Add fabricSwatches property
  name?: string; // Add name property
  jersey?: string; // Add jersey property
}

/**
 * Card template interface for reusable card designs
 */
export interface CardTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail: string;
  thumbnailUrl?: string;
  category: string;
  tags?: string[];
  popularity?: number;
  isOfficial?: boolean;
  isPublic?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  designDefaults?: {
    cardStyle: Partial<CardStyle>;
    textStyle?: Partial<TextStyle>;
    effects?: string[];
  };
  cardStyle?: Partial<CardStyle>;
  textStyle?: Partial<TextStyle>;
  layers?: any[];
  effects?: string[];
  backgroundColor?: string;
  imageUrl?: string;
  [key: string]: any;
}

/**
 * Card rarity enum
 */
export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  ULTRA_RARE = 'ultra-rare',
  LEGENDARY = 'legendary'
}

/**
 * Hotspot data interface for interactive card elements
 */
export interface HotspotData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  type: string;
  visible?: boolean; // Add visible property
}

/**
 * Card layer interface for layered card elements
 */
export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape' | 'effect';
  content: string | any;
  position: {
    x: number;
    y: number;
    z: number;
  };
  size: {
    width: number | 'auto';
    height: number | 'auto';
  };
  rotation: number;
  opacity: number;
  zIndex: number;
  visible?: boolean;
  style?: Record<string, any>;
  locked?: boolean;
  effectIds?: string[];
  textStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: string;
  };
  imageUrl?: string;
  shapeType?: string;
  color?: string;
  [key: string]: any;
}

/**
 * Card effect interface
 */
export interface CardEffect {
  id: string;
  name: string;
  enabled: boolean;
  settings: Record<string, any>;
  className?: string;
  iconUrl?: string; // Add iconUrl property
  description?: string; // Add description property
}

/**
 * Stats interface for baseball cards
 */
export interface CardStats {
  battingAverage?: string;
  homeRuns?: string;
  rbis?: string;
  era?: string;
  wins?: string;
  strikeouts?: string;
}

/**
 * Export other card types to ensure consistency
 */
export * from './cardElements';
