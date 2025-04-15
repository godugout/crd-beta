
/**
 * Core card type definitions used throughout the application
 */

export interface FabricSwatch {
  type: string;
  team: string;
  year: string;
  manufacturer: string;
  position: string;
  size: string;
}

export interface CardStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: string;
  specialEffect?: string;
}

export interface CardMetadata {
  player?: string;
  team?: string;
  year?: string;
  set?: string;
  cardNumber?: string;
  position?: string;
  artist?: string;
}

export interface CardData {
  id: string | number;
  name?: string;
  title?: string;
  description: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  cardType?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'legendary' | 'one-of-one';
  style?: CardStyle;
  metadata?: CardMetadata;
  tags?: string[];
  fabricSwatches?: FabricSwatch[];
  effects?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// For backward compatibility
export type Card = CardData;
