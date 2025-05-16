
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

// Additional types for backward compatibility
export type BackgroundColor = string;

// Export aliases for legacy code
export { User } from './user';
export { Comment, Reaction } from './interaction';
export { Card, CardLayer, CardStyle, TextStyle, CardMetadata } from './cardTypes';
export { InstagramPost } from './instagram';
export { TeamMember, Team } from './teamTypes';
export { OaklandMemoryData } from './oaklandTypes';
