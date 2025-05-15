
import { useState, useCallback, useEffect } from 'react';
import { UseCardEffectsResult, CardEffectSettings } from './types';

/**
 * Hook for managing card effects
 * Provides functionality for adding, removing, and configuring visual effects on cards
 */
const useCardEffects = (): UseCardEffectsResult => {
  const [cardEffects, setCardEffects] = useState<Record<string, string[]>>({});
  const [effectSettings, setEffectSettings] = useState<Record<string, Record<string, CardEffectSettings>>>({});
  const [activeEffects, setActiveEffects] = useState<string[]>([]);

  // Load saved effects from localStorage
  useEffect(() => {
    try {
      const savedEffects = localStorage.getItem('cardEffects');
      const savedSettings = localStorage.getItem('effectSettings');
      
      if (savedEffects) {
        setCardEffects(JSON.parse(savedEffects));
      }
      
      if (savedSettings) {
        setEffectSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load saved effects:', error);
    }
  }, []);

  // Save effects to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('cardEffects', JSON.stringify(cardEffects));
      localStorage.setItem('effectSettings', JSON.stringify(effectSettings));
    } catch (error) {
      console.error('Failed to save effects:', error);
    }
  }, [cardEffects, effectSettings]);

  const addEffect = useCallback((cardId: string, effect: string) => {
    setCardEffects(prev => {
      const currentEffects = prev[cardId] || [];
      if (currentEffects.includes(effect)) return prev;
      
      return {
        ...prev,
        [cardId]: [...currentEffects, effect]
      };
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
      
      return {
        ...prev,
        [cardId]: currentEffects.includes(effect)
          ? currentEffects.filter(e => e !== effect)
          : [...currentEffects, effect]
      };
    });
  }, []);

  const setCardEffectsArray = useCallback((cardId: string, effects: string[]) => {
    setCardEffects(prev => ({
      ...prev,
      [cardId]: [...effects]
    }));
  }, []);

  const clearEffects = useCallback((cardId: string) => {
    setCardEffects(prev => ({
      ...prev,
      [cardId]: []
    }));
  }, []);

  const updateEffectSettings = useCallback((
    cardId: string, 
    effect: string, 
    settings: CardEffectSettings
  ) => {
    setEffectSettings(prev => {
      const cardSettings = prev[cardId] || {};
      return {
        ...prev,
        [cardId]: {
          ...cardSettings,
          [effect]: {
            ...cardSettings[effect],
            ...settings
          }
        }
      };
    });
  }, []);

  const getEffectSettings = useCallback((
    cardId: string,
    effect: string
  ): CardEffectSettings | undefined => {
    return effectSettings[cardId]?.[effect];
  }, [effectSettings]);

  return {
    cardEffects,
    activeEffects,
    setActiveEffects,
    addEffect,
    removeEffect,
    toggleEffect,
    setCardEffects: setCardEffectsArray,
    clearEffects,
    updateEffectSettings,
    getEffectSettings
  };
};

export default useCardEffects;
