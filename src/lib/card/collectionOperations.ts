
import { Collection } from '@/lib/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new collection
 */
export const createCollection = (collectionData: Partial<Collection>): Collection => {
  try {
    const newCollection: Collection = {
      id: collectionData.id || uuidv4(),
      name: collectionData.name || 'Untitled Collection',
      description: collectionData.description || '',
      coverImageUrl: collectionData.coverImageUrl || '',
      userId: collectionData.userId || 'anonymous',
      cards: collectionData.cards || [],
      cardIds: collectionData.cardIds || [],
      visibility: collectionData.visibility || 'public',
      allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
      designMetadata: collectionData.designMetadata || {},
      isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true,
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(),
    };

    return newCollection;
  } catch (err: any) {
    console.error('Error creating collection:', err);
    toast.error('Failed to create collection: ' + err.message);
    throw err;
  }
};

/**
 * Updates an existing collection
 */
export const updateCollection = (id: string, updates: Partial<Collection>, collections: Collection[]): Collection | null => {
  try {
    let updatedCollection: Collection | null = null;

    const updatedCollections = collections.map(collection => {
      if (collection.id === id) {
        updatedCollection = { 
          ...collection, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        return updatedCollection;
      }
      return collection;
    });

    return updatedCollection;
  } catch (err: any) {
    console.error('Error updating collection:', err);
    toast.error('Failed to update collection: ' + err.message);
    throw err;
  }
};

/**
 * Deletes a collection
 */
export const deleteCollection = (id: string, collections: Collection[]): boolean => {
  try {
    const collectionExists = collections.some(collection => collection.id === id);
    
    if (!collectionExists) {
      return false;
    }
    
    return true;
  } catch (err: any) {
    console.error('Error deleting collection:', err);
    toast.error('Failed to delete collection: ' + err.message);
    throw err;
  }
};
