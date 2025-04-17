
import { Card, Collection, User, OaklandMemoryData } from '@/lib/types';
import { adaptToOaklandMemory } from '@/lib/adapters/typeAdapters';

/**
 * Type guard to check if an object is a valid Card
 */
export function isCard(obj: any): obj is Card {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    (typeof obj.title === 'string' || typeof obj.name === 'string') &&
    (typeof obj.description === 'string' || obj.description === undefined) &&
    (typeof obj.imageUrl === 'string' || typeof obj.image === 'string')
  );
}

/**
 * Type guard to check if an object is a valid Collection
 */
export function isCollection(obj: any): obj is Collection {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    (typeof obj.name === 'string' || typeof obj.title === 'string') &&
    (typeof obj.description === 'string' || obj.description === undefined)
  );
}

/**
 * Type guard to check if an object is a valid User
 */
export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string'
  );
}

/**
 * Type guard to check if an object is a valid OaklandMemoryData
 */
export function isOaklandMemoryData(obj: any): obj is OaklandMemoryData {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    (obj.tags === undefined || Array.isArray(obj.tags))
  );
}

/**
 * Validates and ensures an object conforms to OaklandMemoryData
 * Will fill in required fields if they're missing with safe defaults
 */
export function ensureValidOaklandMemoryData(obj: Partial<OaklandMemoryData>): OaklandMemoryData {
  return adaptToOaklandMemory(obj);
}
