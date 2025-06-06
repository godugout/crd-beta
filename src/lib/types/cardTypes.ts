/**
 * Core Card Types for CRD (Collector's Republic Digital) App
 */

export interface FabricSwatch {
  color: string;
  material: string;
  source: string;
}

export interface DesignMetadata {
  cardStyle?: {
    effect?: string;
    teamSpecific?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    [key: string]: any;
  };
  textStyle?: {
    titleColor?: string;
    descriptionColor?: string;
    backgroundColor?: string;
    [key: string]: any;
  };
  layers?: any[];
  elements?: any[];
  filters?: any[];
  scene3d?: any;
  animation?: any;
  [key: string]: any;
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
