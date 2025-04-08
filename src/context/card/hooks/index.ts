
export * from './useCardOperations';
export * from './useCollectionOperations';

// Import the useCards hook directly from the CardContext
import { useCards } from '@/context/CardContext';
export { useCards };

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
