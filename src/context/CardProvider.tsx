
import React, { createContext, useContext } from 'react';
import { useCardSystem, CardOperations } from '@/hooks/useCardSystem';

// Create the context
const CardContext = createContext<CardOperations | undefined>(undefined);

/**
 * Provider component for card operations
 */
export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cardOperations = useCardSystem();
  
  return (
    <CardContext.Provider value={cardOperations}>
      {children}
    </CardContext.Provider>
  );
};

/**
 * Hook to use card context
 */
export function useCardContext(): CardOperations {
  const context = useContext(CardContext);
  
  if (context === undefined) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  
  return context;
}
