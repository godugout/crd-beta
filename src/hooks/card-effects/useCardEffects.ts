
import { useState, useCallback } from 'react';
import { CardEffectsResult } from '@/lib/types/cardEffects';

const useCardEffects = (): CardEffectsResult => {
  const [cardEffects, setCardEffectsState] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const addEffect = useCallback((cardId: string, effect: string) => {
    setCardEffectsState(prev => {
      const currentEffects = prev[cardId] || [];
      if (!currentEffects.includes(effect)) {
        return {
          ...prev,
          [cardId]: [...currentEffects, effect]
        };
      }
      return prev;
    });
  }, []);

  const removeEffect = useCallback((cardId: string, effect: string) => {
    setCardEffectsState(prev => {
      const currentEffects = prev[cardId] || [];
      return {
        ...prev,
        [cardId]: currentEffects.filter(e => e !== effect)
      };
    });
  }, []);

  const toggleEffect = useCallback((cardId: string, effect: string) => {
    setCardEffectsState(prev => {
      const currentEffects = prev[cardId] || [];
      if (currentEffects.includes(effect)) {
        return {
          ...prev,
          [cardId]: currentEffects.filter(e => e !== effect)
        };
      } else {
        return {
          ...prev,
          [cardId]: [...currentEffects, effect]
        };
      }
    });
  }, []);

  const clearEffects = useCallback((cardId: string) => {
    setCardEffectsState(prev => ({
      ...prev,
      [cardId]: []
    }));
  }, []);

  const setCardEffects = useCallback((cardId: string, effects: string[]) => {
    setCardEffectsState(prev => ({
      ...prev,
      [cardId]: effects
    }));
  }, []);

  const setActiveEffects = useCallback((effects: string[]) => {
    // This could be used for global effects if needed
    console.log('Setting active effects:', effects);
  }, []);

  return {
    cardEffects,
    isLoading,
    addEffect,
    removeEffect,
    toggleEffect,
    clearEffects,
    setCardEffects,
    setActiveEffects
  };
};

export default useCardEffects;
