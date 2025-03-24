
import { useState, useEffect } from 'react';
import { Card } from '@/lib/types';

/**
 * Custom hook to manage card effects
 * Returns a map of card IDs to their active effects
 */
export const useCardEffects = (cards: Card[]) => {
  const [cardEffects, setCardEffects] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize effect states for each card
  useEffect(() => {
    setIsLoading(true);
    
    // Create a default effect mapping for all cards
    const defaultEffects: Record<string, string[]> = {};
    
    cards.forEach(card => {
      // Assign random effects to cards for demonstration
      const effectsPool = ['Refractor', 'Holographic', 'Shimmer', 'Vintage'];
      const randomEffect = effectsPool[Math.floor(Math.random() * effectsPool.length)];
      defaultEffects[card.id] = [randomEffect];
    });
    
    setCardEffects(defaultEffects);
    setIsLoading(false);
  }, [cards]);
  
  return { cardEffects, isLoading };
};
