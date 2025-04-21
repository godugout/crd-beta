
// Re-export types from cardTypes.ts
import { FabricSwatch as FabricSwatchType, Card as CardType, DesignMetadata, HotspotData, CardRarity } from './cardTypes';

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface CardData {
  id: number;
  name: string;
  team: string;
  jersey: string;
  year: string;
  backgroundColor: string;
  textColor: string;
  cardType: string;
  artist: string;
  set: string;
  cardNumber: string;
  description: string;
  specialEffect: string;
  imageUrl?: string;
  fabricSwatches?: FabricSwatch[];
  title?: string;
  tags?: string[];
  thumbnailUrl?: string;
  reactions?: any[];
  effects: string[]; // Required property
}

// Export Card type from cardTypes with design metadata
export type Card = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  userId: string;
  effects: string[];
  createdAt: string;
  updatedAt: string;
  player?: string;
  team?: string;
  position?: string;
  year?: string;
  designMetadata: DesignMetadata;
  
  // Add missing fields that caused TypeScript errors
  artist?: string;
  set?: string;
  rarity?: CardRarity;
  backImageUrl?: string;
  fabricSwatches?: FabricSwatch[];
  viewCount?: number;
  collectionId?: string;
  name?: string;
  teamId?: string;
  isPublic?: boolean;
  layers?: any[];
  reactions?: any[];
  cardNumber?: string;
  hotspots?: HotspotData[];
  height?: number;
  width?: number;
  cards?: Card[];
  sport?: string;
  cardType?: string;
  condition?: string;
  manufacturer?: string;
  grade?: string;
  gradingCompany?: string;
};

// Export FabricSwatch for others to use
export type { FabricSwatchType, CardRarity };

// Export DesignMetadata
export type { DesignMetadata };

// Export HotspotData
export type { HotspotData };
