
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface CardEffect {
  id: string;
  name: string;
  settings: {
    enabled: boolean;
    intensity: number;
    speed: number;
    [key: string]: any;
  };
}

interface UseCardEffectsStackResult {
  effectStack: CardEffect[];
  addEffect: (effectName: string) => void;
  removeEffect: (effectId: string) => void;
  updateEffectSettings: (effectId: string, settings: any) => void;
  getEffectClasses: () => string;
}

const getDefaultSettings = (effectName: string) => {
  const baseSettings = {
    enabled: true,
    intensity: 1.0,
    speed: 1.0
  };
  
  switch (effectName) {
    case 'Holographic':
      return {
        ...baseSettings,
        rainbowStrength: 1.0
      };
    case 'Refractor':
      return {
        ...baseSettings,
        angle: 45
      };
    case 'Chrome':
      return {
        ...baseSettings,
        reflectionStrength: 0.8
      };
    case 'Gold':
      return {
        ...baseSettings,
        shimmerIntensity: 0.8
      };
    case 'Spectral':
      return {
        ...baseSettings,
        hologramIntensity: 0.7,
        particleCount: 50
      };
    case 'Electric':
      return {
        ...baseSettings,
        pulseIntensity: 0.8,
        glowColor: '#e60073'
      };
    case 'Vintage':
      return {
        ...baseSettings,
        sepiaAmount: 0.5,
        grainAmount: 0.2
      };
    case 'Prismatic':
      return {
        ...baseSettings,
        colorShift: 1.0,
        saturation: 1.2
      };
    default:
      return baseSettings;
  }
};

export const useCardEffectsStack = (): UseCardEffectsStackResult => {
  const [effectStack, setEffectStack] = useState<CardEffect[]>([]);

  // Add an effect to the stack
  const addEffect = useCallback((effectName: string) => {
    // Check if effect already exists
    if (effectStack.some(effect => effect.name === effectName)) {
      return;
    }
    
    const newEffect: CardEffect = {
      id: uuidv4(),
      name: effectName,
      settings: getDefaultSettings(effectName)
    };
    
    setEffectStack(prevStack => [...prevStack, newEffect]);
  }, [effectStack]);
  
  // Remove an effect from the stack
  const removeEffect = useCallback((effectId: string) => {
    setEffectStack(prevStack => prevStack.filter(effect => effect.id !== effectId));
  }, []);
  
  // Update effect settings
  const updateEffectSettings = useCallback((effectId: string, settings: any) => {
    setEffectStack(prevStack =>
      prevStack.map(effect =>
        effect.id === effectId
          ? { ...effect, settings: { ...effect.settings, ...settings } }
          : effect
      )
    );
  }, []);
  
  // Generate CSS classes for active effects
  const getEffectClasses = useCallback(() => {
    return effectStack
      .filter(effect => effect.settings.enabled)
      .map(effect => {
        switch (effect.name) {
          case 'Holographic':
            return 'card-holographic';
          case 'Refractor':
            return 'card-refractor';
          case 'Chrome':
            return 'card-chrome';
          case 'Gold':
            return 'card-gold-foil';
          case 'Spectral':
            return 'spectral-hologram';
          case 'Electric':
            return 'card-electric';
          case 'Vintage':
            return 'card-vintage';
          case 'Prismatic':
            return 'card-prismatic';
          default:
            return '';
        }
      })
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
