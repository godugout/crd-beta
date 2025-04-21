
import { useState, useEffect } from 'react';

export type CardEffect = 
  'Holographic' | 
  'Shimmer' | 
  'Refractor' | 
  'Chrome' | 
  'Gold Foil' | 
  'Vintage' | 
  'Spectral' | 
  'Prismatic' | 
  'Electric';

export interface EffectSettings {
  intensity: number;
  speed?: number;
  color?: string;
  enabled: boolean;
}

export interface CardEffectsResult {
  cardEffects: Record<string, string[]>;
  activeEffects: string[];
  addEffect: (cardId: string, effect: string) => void;
  removeEffect: (cardId: string, effect: string) => void;
  toggleEffect: (cardId: string, effect: string) => void;
  setCardEffects: (cardId: string, effects: string[]) => void;
  clearEffects: (cardId: string) => void;
  setActiveEffects: (effects: string[]) => void;
  effectSettings: Record<CardEffect, EffectSettings>;
  updateEffectSetting: (effect: CardEffect, settings: Partial<EffectSettings>) => void;
}

const defaultEffectSettings: Record<CardEffect, EffectSettings> = {
  Holographic: { intensity: 0.7, speed: 1, color: '#8050ff', enabled: true },
  Shimmer: { intensity: 0.5, speed: 0.8, color: '#ffffff', enabled: true },
  Refractor: { intensity: 0.6, speed: 0.5, color: '#50a0ff', enabled: true },
  Chrome: { intensity: 0.8, speed: 0.3, color: '#c0c0c0', enabled: true },
  'Gold Foil': { intensity: 0.7, speed: 0.4, color: '#ffb700', enabled: true },
  Vintage: { intensity: 0.6, speed: 0.2, color: '#aa8866', enabled: true },
  Spectral: { intensity: 0.8, speed: 1.2, color: '#50ff80', enabled: true },
  Prismatic: { intensity: 0.9, speed: 1.0, color: '#ff5080', enabled: true },
  Electric: { intensity: 0.7, speed: 1.5, color: '#40a0ff', enabled: true }
};

const useCardEffects = (): CardEffectsResult => {
  // Store effects for each card ID
  const [cardEffects, setCardEffects] = useState<Record<string, string[]>>({});
  // Currently active effects (for the current card being viewed)
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  // Settings for each effect type
  const [effectSettings, setEffectSettings] = useState<Record<CardEffect, EffectSettings>>(defaultEffectSettings);

  // Load saved effects from localStorage on mount
  useEffect(() => {
    try {
      const savedEffects = localStorage.getItem('cardEffects');
      if (savedEffects) {
        setCardEffects(JSON.parse(savedEffects));
      }

      const savedSettings = localStorage.getItem('effectSettings');
      if (savedSettings) {
        setEffectSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading card effects:', error);
    }
  }, []);

  // Save effects to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('cardEffects', JSON.stringify(cardEffects));
    } catch (error) {
      console.error('Error saving card effects:', error);
    }
  }, [cardEffects]);

  // Save effect settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('effectSettings', JSON.stringify(effectSettings));
    } catch (error) {
      console.error('Error saving effect settings:', error);
    }
  }, [effectSettings]);

  // Add an effect to a card
  const addEffect = (cardId: string, effect: string) => {
    setCardEffects(prev => {
      const currentEffects = prev[cardId] || [];
      if (!currentEffects.includes(effect)) {
        const newEffects = [...currentEffects, effect];
        return { ...prev, [cardId]: newEffects };
      }
      return prev;
    });
  };

  // Remove an effect from a card
  const removeEffect = (cardId: string, effect: string) => {
    setCardEffects(prev => {
      const currentEffects = prev[cardId] || [];
      const newEffects = currentEffects.filter(e => e !== effect);
      return { ...prev, [cardId]: newEffects };
    });
  };

  // Toggle an effect for a card
  const toggleEffect = (cardId: string, effect: string) => {
    setCardEffects(prev => {
      const currentEffects = prev[cardId] || [];
      if (currentEffects.includes(effect)) {
        const newEffects = currentEffects.filter(e => e !== effect);
        return { ...prev, [cardId]: newEffects };
      } else {
        const newEffects = [...currentEffects, effect];
        return { ...prev, [cardId]: newEffects };
      }
    });
  };

  // Set all effects for a card
  const setAllCardEffects = (cardId: string, effects: string[]) => {
    setCardEffects(prev => ({
      ...prev,
      [cardId]: effects
    }));
  };

  // Clear all effects for a card
  const clearEffects = (cardId: string) => {
    setCardEffects(prev => ({
      ...prev,
      [cardId]: []
    }));
  };

  // Update a specific effect setting
  const updateEffectSetting = (effect: CardEffect, settings: Partial<EffectSettings>) => {
    setEffectSettings(prev => ({
      ...prev,
      [effect]: { ...prev[effect], ...settings }
    }));
  };

  return {
    cardEffects,
    activeEffects,
    addEffect,
    removeEffect,
    toggleEffect,
    setCardEffects: setAllCardEffects,
    clearEffects,
    setActiveEffects,
    effectSettings,
    updateEffectSetting
  };
};

export default useCardEffects;
