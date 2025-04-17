
import useCardOperations from './useCardOperations';
import useCollectionOperations from './useCollectionOperations';
import useCardContext from './useCardContext';

/**
 * Export all card-related hooks
 */
export {
  useCardOperations,
  useCollectionOperations,
  useCardContext
};

/**
 * Re-export other card-related hooks here
 * This composite hook combines functionality from multiple card hooks
 */
export const useCardHooks = () => {
  const cardOperations = useCardOperations();
  const collectionOperations = useCollectionOperations();
  const cardContext = useCardContext();
  
  return {
    ...cardOperations,
    ...collectionOperations,
    ...cardContext,
    // Add any other card-related state or methods here
    addCollection: collectionOperations.createCollection
  };
};
