
import { useContext } from 'react';
import { CardContext } from './CardContext';

/**
 * Hook to access the Card Context
 */
export const useCardContext = () => {
  const context = useContext(CardContext);
  
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  
  return context;
};

export default useCardContext;
