
import { useState, useCallback } from 'react';
import { CardEffectsResult } from '@/lib/types';

const useCardEffects = (): CardEffectsResult => {
  const [cardEffects, setCardEffects] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const addEffect = useCallback((cardId: string, effect: string) => {
    setCardEffects(prev => {
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
    setCardEffects(prev => {
      const currentEffects = prev[cardId] || [];
      return {
        ...prev,
        [cardId]: currentEffects.filter(e => e !== effect)
      };
    });
  }, []);

  const toggleEffect = useCallback((cardId: string, effect: string) => {
    setCardEffects(prev => {
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
    setCardEffects(prev => ({
      ...prev,
      [cardId]: []
    }));
  }, []);

  const setCardEffects = useCallback((cardId: string, effects: string[]) => {
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
    setCardEffects
  };
};

export default useCardEffects;
