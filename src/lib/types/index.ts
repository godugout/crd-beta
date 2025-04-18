
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
export type { CardEffect, CardEffectSettings } from './cardEffects';

// Don't re-export enhancedCardTypes directly to avoid ambiguity
import * as EnhancedCardTypes from './enhancedCardTypes';
export type { 
  HotspotData as EnhancedHotspotData,
  EnhancedCard as ExtendedCard,
  Series as EnhancedSeries,
  CardRarity,
} from './enhancedCardTypes';

// For backward compatibility, keep the old imports as well
// But we should gradually migrate to using the centralized types
import * as OldTypes from '@/types/card';
export const oldTypes = OldTypes;
