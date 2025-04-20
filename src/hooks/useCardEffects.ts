
import { useState, useCallback } from 'react';
import { CardEffect } from '@/lib/types/cardEffects';

export interface CardEffectsResult {
  cardEffects: Record<string, string[]>;
  activeEffects: string[];
  effects: CardEffect[]; // Added for CardEffectsGallery component
  addEffect: (cardId: string, effect: string) => void;
  removeEffect: (cardId: string, effect: string) => void;
  toggleEffect: (cardId: string, effect: string) => void;
  clearEffects: (cardId: string) => void;
  setCardEffects: (cardId: string, effects: string[]) => void;
  setActiveEffects: (effects: string[]) => void;
  // Added for CardEffectsGallery component
  updateIntensity: (effectId: string, intensity: number) => void;
}

// Sample default effects to support CardEffectsGallery
const DEFAULT_EFFECTS: CardEffect[] = [
  { id: 'holographic', name: 'Holographic', intensity: 0.7, type: 'holographic', enabled: false },
  { id: 'refractor', name: 'Refractor', intensity: 0.8, type: 'refractor', enabled: false },
  { id: 'shimmer', name: 'Shimmer', intensity: 0.6, type: 'shimmer', enabled: false },
  { id: 'vintage', name: 'Vintage', intensity: 0.5, type: 'vintage', enabled: false }
];

export default function useCardEffects(): CardEffectsResult {
  const [cardEffects, setCardEffects] = useState<Record<string, string[]>>({});
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effects, setEffects] = useState<CardEffect[]>(DEFAULT_EFFECTS);

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

    // Also update the effects array for consistent state across components
    setEffects(prev => 
      prev.map(e => 
        e.id === effect ? { ...e, enabled: !e.enabled } : e
      )
    );
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

  const updateIntensity = useCallback((effectId: string, intensity: number) => {
    setEffects(prev => 
      prev.map(effect => 
        effect.id === effectId 
          ? { ...effect, intensity } 
          : effect
      )
    );
  }, []);

  return {
    cardEffects,
    activeEffects,
    effects,
    addEffect,
    removeEffect,
    toggleEffect,
    clearEffects,
    setCardEffects: setAllCardEffects,
    setActiveEffects,
    updateIntensity
  };
}

// Re-export the card effect type to fix the imports
export { CardEffect } from '@/lib/types/cardEffects';
