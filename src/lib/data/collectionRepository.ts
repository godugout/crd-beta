
import { Collection, Card } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// Define serializeMetadata locally if not available
const serializeMetadata = (metadata: any): string => {
  return JSON.stringify(metadata || {});
};

export async function fetchCollectionById(id: string): Promise<Collection | null> {
  try {
    // Simulate API fetch with a timeout
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data
    const mockCollection = {
      id: id,
      title: `Collection ${id}`, // Ensure title is set
      name: `Collection ${id}`,
      description: 'A description of the collection',
      coverImageUrl: '/images/collection-cover.jpg',
      visibility: 'public' as 'public' | 'private' | 'team' | 'unlisted',
      allowComments: true,
      designMetadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user-123',
      teamId: 'team-456',
      cards: [],
      tags: ['collection', 'featured'],
      isPublic: true
    };

    return mockCollection;
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
}

export async function createCollection(collectionData: Partial<Collection>): Promise<Collection | null> {
  try {
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create a new collection with the provided data and defaults
    const newCollection: Collection = {
      id: uuidv4(),
      title: collectionData.title || collectionData.name || 'Untitled Collection', // Ensure title is set
      name: collectionData.name || collectionData.title || 'Untitled Collection',
      description: collectionData.description || '',
      coverImageUrl: collectionData.coverImageUrl || '',
      userId: collectionData.userId || 'user-1',
      teamId: collectionData.teamId,
      visibility: collectionData.visibility || 'public',
      allowComments: collectionData.allowComments !== undefined ? collectionData.allowComments : true,
      designMetadata: collectionData.designMetadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cards: collectionData.cards || [],
      tags: collectionData.tags || [],
      isPublic: collectionData.isPublic !== undefined ? collectionData.isPublic : true
    };

    // Mock response
    return newCollection;
  } catch (error) {
    console.error('Error creating collection:', error);
    return null;
  }
}

export async function updateCollection(id: string, updates: Partial<Collection>): Promise<Collection | null> {
  try {
    // Fetch the existing collection
    const existingCollection = await fetchCollectionById(id);
    if (!existingCollection) {
      return null;
    }

    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update the collection with the provided updates
    const updatedCollection: Collection = {
      ...existingCollection,
      title: updates.title || updates.name || existingCollection.title, // Ensure title is updated
      name: updates.name || updates.title || existingCollection.name,
      description: updates.description !== undefined ? updates.description : existingCollection.description,
      coverImageUrl: updates.coverImageUrl !== undefined ? updates.coverImageUrl : existingCollection.coverImageUrl,
      visibility: updates.visibility || existingCollection.visibility,
      allowComments: updates.allowComments !== undefined ? updates.allowComments : existingCollection.allowComments,
      designMetadata: updates.designMetadata || existingCollection.designMetadata,
      cards: updates.cards || existingCollection.cards,
      tags: updates.tags || existingCollection.tags,
      updatedAt: new Date().toISOString(),
      teamId: updates.teamId !== undefined ? updates.teamId : existingCollection.teamId,
      isPublic: updates.isPublic !== undefined ? updates.isPublic : existingCollection.isPublic
    };

    // Mock response
    return updatedCollection;
  } catch (error) {
    console.error('Error updating collection:', error);
    return null;
  }
}

export async function deleteCollection(id: string): Promise<boolean> {
  try {
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful deletion
    return true;
  } catch (error) {
    console.error('Error deleting collection:', error);
    return false;
  }
}

export async function fetchCollections(): Promise<Collection[]> {
  try {
    // Simulate API fetch with a timeout
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock collection data
    const mockCollections = Array.from({ length: 5 }, (_, i) => ({
      id: `collection-${i + 1}`,
      title: `Collection ${i + 1}`, // Ensure title is set
      name: `Collection ${i + 1}`,
      description: `A sample collection ${i + 1}`,
      coverImageUrl: `/images/collection-${i + 1}.jpg`,
      visibility: 'public' as 'public' | 'private' | 'team' | 'unlisted',
      allowComments: true,
      designMetadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user-1',
      teamId: i % 2 === 0 ? 'team-1' : undefined,
      cards: [],
      tags: ['sample', `tag-${i + 1}`],
      isPublic: true
    }));

    return mockCollections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export async function addCardToCollection(collectionId: string, cardId: string): Promise<boolean> {
  try {
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful operation
    return true;
  } catch (error) {
    console.error('Error adding card to collection:', error);
    return false;
  }
}

export async function removeCardFromCollection(collectionId: string, cardId: string): Promise<boolean> {
  try {
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock successful operation
    return true;
  } catch (error) {
    console.error('Error removing card from collection:', error);
    return false;
  }
}

export async function fetchCollectionsByUserId(userId: string): Promise<Collection[]> {
  try {
    // Simulate API fetch with a timeout
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock user collections
    const mockUserCollections = Array.from({ length: 3 }, (_, i) => ({
      id: `user-collection-${i + 1}`,
      title: `User Collection ${i + 1}`, // Ensure title is set
      name: `User Collection ${i + 1}`,
      description: `A personal collection ${i + 1}`,
      coverImageUrl: `/images/user-collection-${i + 1}.jpg`,
      visibility: i === 0 ? 'public' : 'private' as 'public' | 'private' | 'team' | 'unlisted',
      allowComments: true,
      designMetadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: userId,
      teamId: i === 2 ? 'team-1' : undefined,
      cards: [],
      tags: ['personal', `user-tag-${i + 1}`],
      isPublic: i === 0
    }));

    return mockUserCollections;
  } catch (error) {
    console.error('Error fetching user collections:', error);
    return [];
  }
}
