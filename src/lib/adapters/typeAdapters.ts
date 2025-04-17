
/**
 * Type adapter utilities to safely convert between different type variations
 * and ensure backward compatibility
 */
import { Card, Collection, User, OaklandMemoryData } from '../types';
import { CardRarity, DesignMetadata } from '../types/cardTypes';

/**
 * Safely converts any Card-like object to a valid Card type
 * Ensures all required properties are present
 */
export function adaptToCard(cardData: any): Card {
  return {
    id: cardData.id || `card-${Date.now()}`,
    title: cardData.title || cardData.name || 'Untitled Card',
    description: cardData.description || '',
    imageUrl: cardData.imageUrl || cardData.image_url || '',
    thumbnailUrl: cardData.thumbnailUrl || cardData.imageUrl || '',
    userId: cardData.userId || cardData.user_id || 'anonymous',
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: cardData.updatedAt || new Date().toISOString(),
    tags: cardData.tags || [],
    effects: cardData.effects || [],
    rarity: cardData.rarity || CardRarity.COMMON,
    designMetadata: cardData.designMetadata || {},
    player: cardData.player || '',
    team: cardData.team || '',
    year: cardData.year || '',
    ...cardData
  };
}

/**
 * Safely converts any Collection-like object to a valid Collection type
 */
export function adaptToCollection(collectionData: any): Collection {
  return {
    id: collectionData.id || `collection-${Date.now()}`,
    title: collectionData.title || collectionData.name || 'Untitled Collection',
    name: collectionData.name || collectionData.title || 'Untitled Collection',
    description: collectionData.description || '',
    coverImageUrl: collectionData.coverImageUrl || '',
    userId: collectionData.userId || collectionData.user_id || collectionData.ownerId || 'anonymous',
    visibility: collectionData.visibility || 'private',
    allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
    createdAt: collectionData.createdAt || new Date().toISOString(),
    updatedAt: collectionData.updatedAt || new Date().toISOString(),
    cardIds: collectionData.cardIds || [],
    tags: collectionData.tags || [],
    ...collectionData
  };
}

/**
 * Safely converts any User-like object to a valid User type
 */
export function adaptToUser(userData: any): User {
  return {
    id: userData.id || `user-${Date.now()}`,
    email: userData.email || '',
    name: userData.name || userData.displayName || '',
    displayName: userData.displayName || userData.name || userData.username || '',
    role: userData.role || 'user',
    createdAt: userData.createdAt || new Date().toISOString(),
    updatedAt: userData.updatedAt || new Date().toISOString(),
    ...userData
  };
}

/**
 * Safely converts any data to a valid OaklandMemoryData type
 */
export function adaptToOaklandMemory(memoryData: any): OaklandMemoryData {
  return {
    title: memoryData.title || '',
    description: memoryData.description || '',
    date: memoryData.date || '',
    location: memoryData.location || '',
    tags: memoryData.tags || [],
    opponent: memoryData.opponent || '',
    score: memoryData.score || '',
    section: memoryData.section || '',
    memoryType: memoryData.memoryType || '',
    attendees: memoryData.attendees || [],
    imageUrl: memoryData.imageUrl || '',
    historicalContext: memoryData.historicalContext || '',
    personalSignificance: memoryData.personalSignificance || '',
    ...memoryData
  };
}
