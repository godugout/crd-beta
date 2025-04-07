
export * from './useCardOperations';
export * from './useCollectionOperations';

// This is a wrapper function that uses the CardContext to provide collection functionality
// This fixes the circular dependency issue
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

// Import the useCards hook to avoid circular dependency issues
import { useCards } from '@/context/CardContext';
