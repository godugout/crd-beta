
import { useCallback, useState } from 'react';

export interface EffectIntensity {
  [effectName: string]: number;
}

export interface CardEffectHook {
  availableEffects: string[];
  activeEffects: string[];
  effectIntensities: EffectIntensity;
  toggleEffect: (effectName: string) => void;
  adjustEffectIntensity: (effectName: string, intensity: number) => void;
  getEffectClass: (effectName: string) => string;
}

/**
 * Custom hook for managing card effects
 * Supports holographic, refractor, vintage, goldFoil, prismatic effects
 */
export function useCardEffects(): CardEffectHook {
  // Define available effects
  const availableEffects = [
    'Holographic',
    'Refractor',
    'Vintage',
    'Gold Foil',
    'Prismatic',
    'Chrome',
    'Electric',
  ];

  // State for active effects and their intensities
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<EffectIntensity>({
    Holographic: 0.7,
    Refractor: 0.8,
    Vintage: 0.5,
    'Gold Foil': 0.7,
    Prismatic: 0.6,
    Chrome: 0.6,
    Electric: 0.8,
  });

  // Toggle an effect on or off
  const toggleEffect = useCallback((effectName: string) => {
    setActiveEffects(prev => {
      if (prev.includes(effectName)) {
        return prev.filter(e => e !== effectName);
      } else {
        return [...prev, effectName];
      }
    });
  }, []);

  // Adjust the intensity of an effect
  const adjustEffectIntensity = useCallback((effectName: string, intensity: number) => {
    setEffectIntensities(prev => ({
      ...prev,
      [effectName]: intensity
    }));
    
    // Update CSS variable for the effect
    document.documentElement.style.setProperty(
      `--${effectName.toLowerCase().replace(' ', '-')}-intensity`, 
      intensity.toString()
    );
  }, []);

  // Get the CSS class for an effect
  const getEffectClass = useCallback((effectName: string) => {
    return `effect-${effectName.toLowerCase().replace(' ', '')}`;
  }, []);

  return {
    availableEffects,
    activeEffects,
    effectIntensities,
    toggleEffect,
    adjustEffectIntensity,
    getEffectClass
  };
}
