
import { useState } from 'react';
import { CardEffectsResult } from '@/lib/types/cardEffects';

export default function useCardEffects(): CardEffectsResult {
  const [cardEffects, setCardEffects] = useState<Record<string, string[]>>({});
  const [activeEffects, setActiveEffects] = useState<string[]>([]);

  const addEffect = (cardId: string, effect: string) => {
    setCardEffects(prev => {
      const cardPrevEffects = prev[cardId] || [];
      if (cardPrevEffects.includes(effect)) return prev;
      
      return {
        ...prev,
        [cardId]: [...cardPrevEffects, effect]
      };
    });
  };

  const removeEffect = (cardId: string, effect: string) => {
    setCardEffects(prev => {
      const cardPrevEffects = prev[cardId] || [];
      return {
        ...prev,
        [cardId]: cardPrevEffects.filter(e => e !== effect)
      };
    });
  };

  const toggleEffect = (cardId: string, effect: string) => {
    setCardEffects(prev => {
      const cardPrevEffects = prev[cardId] || [];
      
      if (cardPrevEffects.includes(effect)) {
        return {
          ...prev,
          [cardId]: cardPrevEffects.filter(e => e !== effect)
        };
      } else {
        return {
          ...prev,
          [cardId]: [...cardPrevEffects, effect]
        };
      }
    });
  };

  const clearEffects = (cardId: string) => {
    setCardEffects(prev => ({
      ...prev,
      [cardId]: []
    }));
  };

  const setAllCardEffects = (cardId: string, effects: string[]) => {
    setCardEffects(prev => ({
      ...prev,
      [cardId]: effects
    }));
  };

  return {
    cardEffects,
    activeEffects,
    addEffect,
    removeEffect,
    toggleEffect,
    clearEffects,
    setCardEffects: setAllCardEffects,
    setActiveEffects
  };
}
