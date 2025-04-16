
export { default as useCardOperations } from './useCardOperations';
export { default as useCollectionOperations } from './useCollectionOperations';

import { useContext } from 'react';
import { useCards } from '@/context/CardContext';

/**
 * Hook for card-related operations
 */
export const useCard = () => {
  return useCards();
};

/**
 * Hook for collection-related operations
 */
export const useCollection = () => {
  const cardContext = useCards();
  
  // Return all the collection-related operations from the CardContext
  return {
    collections: cardContext.collections,
    createCollection: cardContext.createCollection,
    updateCollection: cardContext.updateCollection,
    deleteCollection: cardContext.deleteCollection,
    addCollection: cardContext.createCollection, // Alias for createCollection
    addCardToCollection: cardContext.addCardToCollection,
    removeCardFromCollection: cardContext.removeCardFromCollection
  };
};
