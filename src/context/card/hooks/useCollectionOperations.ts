
import { useState } from 'react';
import { Collection, Card } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const useCollectionOperations = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const addCollection = (collectionData: Partial<Collection>): Collection => {
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

    setCollections(prevCollections => [...prevCollections, newCollection]);
    return newCollection;
  };

  const updateCollection = (id: string, updates: Partial<Collection>): Collection | null => {
    let updatedCollection: Collection | null = null;

    setCollections(prevCollections => {
      return prevCollections.map(collection => {
        if (collection.id === id) {
          updatedCollection = { ...collection, ...updates };
          return updatedCollection;
        }
        return collection;
      });
    });

    return updatedCollection;
  };

  const deleteCollection = (id: string): boolean => {
    const collectionExists = collections.some(collection => collection.id === id);
    
    if (collectionExists) {
      setCollections(prevCollections => prevCollections.filter(collection => collection.id !== id));
      return true;
    }
    
    return false;
  };

  const addCardToCollection = (collectionId: string, card: Card): boolean => {
    const collectionExists = collections.some(collection => collection.id === collectionId);
    
    if (!collectionExists) {
      return false;
    }

    setCollections(prevCollections => {
      return prevCollections.map(collection => {
        if (collection.id === collectionId) {
          const cards = collection.cards || [];
          // Check if card already exists to avoid duplicates
          if (!cards.some(c => c.id === card.id)) {
            return {
              ...collection,
              cards: [...cards, card]
            };
          }
        }
        return collection;
      });
    });

    return true;
  };

  const removeCardFromCollection = (collectionId: string, cardId: string): boolean => {
    const collection = collections.find(collection => collection.id === collectionId);
    
    if (!collection || !collection.cards) {
      return false;
    }

    setCollections(prevCollections => {
      return prevCollections.map(collection => {
        if (collection.id === collectionId && collection.cards) {
          return {
            ...collection,
            cards: collection.cards.filter(card => card.id !== cardId)
          };
        }
        return collection;
      });
    });

    return true;
  };

  return {
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection,
    setCollections
  };
};
