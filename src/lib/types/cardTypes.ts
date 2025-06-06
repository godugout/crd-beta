
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
    descriptionColor?: string;
    backgroundColor?: string;
    [key: string]: any;
  };
  layers?: CardLayer[];
  elements?: any[];
  filters?: any[];
  scene3d?: any;
  animation?: any;
  cardMetadata?: any;
  marketMetadata?: any;
  oaklandMemory?: any;
  [key: string]: any;
}

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'ultra-rare';

export interface HotspotData {
  id: string;
  position: { x: number; y: number };
  content: string;
  type: 'info' | 'stat' | 'achievement' | 'text' | 'link' | 'image' | 'video';
  visible?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
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
  effects?: string[];
  reactions?: any[];
  comments?: any[];
  viewCount?: number;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  
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
  imageUrl?: string;
  historicalContext?: string;
  personalSignificance?: string;
}
