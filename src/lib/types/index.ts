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

// Export updated type definitions
export * from './cardTypes';
export * from './interaction';
export * from './user';
export * from './collection';

// For backward compatibility, keep the old imports as well
// But we should gradually migrate to using the centralized types
import * as OldTypes from '@/types/card';
export const oldTypes = OldTypes;
