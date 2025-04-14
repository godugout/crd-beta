
import { useState, useCallback } from 'react';
import { CardEffectSettings, PremiumCardEffect } from '@/hooks/card-effects/types';
import { toast } from 'sonner';

export const useCardEffectsStack = (initialEffects: string[] = []) => {
  const [activeEffects, setActiveEffects] = useState<string[]>(initialEffects);
  const [effectSettings, setEffectSettings] = useState<Record<string, CardEffectSettings>>({});

  const addEffect = useCallback((effect: string) => {
    setActiveEffects(prev => {
      if (prev.includes(effect)) return prev;
      
      // Initialize with default settings for this effect
      setEffectSettings(prevSettings => ({
        ...prevSettings,
        [effect]: {
          intensity: 1.0,
          speed: 1.0,
          // Optional fields that might or might not be used
          pattern: undefined,
          color: undefined,
          animationEnabled: true
        }
      }));
      
      toast.success(`${effect} effect added`);
      return [...prev, effect];
    });
  }, []);

  const removeEffect = useCallback((effect: string) => {
    setActiveEffects(prev => {
      if (!prev.includes(effect)) return prev;
      
      // Remove settings for this effect
      setEffectSettings(prevSettings => {
        const newSettings = { ...prevSettings };
        delete newSettings[effect];
        return newSettings;
      });
      
      toast.success(`${effect} effect removed`);
      return prev.filter(e => e !== effect);
    });
  }, []);

  const toggleEffect = useCallback((effect: string) => {
    if (activeEffects.includes(effect)) {
      removeEffect(effect);
    } else {
      addEffect(effect);
    }
  }, [activeEffects, addEffect, removeEffect]);

  const updateEffectSettings = useCallback((effect: string, settings: Partial<CardEffectSettings>) => {
    setEffectSettings(prev => {
      const currentSettings = prev[effect] || { intensity: 1.0, speed: 1.0 };
      return {
        ...prev,
        [effect]: {
          ...currentSettings,
          ...settings
        }
      };
    });
  }, []);

  const getEffectSettings = useCallback((effect: string): CardEffectSettings => {
    return effectSettings[effect] || { intensity: 1.0, speed: 1.0 };
  }, [effectSettings]);

  return {
    activeEffects,
    setActiveEffects,
    addEffect,
    removeEffect,
    toggleEffect,
    updateEffectSettings,
    getEffectSettings,
    effectSettings
  };
};
