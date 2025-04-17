import { v4 as uuidv4 } from 'uuid';
import { Collection, Card } from '@/lib/types';

/**
 * Create a new collection with given data
 * @param data Collection data
 */
export const createCollection = (data: Partial<Collection>): Collection => {
  const timestamp = new Date().toISOString();
  
  const newCollection: Collection = {
    id: data.id || uuidv4(),
    name: data.name || 'Untitled Collection',
    title: data.title || data.name || 'Untitled Collection',
    description: data.description || '',
    coverImageUrl: data.coverImageUrl || '',
    userId: data.userId || 'anonymous',
    teamId: data.teamId,
    cards: data.cards || [],
    cardIds: data.cardIds || [],
    visibility: data.visibility || 'private',
    allowComments: data.allowComments !== undefined ? data.allowComments : true,
    createdAt: data.createdAt || timestamp,
    updatedAt: data.updatedAt || timestamp,
    designMetadata: data.designMetadata || {},
    tags: data.tags || []
  };
  
  return newCollection;
};

/**
 * Update an existing collection
 * @param id Collection ID
 * @param updates Collection updates
 * @param collections Current collections array
 * @returns Updated collection or null if not found
 */
export const updateCollection = (id: string, updates: Partial<Collection>, collections: Collection[]): Collection | null => {
  const collectionIndex = collections.findIndex(collection => collection.id === id);
  
  if (collectionIndex === -1) {
    return null;
  }
  
  // Create a new collection with updated properties
  const updatedCollection: Collection = {
    ...collections[collectionIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return updatedCollection;
};

/**
 * Delete a collection
 * @param id Collection ID
 * @param collections Current collections array
 * @returns Whether the deletion was successful
 */
export const deleteCollection = (id: string, collections: Collection[]): boolean => {
  const collectionIndex = collections.findIndex(collection => collection.id === id);
  
  if (collectionIndex === -1) {
    return false;
  }
  
  return true;
};
