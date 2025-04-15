
import { useState, useCallback } from 'react';
import { CardEffectSettings } from '@/hooks/card-effects/types';
import { toast } from 'sonner';
import { CardEffect } from '../types/cardTypes';

export const useCardEffectsStack = (initialEffects: string[] = []) => {
  const [activeEffects, setActiveEffects] = useState<string[]>(initialEffects);
  const [effectSettings, setEffectSettings] = useState<Record<string, CardEffectSettings>>({});
  const [effectStack, setEffectStack] = useState<CardEffect[]>([]);

  const addEffect = useCallback((effect: string, settings?: CardEffectSettings) => {
    setActiveEffects(prev => {
      if (prev.includes(effect)) return prev;
      
      // Initialize with default settings for this effect
      const defaultSettings: CardEffectSettings = {
        intensity: 1.0,
        speed: 1.0,
        pattern: undefined,
        color: undefined,
        animationEnabled: true,
        ...settings
      };
      
      setEffectSettings(prevSettings => ({
        ...prevSettings,
        [effect]: defaultSettings
      }));
      
      // Add to effect stack
      setEffectStack(prev => [
        ...prev, 
        { 
          id: `${effect}-${Date.now()}`, 
          name: effect, 
          enabled: true, 
          settings: defaultSettings,
          className: `effect-${effect.toLowerCase()}`
        }
      ]);
      
      toast.success(`${effect} effect added`);
      return [...prev, effect];
    });
  }, []);

  const removeEffect = useCallback((id: string) => {
    setEffectStack(prev => {
      const effectToRemove = prev.find(effect => effect.id === id);
      
      if (effectToRemove) {
        setActiveEffects(activeEffects => activeEffects.filter(name => name !== effectToRemove.name));
        toast.success(`${effectToRemove.name} effect removed`);
      }
      
      return prev.filter(effect => effect.id !== id);
    });
  }, []);

  const toggleEffect = useCallback((effect: string) => {
    if (activeEffects.includes(effect)) {
      const effectToRemove = effectStack.find(e => e.name === effect);
      if (effectToRemove) {
        removeEffect(effectToRemove.id);
      }
    } else {
      addEffect(effect);
    }
  }, [activeEffects, effectStack, addEffect, removeEffect]);

  const updateEffectSettings = useCallback((id: string, settings: Partial<CardEffectSettings>) => {
    setEffectStack(prev => {
      return prev.map(effect => {
        if (effect.id === id) {
          return {
            ...effect,
            settings: {
              ...effect.settings,
              ...settings
            }
          };
        }
        return effect;
      });
    });
    
    // Also update in the effectSettings record
    const effect = effectStack.find(e => e.id === id);
    if (effect) {
      setEffectSettings(prev => ({
        ...prev,
        [effect.name]: {
          ...(prev[effect.name] || {}),
          ...settings
        }
      }));
    }
  }, [effectStack]);

  const getEffectSettings = useCallback((effect: string): CardEffectSettings => {
    return effectSettings[effect] || { intensity: 1.0, speed: 1.0 };
  }, [effectSettings]);
  
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

export default useCardEffectsStack;
