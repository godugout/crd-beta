import { v4 as uuidv4 } from 'uuid';
import { Collection, Card, DesignMetadata } from '@/lib/types';
import { sampleCards } from '@/data/sampleCards';

export const publicCollections: Collection[] = [
  {
    id: "1",
    name: "Favorites",
    title: "Favorites",
    description: "A collection of favorite cards",
    coverImageUrl: "https://placehold.co/600x400/png",
    userId: "user1",
    cards: sampleCards,
    cardIds: sampleCards.map(c => c.id),
    visibility: "public",
    allowComments: true,
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designMetadata: {},
    tags: ["favorites", "featured"]
  },
  {
    id: "2",
    name: "Private Collection",
    title: "Private Collection",
    description: "A private collection for test",
    coverImageUrl: "https://placehold.co/600x400/png",
    userId: "user1",
    cards: sampleCards.slice(0, 3),
    cardIds: sampleCards.slice(0, 3).map(c => c.id),
    visibility: "private",
    allowComments: false,
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designMetadata: {},
    tags: ["private", "test"]
  }
];

/**
 * Get all collections from the repository
 */
export const getAllCollections = async () => {
  return [...publicCollections];
};

/**
 * Get a collection by ID
 * @param id Collection ID
 */
export const getCollectionById = async (id: string) => {
  return publicCollections.find(c => c.id === id) || {
    id: uuidv4(),
    name: "New Collection",
    title: "New Collection",
    description: "A new collection",
    coverImageUrl: "https://placehold.co/600x400/png",
    userId: "user1",
    cards: sampleCards,
    cardIds: sampleCards.map(c => c.id),
    visibility: "public",
    allowComments: true,
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    designMetadata: {},
    tags: ["new"]
  };
};

/**
 * Create a new collection
 * @param data Collection data
 */
export const createCollection = async (data: Partial<Collection>): Promise<Collection> => {
  const timestamp = new Date().toISOString();
  const newCollection: Collection = {
    id: uuidv4(),
    name: data.name || "New Collection",
    title: data.name || "New Collection", // Set title to name if not provided
    description: data.description || "",
    coverImageUrl: data.coverImageUrl || "https://placehold.co/600x400/png",
    userId: data.userId || "user1",
    cards: data.cards || [],
    cardIds: data.cardIds || [],
    visibility: data.visibility || "public",
    allowComments: data.allowComments !== undefined ? data.allowComments : true,
    isPublic: data.isPublic !== undefined ? data.isPublic : true,
    createdAt: timestamp,
    updatedAt: timestamp,
    designMetadata: data.designMetadata || {},
    tags: data.tags || []
  };
  
  publicCollections.push(newCollection);
  return newCollection;
};

/**
 * Update a collection
 * @param id Collection ID
 * @param data Collection data
 */
export const updateCollection = async (id: string, data: Partial<Collection>): Promise<Collection> => {
  const timestamp = new Date().toISOString();
  const index = publicCollections.findIndex(c => c.id === id);
  
  if (index === -1) {
    const newCollection: Collection = {
      id,
      name: data.name || "New Collection",
      title: data.name || "New Collection", // Set title to name if not provided
      description: data.description || "",
      coverImageUrl: data.coverImageUrl || "https://placehold.co/600x400/png",
      userId: data.userId || "user1",
      cards: data.cards || [],
      cardIds: data.cardIds || [],
      visibility: data.visibility || "public",
      allowComments: data.allowComments !== undefined ? data.allowComments : true,
      isPublic: data.isPublic !== undefined ? data.isPublic : true,
      createdAt: timestamp,
      updatedAt: timestamp,
      designMetadata: data.designMetadata || {},
      tags: data.tags || []
    };
    
    publicCollections.push(newCollection);
    return newCollection;
  }
  
  publicCollections[index] = {
    ...publicCollections[index],
    ...data,
    updatedAt: timestamp
  };
  
  return publicCollections[index];
};
