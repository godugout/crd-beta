
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface CardEffect {
  id: string;
  name: string;
  settings: any;
  active: boolean;
}

interface UseCardEffectsStackResult {
  effectStack: CardEffect[];
  addEffect: (name: string, settings?: any) => void;
  removeEffect: (id: string) => void;
  updateEffectSettings: (id: string, settings: any) => void;
  toggleEffect: (id: string) => void;
  getEffectClasses: () => string;
  activeEffects: string[];
  setActiveEffects: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useCardEffectsStack = (): UseCardEffectsStackResult => {
  const [effectStack, setEffectStack] = useState<CardEffect[]>([]);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  
  // Add a new effect to the stack
  const addEffect = useCallback((name: string, settings: any = {}) => {
    const newEffect: CardEffect = {
      id: uuidv4(),
      name,
      settings,
      active: true
    };
    
    setEffectStack(prev => [...prev, newEffect]);
  }, []);
  
  // Remove an effect from the stack
  const removeEffect = useCallback((id: string) => {
    setEffectStack(prev => prev.filter(effect => effect.id !== id));
  }, []);
  
  // Update an effect's settings
  const updateEffectSettings = useCallback((id: string, settings: any) => {
    setEffectStack(prev => 
      prev.map(effect => 
        effect.id === id ? { ...effect, settings: { ...effect.settings, ...settings } } : effect
      )
    );
  }, []);
  
  // Toggle an effect's active state
  const toggleEffect = useCallback((id: string) => {
    setEffectStack(prev => 
      prev.map(effect => 
        effect.id === id ? { ...effect, active: !effect.active } : effect
      )
    );
  }, []);
  
  // Get CSS classes for all active effects
  const getEffectClasses = useCallback(() => {
    return effectStack
      .filter(effect => effect.active)
      .map(effect => {
        const baseName = effect.name.toLowerCase().replace(/\s/g, '-');
        
        // Special handling for certain effects
        switch (baseName) {
          case 'refractor':
            return `effect-refractor ${effect.settings?.intensity || 'medium'}`;
          case 'holographic':
            return `effect-holographic ${effect.settings?.pattern || 'lines'}`;
          case 'glossy':
            return `effect-glossy ${effect.settings?.level || 'medium'}`;
          case 'matte':
            return 'effect-matte';
          case 'foil':
            return `effect-foil ${effect.settings?.color || 'rainbow'}`;
          case 'shadow':
            return `effect-shadow ${effect.settings?.depth || 'medium'}`;
          default:
            return `effect-${baseName}`;
        }
      })
      .join(' ');
  }, [effectStack]);
  
  return {
    effectStack,
    addEffect,
    removeEffect,
    updateEffectSettings,
    toggleEffect,
    getEffectClasses,
    activeEffects,
    setActiveEffects
  };
};
