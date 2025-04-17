/**
 * Core Types for CRD (Collector's Republic Digital) App
 * Re-exports all types from the centralized type system
 */

// Import but don't re-export to avoid naming conflicts
import { BaseEntity, JsonValue } from './types/index';
import { Card as IndexCard, DesignMetadata, CardRarity, CardStyle, TextStyle, CardMetadata, MarketMetadata, HotspotData } from './types/cardTypes';
import { User, UserPermission } from './types/user';
import { Reaction, Comment } from './types/interaction';
import { Collection as IndexCollection } from './types/collection';
import { OaklandMemoryData as IndexOaklandMemoryData } from './types/oaklandMemory';
import { TeamMember as IndexTeamMember, Team as IndexTeam } from './types/team';
import { InstagramPost } from './types/instagram';

// Re-export with explicit naming
export {
  BaseEntity,
  JsonValue,
  CardRarity,
  CardStyle,
  TextStyle,
  CardMetadata,
  MarketMetadata,
  User,
  UserPermission,
  Reaction,
  Comment,
  HotspotData,
  InstagramPost
};

// Explicitly export and rename to avoid conflicts
export type Card = IndexCard;
export type Collection = IndexCollection;
export type OaklandMemoryData = IndexOaklandMemoryData;
export type TeamMember = IndexTeamMember;
export type Team = IndexTeam;

// Keep the utility function for backward compatibility
/**
 * Utility function to serialize design metadata to JSON-safe format
 * @param metadata The design metadata to serialize
 */
export function serializeMetadata(metadata: DesignMetadata | undefined): Record<string, any> {
  if (!metadata) return {};
  
  // Create a deep copy to avoid modifying the original
  const serialized = JSON.parse(JSON.stringify(metadata)) as Record<string, any>;
  
  // Handle specific nested objects that might need special serialization
  if (metadata.oaklandMemory && typeof metadata.oaklandMemory === 'object') {
    serialized.oaklandMemory = JSON.parse(JSON.stringify(metadata.oaklandMemory));
  }
  
  // Handle layers which might contain functions or complex objects
  if (metadata.layers && Array.isArray(metadata.layers)) {
    serialized.layers = metadata.layers.map(layer => {
      const layerCopy = { ...layer } as Record<string, any>;
      
      // Convert any non-serializable values
      Object.keys(layerCopy).forEach(key => {
        if (typeof layerCopy[key] === 'function') {
          delete layerCopy[key];
        }
      });
      
      return layerCopy;
    });
  }
  
  return serialized;
}
