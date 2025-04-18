
import { cardCollectionOperations } from './collection-operations/card-operations';
import { getCollectionOperations } from './collection-operations/get-operations';
import { modifyCollectionOperations } from './collection-operations/modify-operations';

// Combine all operations into a single export
export const collectionOperations = {
  ...getCollectionOperations,
  ...modifyCollectionOperations,
  ...cardCollectionOperations
};

// Re-export utility for checking collection existence
export { checkCollectionExists } from './utils/collection-existence';

// Re-export the collection converter utility
export { convertDbCollectionToApp } from './utils/collection-converter';
