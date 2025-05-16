/**
 * Core Types for CRD (Collector's Republic Digital) App
 * Re-exports all types from the centralized type system
 */

// Re-export all types from our centralized type system
export * from './types/index';
export * from './types/cardTypes';
export * from './types/user';
export * from './types/interaction';
export * from './types/collection';
export * from './types/instagram';  // Added Instagram types

// Keep the utility function for backward compatibility
import { DesignMetadata } from './types/cardTypes';

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
