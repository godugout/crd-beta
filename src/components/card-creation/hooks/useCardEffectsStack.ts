
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface CardEffect {
  id: string;
  name: string;
  settings: any;
  active: boolean;
}

export function useCardEffectsStack() {
  const [effectStack, setEffectStack] = useState<string[]>([]);
  
  const addEffect = useCallback((effect: string) => {
    setEffectStack(prev => [...prev, effect]);
  }, []);
  
  const removeEffect = useCallback((effect: string) => {
    setEffectStack(prev => prev.filter(ef => ef !== effect));
  }, []);
  
  const toggleEffect = useCallback((effect: string) => {
    setEffectStack(prev => 
      prev.includes(effect) 
        ? prev.filter(ef => ef !== effect)
        : [...prev, effect]
    );
  }, []);
  
  const updateEffectSettings = useCallback((effectId: string, settings: any) => {
    // This is just a placeholder for the type definition
    // The actual implementation would update the settings for a specific effect
    console.log('Updating effect settings for', effectId, settings);
  }, []);
  
  const getEffectClasses = useCallback(() => {
    return effectStack.join(' ');
  }, [effectStack]);
  
  return {
    effectStack,
    addEffect,
    removeEffect,
    toggleEffect,
    updateEffectSettings,
    getEffectClasses
  };
}
