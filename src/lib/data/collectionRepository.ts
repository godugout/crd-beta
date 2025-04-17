
import { v4 as uuidv4 } from 'uuid';
import { Collection, Card } from '@/lib/types';
import { DEFAULT_DESIGN_METADATA } from '@/lib/utils/cardDefaults';
import sampleCards from '@/data/sampleCards';

/**
 * Get all collections for a user
 * @param userId The user's ID
 * @returns Promise resolving to an array of collections
 */
export const getUserCollections = async (userId: string): Promise<Collection[]> => {
  // In a real app, this would fetch from a database
  const collections: Collection[] = [
    {
      id: 'col_1',
      name: 'My First Collection',
      description: 'A collection of my favorite cards',
      coverImageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
      userId: userId,
      cards: sampleCards.slice(0, 2),
      cardIds: sampleCards.slice(0, 2).map(card => card.id),
      visibility: 'public',
      allowComments: true,
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: DEFAULT_DESIGN_METADATA
    },
    {
      id: 'col_2',
      name: 'Sports Cards',
      description: 'My sports card collection',
      coverImageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1',
      userId: userId,
      cards: sampleCards.slice(2, 4),
      cardIds: sampleCards.slice(2, 4).map(card => card.id),
      visibility: 'private',
      allowComments: false,
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: DEFAULT_DESIGN_METADATA
    }
  ];
  
  return collections;
};

/**
 * Get a collection by ID
 * @param collectionId The collection ID
 * @returns Promise resolving to the collection or null if not found
 */
export const getCollectionById = async (collectionId: string): Promise<Collection | null> => {
  // In a real app, this would fetch from a database
  const collection: Collection = {
    id: collectionId,
    name: 'Sample Collection',
    description: 'A sample collection of cards',
    coverImageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    userId: 'user123',
    cards: sampleCards,
    cardIds: sampleCards.map(card => card.id),
    visibility: 'public',
    allowComments: true,
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designMetadata: DEFAULT_DESIGN_METADATA
  };
  
  return collection;
};

/**
 * Create a new collection
 * @param collectionData The collection data
 * @returns Promise resolving to the created collection
 */
export const createCollection = async (collectionData: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collection> => {
  // In a real app, this would save to a database
  const newCollection: Collection = {
    ...collectionData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cards: [], // Initialize with empty cards array
    cardIds: collectionData.cardIds || [], // Initialize with empty cardIds if not provided
    visibility: collectionData.visibility || 'private',
    allowComments: collectionData.allowComments ?? true,
    designMetadata: collectionData.designMetadata || DEFAULT_DESIGN_METADATA,
  };
  
  return newCollection;
};

/**
 * Update a collection
 * @param collectionId The collection ID
 * @param updateData The data to update
 * @returns Promise resolving to the updated collection or null if not found
 */
export const updateCollection = async (collectionId: string, updateData: Partial<Collection>): Promise<Collection | null> => {
  // In a real app, this would update in a database
  const collection = await getCollectionById(collectionId);
  
  if (!collection) {
    return null;
  }
  
  const updatedCollection: Collection = {
    ...collection,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  return updatedCollection;
};

/**
 * Delete a collection
 * @param collectionId The collection ID
 * @returns Promise resolving to a boolean indicating success
 */
export const deleteCollection = async (collectionId: string): Promise<boolean> => {
  // In a real app, this would delete from a database
  return true;
};

/**
 * Add a card to a collection
 * @param cardId The card ID
 * @param collectionId The collection ID
 * @returns Promise resolving to a boolean indicating success
 */
export const addCardToCollection = async (cardId: string, collectionId: string): Promise<boolean> => {
  // In a real app, this would update in a database
  return true;
};

/**
 * Remove a card from a collection
 * @param cardId The card ID
 * @param collectionId The collection ID
 * @returns Promise resolving to a boolean indicating success
 */
export const removeCardFromCollection = async (cardId: string, collectionId: string): Promise<boolean> => {
  // In a real app, this would update in a database
  return true;
};

/**
 * Get all public collections
 * @returns Promise resolving to an array of public collections
 */
export const getPublicCollections = async (): Promise<Collection[]> => {
  // In a real app, this would fetch from a database
  const collections: Collection[] = [
    {
      id: 'pub_col_1',
      name: 'Top Baseball Cards',
      description: 'A collection of the best baseball cards',
      coverImageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
      userId: 'user456',
      cards: sampleCards.slice(0, 3),
      cardIds: sampleCards.slice(0, 3).map(card => card.id),
      visibility: 'public',
      allowComments: true,
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: DEFAULT_DESIGN_METADATA,
      tags: ['baseball', 'vintage']
    },
    {
      id: 'pub_col_2',
      name: 'Basketball Stars',
      description: 'Collection of legendary basketball players',
      coverImageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1',
      userId: 'user789',
      cards: sampleCards.slice(3, 6),
      cardIds: sampleCards.slice(3, 6).map(card => card.id),
      visibility: 'public',
      allowComments: true,
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      designMetadata: DEFAULT_DESIGN_METADATA,
      tags: ['basketball', 'legends']
    }
  ];
  
  return collections;
};
