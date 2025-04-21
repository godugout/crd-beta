import { useState, useEffect } from 'react';
import { Collection } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from Supabase
      // const { data, error } = await supabase.from('collections').select('*');
      
      // For now, use mock data
      const mockCollections: Collection[] = [
        {
          id: '1',
          title: 'Featured Collection',
          name: 'Featured Collection',
          description: 'A collection of featured cards',
          coverImageUrl: '/images/collection-cover.jpg',
          userId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          visibility: 'public',
          isPublic: true,
          tags: ['featured'],
          featured: true,
        },
        {
          id: '2',
          title: 'Rare Cards',
          name: 'Rare Cards',
          description: 'A collection of rare cards',
          coverImageUrl: '/images/rare-collection-cover.jpg',
          userId: 'user-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          visibility: 'private',
          isPublic: false,
          tags: ['rare', 'exclusive'],
        }
      ];
      
      setCollections(mockCollections);
      setError(null);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = (collectionData: Partial<Collection>): Collection => {
    const newCollection: Collection = {
      id: uuidv4(),
      title: collectionData.title || 'New Collection',
      name: collectionData.name || collectionData.title || 'New Collection',
      description: collectionData.description || '',
      coverImageUrl: collectionData.coverImageUrl || '',
      thumbnailUrl: collectionData.thumbnailUrl || '',
      userId: collectionData.userId || 'user-1',
      visibility: collectionData.visibility || 'private',
      tags: collectionData.tags || [],
      isPublic: collectionData.isPublic || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setCollections(prev => [...prev, newCollection]);
    return newCollection;
  };

  const updateCollection = (id: string, updates: Partial<Collection>): Collection | null => {
    let updatedCollection: Collection | null = null;
    
    setCollections(prevCollections => {
      return prevCollections.map(collection => {
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
    });
    
    return updatedCollection;
  };
  
  const deleteCollection = (id: string): boolean => {
    const collectionExists = collections.some(collection => collection.id === id);
    
    if (collectionExists) {
      setCollections(prevCollections => 
        prevCollections.filter(collection => collection.id !== id)
      );
      return true;
    }
    
    return false;
  };
  
  const getCollectionById = (id: string): Collection | undefined => {
    return collections.find(collection => collection.id === id);
  };
  
  const addCardToCollection = (collectionId: string, cardId: string): boolean => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return false;
    
    setCollections(prevCollections => {
      return prevCollections.map(c => {
        if (c.id === collectionId) {
          const cardIds = c.cardIds || [];
          if (!cardIds.includes(cardId)) {
            return {
              ...c,
              cardIds: [...cardIds, cardId]
            };
          }
        }
        return c;
      });
    });
    
    return true;
  };
  
  const removeCardFromCollection = (collectionId: string, cardId: string): boolean => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return false;
    
    setCollections(prevCollections => {
      return prevCollections.map(c => {
        if (c.id === collectionId) {
          return {
            ...c,
            cardIds: (c.cardIds || []).filter(id => id !== cardId)
          };
        }
        return c;
      });
    });
    
    return true;
  };

  return {
    collections,
    loading,
    error,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    getCollectionById,
    addCardToCollection,
    removeCardFromCollection
  };
}
