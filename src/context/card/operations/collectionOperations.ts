
import { Collection, Card } from '@/lib/types';
import { toast } from 'sonner';
import { collectionOperations } from '@/lib/supabase';

/**
 * Fetches all collections from the database
 */
export const fetchCollections = async (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>
) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const { data, error } = await collectionOperations.getCollections();
    
    if (error) {
      setError(error.message);
      toast.error('Failed to load collections: ' + error.message);
      return;
    }
    
    if (data) {
      setCollections(data);
    }
  } catch (err: any) {
    console.error('Fetch collections error:', err);
    setError(err.message || 'Failed to load collections');
    toast.error('An unexpected error occurred loading collections');
  } finally {
    setIsLoading(false);
  }
};

/**
 * Creates a new collection
 */
export const createCollection = async (
  collection: Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>
) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const { data, error } = await collectionOperations.createCollection(collection);
    
    if (error) {
      setError(error.message);
      toast.error('Failed to create collection: ' + error.message);
      return;
    }
    
    if (data) {
      setCollections(prev => [...prev, data]);
      toast.success('Collection created successfully');
      return data;
    }
  } catch (err: any) {
    console.error('Create collection error:', err);
    setError(err.message || 'Failed to create collection');
    toast.error('An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};

/**
 * Updates an existing collection
 */
export const updateCollection = async (
  id: string, 
  updates: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt' | 'updatedAt'>>,
  collections: Collection[],
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>
) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const { data, error } = await collectionOperations.updateCollection(id, updates);
    
    if (error) {
      setError(error.message);
      toast.error('Failed to update collection: ' + error.message);
      return;
    }
    
    if (data) {
      // Preserve the cards array from the existing collection
      const existingCollection = collections.find(c => c.id === id);
      const updatedCollection = {
        ...data,
        cards: existingCollection ? existingCollection.cards : []
      };
      
      setCollections(prev => 
        prev.map(collection => 
          collection.id === id ? updatedCollection : collection
        )
      );
      
      toast.success('Collection updated successfully');
    }
  } catch (err: any) {
    console.error('Update collection error:', err);
    setError(err.message || 'Failed to update collection');
    toast.error('An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};

/**
 * Deletes a collection
 */
export const deleteCollection = async (
  id: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>
) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const { error } = await collectionOperations.deleteCollection(id);
    
    if (error) {
      setError(error.message);
      toast.error('Failed to delete collection: ' + error.message);
      return;
    }
    
    // Update card's collectionId if it belongs to the deleted collection
    setCards(prev => 
      prev.map(card => 
        card.collectionId === id 
          ? { ...card, collectionId: undefined }
          : card
      )
    );
    
    setCollections(prev => prev.filter(collection => collection.id !== id));
    toast.success('Collection deleted successfully');
  } catch (err: any) {
    console.error('Delete collection error:', err);
    setError(err.message || 'Failed to delete collection');
    toast.error('An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};
