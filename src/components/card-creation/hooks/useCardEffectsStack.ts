
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { premiumEffects } from '@/hooks/card-effects/utils';

export interface CardEffect {
  id: string;
  name: string;
  settings: {
    intensity: number;
    speed: number;
    [key: string]: any;
  };
}

export const useCardEffectsStack = (initialEffects: CardEffect[] = []) => {
  const [effectStack, setEffectStack] = useState<CardEffect[]>(initialEffects);

  const addEffect = useCallback((name: string, customSettings = {}) => {
    const effectTemplate = premiumEffects[name];
    if (!effectTemplate) return;

    const newEffect: CardEffect = {
      id: uuidv4(),
      name: effectTemplate.name,
      settings: {
        ...effectTemplate.settings,
        ...customSettings
      }
    };

    setEffectStack(prev => [...prev, newEffect]);
  }, []);

  const removeEffect = useCallback((id: string) => {
    setEffectStack(prev => prev.filter(effect => effect.id !== id));
  }, []);

  const updateEffectSettings = useCallback((id: string, newSettings: any) => {
    setEffectStack(prev => 
      prev.map(effect => 
        effect.id === id 
          ? { ...effect, settings: newSettings } 
          : effect
      )
    );
  }, []);

  const getEffectClasses = useCallback(() => {
    return effectStack
      .map(effect => `effect-${effect.name.toLowerCase().replace(/\s+/g, '-')}`)
      .join(' ');
  }, [effectStack]);

  return {
    effectStack,
    addEffect,
    removeEffect,
    updateEffectSettings,
    getEffectClasses
  };
};
