
import { useState, useCallback } from 'react';

export interface EffectIntensities {
  [key: string]: number;
}

const useEffectsManager = () => {
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<EffectIntensities>({
    'Holographic': 0.5,
    'Refractor': 0.5,
    'Shimmer': 0.5,
    'Vintage': 0.5,
    'Gold Foil': 0.5
  });

  const availableEffects = [
    { id: 'Holographic', name: 'Holographic', description: 'Rainbow holographic effect' },
    { id: 'Refractor', name: 'Refractor', description: 'Light refraction effect' },
    { id: 'Shimmer', name: 'Shimmer', description: 'Subtle shimmer effect' },
    { id: 'Gold Foil', name: 'Gold Foil', description: 'Premium gold foil accents' },
    { id: 'Vintage', name: 'Vintage', description: 'Classic vintage look' }
  ];

  const toggleEffect = useCallback((effectId: string) => {
    setActiveEffects(prevEffects => {
      if (prevEffects.includes(effectId)) {
        return prevEffects.filter(id => id !== effectId);
      } else {
        return [...prevEffects, effectId];
      }
    });
  }, []);

  const adjustEffectIntensity = useCallback((effectId: string, intensity: number) => {
    setEffectIntensities(prev => ({
      ...prev,
      [effectId]: intensity
    }));
  }, []);

  return {
    availableEffects,
    activeEffects,
    effectIntensities,
    toggleEffect,
    adjustEffectIntensity
  };
};

export default useEffectsManager;
