
export * from './useCardOperations';
export * from './useCollectionOperations';

// Import the useCards hook directly from the CardContext
import { useCards } from '@/context/CardContext';
// Use proper type export syntax
import type { Card, Collection } from '@/context/CardContext';
export { useCards };
export type { Card, Collection };

// This is a wrapper function that uses the CardContext to provide collection functionality
export const useCollection = () => {
  // Using useCards() context to provide collection functionality
  const { collections, addCollection, updateCollection, deleteCollection, addCardToCollection, removeCardFromCollection } = useCards();
  
  return {
    collections,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection
  };
};
