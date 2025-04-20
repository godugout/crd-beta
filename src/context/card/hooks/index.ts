
export * from './useCardOperations';
export * from './useCollectionOperations';

// Import from CardContext and re-export
import { useCards } from '@/context/CardContext';
import type { Card, Collection } from '@/lib/types';

// Export everything
export { useCards };
export type { Card, Collection };

// This is a wrapper function that uses the CardContext to provide collection functionality
export const useCollection = () => {
  // Using useCards() context to provide collection functionality
  const context = useCards();
  
  // Extract collection-related props from context
  const { 
    collections, 
    addCollection, 
    updateCollection, 
    deleteCollection, 
    addCardToCollection, 
    removeCardFromCollection,
    getCollectionById
  } = context;
  
  return {
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection,
    getCollectionById
  };
};
