
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
export * from './instagram';
export * from './cardElements';
export * from './teamTypes';
export * from './enhancedCardTypes';
export * from './oaklandTypes';
export * from './ugcTypes';
export * from './historyTypes';

// Additional types for backward compatibility
export type BackgroundColor = string;

// Export aliases for legacy code - these are now correctly imported from their respective files
export type { User } from './user';
export type { Comment, Reaction } from './interaction';
export type { Card, CardLayer, CardStyle, TextStyle, CardMetadata } from './cardTypes';
export type { InstagramPost } from './instagram';
export type { Team, TeamMember } from './teamTypes';
export type { OaklandMemoryData } from './oaklandTypes';
export type { UGCAsset, CreatorProfile, UGCReport } from './ugcTypes';
export type { CreationHistoryItem, UserStyleProfile } from './historyTypes';
