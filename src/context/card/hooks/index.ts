
import useCardOperations from './useCardOperations';
import useCollectionOperations from './useCollectionOperations';

export {
  useCardOperations,
  useCollectionOperations
};

// Re-export other card-related hooks here
export const useCardContext = () => {
  const cardOperations = useCardOperations();
  const collectionOperations = useCollectionOperations();
  
  return {
    ...cardOperations,
    ...collectionOperations,
    // Add any other card-related state or methods here
    addCollection: collectionOperations.createCollection
  };
};
