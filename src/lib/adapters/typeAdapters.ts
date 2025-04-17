
import { Card } from '@/lib/types/card';
import { OaklandMemoryData } from '@/lib/types/oaklandMemory';

/**
 * Convert an object to a valid Card type
 */
export function adaptToCard(obj: any): Card {
  // Ensure all required Card properties exist
  return {
    id: obj.id || `card-${Date.now()}`,
    title: obj.title || 'Untitled Card',
    description: obj.description || '',
    imageUrl: obj.imageUrl || '',
    thumbnailUrl: obj.thumbnailUrl || obj.imageUrl || '',
    effects: obj.effects || [],
    // Include other fields with fallbacks
    createdAt: obj.createdAt || new Date().toISOString(),
    updatedAt: obj.updatedAt || new Date().toISOString(),
    userId: obj.userId || 'anonymous',
    collectionId: obj.collectionId,
    teamId: obj.teamId,
    isPublic: obj.isPublic ?? true,
    tags: obj.tags || [],
    designMetadata: obj.designMetadata || {},
    // Add additional player data fields that might be used
    player: obj.player || '',
    team: obj.team || '',
    year: obj.year || '',
    name: obj.name || obj.title || '',
    // Ensure isFavorite is always included with a default value
    isFavorite: obj.isFavorite ?? false,
    // Include edition field in the correct format
    edition: obj.edition || { number: 1, total: 1 }
  };
}

/**
 * Convert an object to a valid OaklandMemoryData type
 */
export function adaptToOaklandMemory(obj: any): OaklandMemoryData {
  return {
    title: obj.title || 'Untitled Memory',
    description: obj.description || '',
    date: obj.date || '',
    opponent: obj.opponent || '',
    score: obj.score || '',
    location: obj.location || '',
    section: obj.section || '',
    memoryType: obj.memoryType || 'general',
    attendees: obj.attendees || [],
    tags: obj.tags || [],
    imageUrl: obj.imageUrl || '',
    historicalContext: obj.historicalContext || '',
    personalSignificance: obj.personalSignificance || '',
  };
}
