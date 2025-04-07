
export * from './useCardOperations';
export * from './useCollectionOperations';

export const useCollection = () => {
  // This is a temporary wrapper to fix the import error
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
