
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

// Card interface that matches the main Card type from cardTypes.ts
export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  userId: string;
  collectionId?: string;
  designMetadata?: any;
  metadata?: Record<string, any>;
  effects: string[]; // Required property
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
  rarity?: string;
  
  // Additional properties that may be used
  teamId?: string;
  creatorId?: string;
  stats?: Record<string, any>;
  
  // Editor specific properties
  layers?: any[];
}
