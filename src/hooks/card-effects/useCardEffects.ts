
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

const DEFAULT_EFFECT_SETTINGS = {
  motionSpeed: 1.0,
  pulseIntensity: 0.7,
  shimmerSpeed: 3.0,
  goldIntensity: 0.8,
  chromeIntensity: 0.8,
  vintageIntensity: 0.6,
  refractorIntensity: 0.85,
  spectralIntensity: 0.75
};

const useCardEffects = (): CardEffectsResult => {
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectSettings, setEffectSettings] = useState<Record<string, CardEffect>>({});
  
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
    setEffectSettings(prev => ({
      ...prev,
      [effect]: {
        ...(prev[effect] || { 
          id: effect,
          name: effect,
          enabled: true,
          settings: DEFAULT_EFFECT_SETTINGS,
          className: `effect-${effect.toLowerCase()}`
        }),
        ...settings
      }
    }));
  }, []);

  const getEffectSettings = useCallback((effect: string) => {
    return effectSettings[effect];
  }, [effectSettings]);

  // Calculate effectStack from active effects and settings
  const effectStack = activeEffects.map(effectName => {
    return effectSettings[effectName] || {
      id: effectName,
      name: effectName,
      enabled: true,
      settings: DEFAULT_EFFECT_SETTINGS,
      className: `effect-${effectName.toLowerCase()}`
    };
  });

  // Generate classes for all active effects
  const getEffectClasses = useCallback(() => {
    return activeEffects
      .map(effect => `effect-${effect.toLowerCase()}`)
      .join(' ');
  }, [activeEffects]);

  return {
    activeEffects,
    setActiveEffects,
    addEffect,
    removeEffect,
    toggleEffect,
    updateEffectSettings,
    getEffectSettings,
    effectStack,
    getEffectClasses
  };
};

export default useCardEffects;
