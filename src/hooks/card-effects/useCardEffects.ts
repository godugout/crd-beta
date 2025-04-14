import { useState, useCallback } from 'react';
import { CardEffect } from '@/components/card-creation/types/cardTypes';

export type EffectSettings = {
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  goldIntensity: number;
  chromeIntensity: number;
  vintageIntensity: number;
  refractorIntensity: number;
  spectralIntensity: number;
};

export type CardEffectsResult = {
  activeEffects: string[];
  setActiveEffects: React.Dispatch<React.SetStateAction<string[]>>;
  addEffect: (effect: string) => void;
  removeEffect: (effect: string) => void;
  toggleEffect: (effect: string) => void;
  updateEffectSettings: (effect: string, settings: Partial<CardEffect>) => void;
  getEffectSettings: (effect: string) => CardEffect | undefined;
  effectStack: CardEffect[];
  getEffectClasses: () => string;
};

const useCardEffects = (): CardEffectsResult => {
  const [activeEffects, setActiveEffects] = useState<string[]>([]);

  const addEffect = useCallback((effect: string) => {
    setActiveEffects(prev => {
      if (prev.includes(effect)) return prev;
      return [...prev, effect];
    });
  }, []);

  const removeEffect = useCallback((effect: string) => {
    setActiveEffects(prev => prev.filter(e => e !== effect));
  }, []);

  const toggleEffect = useCallback((effect: string) => {
    setActiveEffects(prev => {
      if (prev.includes(effect)) {
        return prev.filter(e => e !== effect);
      } else {
        return [...prev, effect];
      }
    });
  }, []);

  const updateEffectSettings = useCallback((effect: string, settings: Partial<CardEffect>) => {
    // Implementation depends on how you store and manage effect settings
    console.log(`Updating settings for effect ${effect}`, settings);
  }, []);

  const getEffectSettings = useCallback((effect: string) => {
    // Implementation depends on how you store and manage effect settings
    console.log(`Getting settings for effect ${effect}`);
    return undefined;
  }, []);

  // Return the hook result including the missing properties
  return {
    activeEffects,
    setActiveEffects,
    addEffect,
    removeEffect,
    toggleEffect,
    updateEffectSettings,
    getEffectSettings,
    // Add the missing properties
    effectStack: [], // This should be replaced with your actual effect stack
    getEffectClasses: () => activeEffects.map(effect => `effect-${effect.toLowerCase()}`).join(' ')
  };
};

export default useCardEffects;
