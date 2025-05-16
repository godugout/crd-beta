import { useState, useEffect, useCallback } from 'react';
import { CardEffect, CardEffectSettings } from '@/lib/types/cardTypes';
import { applyCardEffect, removeCardEffect } from './effectRegistry';
import { PREMIUM_EFFECTS } from './utils';

export interface CardEffectsState {
  activeEffects: Record<string, boolean>;
  effectSettings: Record<string, CardEffectSettings>;
  availableEffects: CardEffect[];
  premiumEffects: CardEffect[];
}

export interface CardEffectsActions {
  enableEffect: (effectId: string) => void;
  disableEffect: (effectId: string) => void;
  toggleEffect: (effectId: string) => void;
  updateEffectSettings: (effectId: string, settings: Partial<CardEffectSettings>) => void;
  resetEffects: () => void;
  applyEffectsToElement: (elementId: string) => void;
  removeEffectsFromElement: (elementId: string) => void;
}

export const useCardEffects = (
  initialEffects: string[] = [],
  initialSettings: Record<string, CardEffectSettings> = {}
): [CardEffectsState, CardEffectsActions] => {
  const [activeEffects, setActiveEffects] = useState<Record<string, boolean>>({});
  const [effectSettings, setEffectSettings] = useState<Record<string, CardEffectSettings>>(initialSettings);
  const [availableEffects, setAvailableEffects] = useState<CardEffect[]>([]);
  const [premiumEffects, setPremiumEffects] = useState<CardEffect[]>([]);
  const [effectElements, setEffectElements] = useState<Record<string, HTMLElement>>({});

  // Initialize effects
  useEffect(() => {
    // Set up available effects
    setPremiumEffects(PREMIUM_EFFECTS);
    
    // Set initial active effects
    const initialActiveEffects: Record<string, boolean> = {};
    initialEffects.forEach(effect => {
      initialActiveEffects[effect] = true;
    });
    setActiveEffects(initialActiveEffects);
    
    // Clean up effects when component unmounts
    return () => {
      Object.keys(effectElements).forEach(elementId => {
        const element = effectElements[elementId];
        if (element) {
          Object.keys(activeEffects).forEach(effectId => {
            if (activeEffects[effectId]) {
              removeCardEffect(element, effectId);
            }
          });
        }
      });
    };
  }, []);

  // Apply effects when activeEffects or effectElements change
  useEffect(() => {
    Object.entries(effectElements).forEach(([elementId, element]) => {
      Object.entries(activeEffects).forEach(([effectId, isActive]) => {
        if (isActive) {
          const settings = effectSettings[effectId] || {};
          applyCardEffect(element, effectId, settings);
        } else {
          removeCardEffect(element, effectId);
        }
      });
    });
  }, [activeEffects, effectElements, effectSettings]);

  const enableEffect = (effectId: string) => {
    const [cardId, effect] = effectId.split(':');
    setActiveEffects(prev => ({
      ...prev,
      [effectId]: true
    }));
  };

  const disableEffect = (effectId: string) => {
    setActiveEffects(prev => ({
      ...prev,
      [effectId]: false
    }));
  };

  const toggleEffect = (effectId: string) => {
    setActiveEffects(prev => ({
      ...prev,
      [effectId]: !prev[effectId]
    }));
  };

  const updateEffectSettings = (effectId: string, settings: Partial<CardEffectSettings>) => {
    const [cardId, effect] = effectId.split(':');
    setEffectSettings(prev => ({
      ...prev,
      [effectId]: {
        ...(prev[effectId] || {}),
        ...settings
      }
    }));
  };

  const resetEffects = () => {
    setActiveEffects({});
    setEffectSettings({});
  };

  const applyEffectsToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setEffectElements(prev => ({
      ...prev,
      [elementId]: element
    }));

    // Apply active effects to the element
    Object.entries(activeEffects).forEach(([effectId, isActive]) => {
      if (isActive) {
        const settings = effectSettings[effectId] || {};
        applyCardEffect(element, effectId, settings);
      }
    });
  }, [activeEffects, effectSettings]);

  const removeEffectsFromElement = useCallback((elementId: string) => {
    const element = effectElements[elementId];
    if (!element) return;

    // Remove all effects from the element
    Object.keys(activeEffects).forEach(effectId => {
      removeCardEffect(element, effectId);
    });

    // Remove element from tracked elements
    setEffectElements(prev => {
      const newElements = { ...prev };
      delete newElements[elementId];
      return newElements;
    });
  }, [activeEffects, effectElements]);

  return [
    {
      activeEffects,
      effectSettings,
      availableEffects,
      premiumEffects
    },
    {
      enableEffect,
      disableEffect,
      toggleEffect,
      updateEffectSettings,
      resetEffects,
      applyEffectsToElement,
      removeEffectsFromElement
    }
  ];
};

export default useCardEffects;
