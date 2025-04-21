
// Re-export types from cardTypes.ts
import { FabricSwatch as FabricSwatchType, Card as CardType } from './cardTypes';

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

// Export Card type from cardTypes
export type { CardType as Card };

// Export FabricSwatch for others to use
export type { FabricSwatchType };
