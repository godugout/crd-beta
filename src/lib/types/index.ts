
/**
 * Core types used throughout the application
 * This file serves as the central export point for all type definitions
 */

// Define basic types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject { [key: string]: JsonValue; }
export type JsonArray = Array<JsonValue>;

// Re-export all types from other files
export * from './cardTypes';
export * from './user';
export * from './interaction';
export * from './collection';
export * from './cardElements';
export * from './teamTypes';
export * from './historyTypes';
export * from './oaklandTypes';
export * from './ugcTypes';

// Export type aliases for backward compatibility
export type { Card, CardLayer, CardStyle, TextStyle, CardMetadata, FabricSwatch } from './cardTypes';
export type { User } from './user';
export type { Comment, Reaction } from './interaction';
export type { Collection, Deck } from './collection';

// Additional types for backward compatibility
export type BackgroundColor = string;
