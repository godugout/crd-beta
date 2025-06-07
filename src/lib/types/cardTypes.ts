
/**
 * Core Card Types for CRD (Collector's Republic Digital) App
 */

export interface FabricSwatch {
  color: string;
  material: string;
  source: string;
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape' | 'effect';
  position: { x: number; y: number; z: number };
  size: { width: number | 'auto'; height: number | 'auto' };
  rotation: number;
  opacity: number;
  visible: boolean;
  locked?: boolean; // Make optional
  content?: any;
  style?: any;
  zIndex?: number;
  imageUrl?: string;
  textStyle?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    fontWeight?: string;
    textAlign?: string;
  };
  shapeType?: string;
  color?: string;
}

export interface CardStats {
  [key: string]: string | number;
}

export interface DesignMetadata {
  cardStyle?: {
    effect?: string;
    teamSpecific?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    template?: string;
    borderRadius?: string;
    borderColor?: string;
    frameWidth?: number;
    frameColor?: string;
    shadowColor?: string;
    [key: string]: any;
  };
  textStyle?: {
    titleColor?: string;
    titleAlignment?: 'left' | 'center' | 'right';
    titleWeight?: 'normal' | 'bold' | 'lighter';
    descriptionColor?: string;
    backgroundColor?: string;
    [key: string]: any;
  };
  layers?: CardLayer[];
  elements?: any[];
  filters?: any[];
  scene3d?: any;
  animation?: any;
  cardMetadata?: {
    category?: string;
    cardType?: string;
    series?: string;
    [key: string]: any;
  };
  marketMetadata?: {
    isPrintable?: boolean;
    isForSale?: boolean;
    includeInCatalog?: boolean;
    [key: string]: any;
  };
  oaklandMemory?: any;
  [key: string]: any;
}

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'ultra-rare' | 'one-of-one';

export interface HotspotData {
  id: string;
  position?: { x: number; y: number }; // Make optional since CardDesigner uses x,y directly
  x?: number; // Add these for CardDesigner compatibility
  y?: number;
  width?: number;
  height?: number;
  content: string;
  type: 'info' | 'stat' | 'achievement' | 'text' | 'link' | 'image' | 'video';
  visible?: boolean;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  userId: string;
  collectionId?: string;
  designMetadata: DesignMetadata;
  metadata?: Record<string, any>;
  effects: string[]; // Make required
  reactions?: any[];
  comments?: any[];
  viewCount?: number;
  isPublic?: boolean;
  createdAt: string; // Make required
  updatedAt: string; // Make required
  
  // Sports card specific properties
  player?: string;
  team?: string;
  year?: string;
  jersey?: string;
  set?: string;
  cardNumber?: string;
  cardType?: string;
  artist?: string;
  backgroundColor?: string;
  textColor?: string;
  specialEffect?: string;
  fabricSwatches?: FabricSwatch[];
  name?: string;
  cardStyle?: string;
  backTemplate?: string;
  rarity?: CardRarity;
  
  // Additional properties that may be used
  teamId?: string;
  creatorId?: string;
  stats?: CardStats;
  
  // Editor specific properties
  layers?: CardLayer[];
}

export interface OaklandMemoryData {
  title: string;
  description: string;
  date?: string;
  memoryType?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  attendees?: string[];
  tags?: string[];
  imageUrl?: string; // Make optional again to fix Oakland components
  historicalContext?: string;
  personalSignificance?: string;
}
