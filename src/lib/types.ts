/**
 * Core Types for CRD (Collector's Republic Digital) App
 * Re-exports all types from the centralized type system
 */

// Import but don't re-export to avoid naming conflicts
import { JsonValue, BaseEntity } from './types/index';
import { DesignMetadata, CardRarity as CardRarityEnum, CardStyle, TextStyle, CardMetadata, MarketMetadata, HotspotData } from './types/cardTypes';
import { User, UserRole, UserPermission, ROLE_PERMISSIONS, Team, TeamMember } from './types/user';
import { Reaction, Comment } from './types/interaction';
import { OaklandMemoryData as IndexOaklandMemoryData } from './types/oaklandMemory';
import { InstagramPost } from './types/instagram';
import { Card as IndexCard, EnhancedCard as IndexEnhancedCard } from './types/card';
import { Collection as IndexCollection } from './types/collection';

// Re-export using explicit types
export type { 
  BaseEntity,
  JsonValue,
  CardStyle,
  TextStyle,
  CardMetadata,
  MarketMetadata,
  User,
  UserPermission,
  Reaction,
  Comment,
  HotspotData,
  InstagramPost,
  DesignMetadata,
  Team,
  TeamMember
};

// Export enums and constants
export { CardRarityEnum as CardRarity, ROLE_PERMISSIONS, UserRole };

// Explicitly export and rename to avoid conflicts
export type Card = IndexCard;
export type EnhancedCard = IndexEnhancedCard;
export type Collection = IndexCollection;
export type OaklandMemoryData = IndexOaklandMemoryData;

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

// Export adaptToCard for convenience
export { adaptToCard } from './adapters/typeAdapters';
