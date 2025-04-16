
import { v4 as uuidv4 } from 'uuid';
import { Collection } from '@/lib/types';

/**
 * Create a new collection with default properties
 * @param collectionData Partial collection data
 * @returns The newly created collection
 */
export const createCollection = (collectionData: Partial<Collection>): Collection => {
  const timestamp = new Date().toISOString();
  
  const newCollection: Collection = {
    id: collectionData.id || uuidv4(),
    name: collectionData.name || 'Untitled Collection',
    description: collectionData.description || '',
    coverImageUrl: collectionData.coverImageUrl || '',
    userId: collectionData.userId || 'anonymous',
    teamId: collectionData.teamId,
    cards: collectionData.cards || [],
    cardIds: collectionData.cardIds || [],
    visibility: collectionData.visibility || 'public',
    allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
    isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true,
    createdAt: timestamp,
    updatedAt: timestamp,
    designMetadata: collectionData.designMetadata || {},
    tags: collectionData.tags || []
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
