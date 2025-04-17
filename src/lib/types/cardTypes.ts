
import { JsonValue } from './index';

export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  ULTRA_RARE = 'ultra-rare',
  LEGENDARY = 'legendary'
}

export interface CardStyle {
  template: string;
  effect: string;
  borderRadius: string;
  borderColor: string;
  shadowColor: string;
  frameWidth: number;
  frameColor: string;
  [key: string]: JsonValue;
}

export interface TextStyle {
  titleColor: string;
  titleAlignment: string;
  titleWeight: string;
  descriptionColor: string;
  [key: string]: JsonValue;
}

export interface CardMetadata {
  category: string;
  series: string;
  cardType: string;
  [key: string]: JsonValue;
}

export interface MarketMetadata {
  isPrintable: boolean;
  isForSale: boolean;
  includeInCatalog: boolean;
  [key: string]: JsonValue;
}

export interface DesignMetadata {
  cardStyle: CardStyle;
  textStyle: TextStyle;
  cardMetadata: CardMetadata;
  marketMetadata: MarketMetadata;
  // Optional fields that might be present in some cards
  player?: string;
  team?: string;
  year?: string;
  oaklandMemory?: Record<string, any>;
  layers?: any[];
  [key: string]: JsonValue | undefined;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  effects: string[];
  rarity: CardRarity;
  designMetadata: DesignMetadata;
  // Optional fields
  teamId?: string;
  collectionId?: string;
  [key: string]: JsonValue | undefined;
}
