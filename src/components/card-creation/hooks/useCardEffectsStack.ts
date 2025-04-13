
import { useState, useCallback } from 'react';

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
  
  const getEffectClasses = useCallback(() => {
    return effectStack.join(' ');
  }, [effectStack]);
  
  return {
    effectStack,
    addEffect,
    removeEffect,
    toggleEffect,
    getEffectClasses
  };
}
