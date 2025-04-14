
import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/lib/types';
import { throttle } from 'lodash-es';
import { CardEffectsOptions, CardEffectsResult } from './types';
import { processCardsBatch, getDefaultEffectsForCard, generateEffectClasses, supportsAdvancedEffects } from './utils';

/**
 * Hook for managing card visual effects
 */
export function useCardEffects(
  cards: Card[],
  optimizeForPerformance = false,
  options: CardEffectsOptions = {}
): CardEffectsResult {
  const [isLoading, setIsLoading] = useState(true);
  const [cardEffects, setCardEffects] = useState<Record<string, string[]>>(
    options.initialEffects || {}
  );
  
  // Keep track of previous card length for optimization
  const prevCardLengthRef = useRef<number>(0);
  // Store device capability for advanced effects
  const supportsAdvancedRef = useRef<boolean | null>(null);

  // Initialize effects map with default effects based on card metadata
  useEffect(() => {
    // Skip if no cards changed
    if (prevCardLengthRef.current === cards.length && Object.keys(cardEffects).length > 0) {
      setIsLoading(false);
      return;
    }
    
    // Check device capabilities once
    if (supportsAdvancedRef.current === null) {
      supportsAdvancedRef.current = supportsAdvancedEffects();
    }
    
    prevCardLengthRef.current = cards.length;
    
    const initialEffects: Record<string, string[]> = { ...options.initialEffects };
    
    // Apply optimized processing for many cards
    const processCards = async () => {
      setIsLoading(true);
      
      // Process in batches if we have many cards and are optimizing for performance
      if (optimizeForPerformance && cards.length > 20) {
        const updatedEffects = await processCardsBatch(cards, initialEffects);
        setCardEffects(updatedEffects);
      } else {
        // Process all at once for smaller collections
        cards.forEach(card => {
          // Skip if already processed
          if (initialEffects[card.id]) return;
          
          const defaultEffects = getDefaultEffectsForCard(card);
          
          // Only add non-empty effects
          if (defaultEffects.length > 0) {
            initialEffects[card.id] = defaultEffects;
          }
        });
        
        setCardEffects(initialEffects);
      }
      
      setIsLoading(false);
    };
    
    processCards();
  }, [cards, optimizeForPerformance, options.initialEffects]);

  // Throttled functions to prevent excessive rerenders
  const addEffect = useCallback(throttle((cardId: string, effect: string) => {
    setCardEffects(prev => {
      const currentEffects = prev[cardId] || [];
      if (currentEffects.includes(effect)) return prev;
      
      return {
        ...prev,
        [cardId]: [...currentEffects, effect]
      };
    });
  }, 100), []);
  
  const removeEffect = useCallback(throttle((cardId: string, effect: string) => {
    setCardEffects(prev => {
      const currentEffects = prev[cardId] || [];
      if (!currentEffects.includes(effect)) return prev;
      
      return {
        ...prev,
        [cardId]: currentEffects.filter(e => e !== effect)
      };
    });
  }, 100), []);
  
  const toggleEffect = useCallback(throttle((cardId: string, effect: string) => {
    setCardEffects(prev => {
      const currentEffects = prev[cardId] || [];
      const hasEffect = currentEffects.includes(effect);
      
      return {
        ...prev,
        [cardId]: hasEffect 
          ? currentEffects.filter(e => e !== effect)
          : [...currentEffects, effect]
      };
    });
  }, 100), []);
  
  const clearEffects = useCallback(throttle((cardId: string) => {
    setCardEffects(prev => ({
      ...prev,
      [cardId]: []
    }));
  }, 100), []);
  
  const setCardEffectsFn = useCallback((cardId: string, effects: string[]) => {
    setCardEffects(prev => ({
      ...prev,
      [cardId]: effects
    }));
  }, []);

  return {
    cardEffects,
    isLoading,
    addEffect,
    removeEffect,
    toggleEffect,
    clearEffects,
    setCardEffects: setCardEffectsFn
  };
}
