
// Base types that might be used across modules
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonValue[] 
  | { [key: string]: JsonValue };

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// For backward compatibility with JsonObject
export type JsonObject = Record<string, JsonValue>;

// Export updated type definitions
export * from './cardTypes';
export * from './interaction';
export * from './user';
export * from './collection';
export * from './instagram';
export * from './teamTypes';
export type { CardEffect, CardEffectSettings, CardEffectsResult, EffectSettings } from './cardEffects';

// Export from enhancedCardTypes with proper exports
export type { 
  HotspotData,
  EnhancedCard as ExtendedCard,
  Series as EnhancedSeries,
  CardRarity,
  Deck,
} from './enhancedCardTypes';

// Ensure CardLayer is exported from main types
export type { CardLayer } from './cardTypes';

// Export legacy CardData for backward compatibility
export type { CardData } from './CardData';
