
import React, { createContext, useContext, ReactNode } from 'react';
import { useCardEffects } from '@/hooks/card-effects/useCardEffects';
import { CardEffectsOptions, CardEffectsResult } from '@/hooks/card-effects/types';
import { Card } from '@/lib/types';

interface CardEffectsProviderProps {
  children: ReactNode;
  cards: Card[];
  options?: CardEffectsOptions;
  optimizeForPerformance?: boolean;
}

// Create context
const CardEffectsContext = createContext<CardEffectsResult | undefined>(undefined);

export function CardEffectsProvider({
  children,
  cards,
  options = {},
  optimizeForPerformance = false
}: CardEffectsProviderProps) {
  const cardEffects = useCardEffects(cards, optimizeForPerformance, options);
  
  return (
    <CardEffectsContext.Provider value={cardEffects}>
      {children}
    </CardEffectsContext.Provider>
  );
}

// Hook for consuming the context
export function useCardEffectsContext() {
  const context = useContext(CardEffectsContext);
  
  if (context === undefined) {
    throw new Error('useCardEffectsContext must be used within a CardEffectsProvider');
  }
  
  return context;
}
