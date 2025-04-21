
import { Card, Collection, User, Comment, Reaction, OaklandMemoryData } from '@/lib/types';

/**
 * Type guard to check if an object is a valid Card
 */
export function isCard(obj: any): obj is Card {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    (typeof obj.title === 'string' || typeof obj.name === 'string') &&
    typeof obj.description === 'string' &&
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
    typeof obj.description === 'string'
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
    (obj.tags === undefined || Array.isArray(obj.tags)) &&
    typeof obj.template === 'string' // Check for required template
  );
}

/**
 * Validates and ensures an object conforms to OaklandMemoryData
 * Will fill in required fields if they're missing with safe defaults
 */
export function ensureValidOaklandMemoryData(obj: Partial<OaklandMemoryData>): OaklandMemoryData {
  return {
    title: obj.title || '',
    description: obj.description || '',
    tags: obj.tags || [],
    date: obj.date,
    location: obj.location,
    opponent: obj.opponent,
    score: obj.score,
    section: obj.section,
    imageUrl: obj.imageUrl,
    memoryType: obj.memoryType,
    attendees: obj.attendees || [],
    historicalContext: obj.historicalContext,
    personalSignificance: obj.personalSignificance,
    template: obj.template || 'classic' // Provide default template
  };
}
