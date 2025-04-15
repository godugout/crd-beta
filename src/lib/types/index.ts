
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

// Export from our type files directly
export * from './card';
export * from './collection';
export * from './user';
export * from './interaction';

// Re-export all types from the old location
import * as OldTypes from '@/types/card';

// Export everything except FabricSwatch to avoid duplication
// This avoids the "has already exported a member named 'FabricSwatch'" error
type OldTypesWithoutFabricSwatch = Omit<typeof OldTypes, 'FabricSwatch'>;
export const oldTypes: OldTypesWithoutFabricSwatch = {} as OldTypesWithoutFabricSwatch;
