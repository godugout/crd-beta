import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/lib/types';
import { throttle } from 'lodash-es';

interface CardEffectsOptions {
  /**
   * Whether to optimize effects for performance
   * @default false
   */
  optimizeForPerformance?: boolean;
  
  /**
   * Initial effects to apply
   * @default {}
   */
  initialEffects?: Record<string, string[]>;
}

interface CardEffectsResult {
  /**
   * Map of card IDs to active effects
   */
  cardEffects: Record<string, string[]>;
  
  /**
   * Whether effects are loading
   */
  isLoading: boolean;
  
  /**
   * Add an effect to a card
   */
  addEffect: (cardId: string, effect: string) => void;
  
  /**
   * Remove an effect from a card
   */
  removeEffect: (cardId: string, effect: string) => void;
  
  /**
   * Toggle an effect on a card
   */
  toggleEffect: (cardId: string, effect: string) => void;
  
  /**
   * Clear all effects from a card
   */
  clearEffects: (cardId: string) => void;
  
  /**
   * Set all effects for a card
   */
  setCardEffects: (cardId: string, effects: string[]) => void;
}

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

  // Initialize effects map with default effects based on card metadata
  useEffect(() => {
    // Skip if no cards changed
    if (prevCardLengthRef.current === cards.length && Object.keys(cardEffects).length > 0) {
      setIsLoading(false);
      return;
    }
    
    prevCardLengthRef.current = cards.length;
    
    const initialEffects: Record<string, string[]> = { ...options.initialEffects };
    
    // Apply optimized processing for many cards
    const processCards = async () => {
      setIsLoading(true);
      
      // Process in batches if we have many cards and are optimizing for performance
      if (optimizeForPerformance && cards.length > 20) {
        const batchSize = 20;
        for (let i = 0; i < cards.length; i += batchSize) {
          const batch = cards.slice(i, i + batchSize);
          
          // Allow UI to update between batches
          await new Promise(resolve => setTimeout(resolve, 0));
          
          batch.forEach(card => {
            // Skip if already processed
            if (initialEffects[card.id]) return;
            
            // Apply default effects based on card metadata
            const defaultEffects: string[] = [];
            
            // Use card metadata to determine default effects
            if (card.designMetadata?.cardStyle?.effect === 'refractor') {
              defaultEffects.push('Refractor');
            }
            
            if (card.designMetadata?.cardStyle?.effect === 'holographic') {
              defaultEffects.push('Holographic');
            }
            
            if (card.designMetadata?.cardStyle?.effect === 'vintage') {
              defaultEffects.push('Vintage');
            }
            
            // Only add non-empty effects
            if (defaultEffects.length > 0) {
              initialEffects[card.id] = defaultEffects;
            }
          });
        }
      } else {
        // Process all at once for smaller collections
        cards.forEach(card => {
          // Skip if already processed
          if (initialEffects[card.id]) return;
          
          // Apply default effects based on card metadata
          const defaultEffects: string[] = [];
          
          // Use card metadata to determine default effects
          if (card.designMetadata?.cardStyle?.effect === 'refractor') {
            defaultEffects.push('Refractor');
          }
          
          if (card.designMetadata?.cardStyle?.effect === 'holographic') {
            defaultEffects.push('Holographic');
          }
          
          if (card.designMetadata?.cardStyle?.effect === 'vintage') {
            defaultEffects.push('Vintage');
          }
          
          // Only add non-empty effects
          if (defaultEffects.length > 0) {
            initialEffects[card.id] = defaultEffects;
          }
        });
      }
      
      setCardEffects(initialEffects);
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
