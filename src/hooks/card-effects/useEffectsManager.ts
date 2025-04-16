
import { useState, useCallback } from 'react';

const defaultEffects = [
  {
    id: 'Holographic',
    name: 'Holographic',
    description: 'Rainbow reflective pattern',
    default: 0.5
  },
  {
    id: 'Refractor',
    name: 'Refractor',
    description: 'Light bending prismatic effect',
    default: 0.5
  },
  {
    id: 'Chrome',
    name: 'Chrome',
    description: 'Metallic chrome finish',
    default: 0.6
  },
  {
    id: 'Shimmer',
    name: 'Shimmer',
    description: 'Subtle shimmering effect',
    default: 0.4
  },
  {
    id: 'Vintage',
    name: 'Vintage',
    description: 'Aged vintage look',
    default: 0.7
  },
  {
    id: 'Gold Foil',
    name: 'Gold Foil',
    description: 'Gold foil accents',
    default: 0.5
  }
];

const useEffectsManager = () => {
  const [availableEffects] = useState(defaultEffects);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>({});

  const toggleEffect = useCallback((effectId: string) => {
    setActiveEffects(prev => {
      if (prev.includes(effectId)) {
        return prev.filter(id => id !== effectId);
      } else {
        // Add with default intensity
        const effect = availableEffects.find(e => e.id === effectId);
        if (effect) {
          setEffectIntensities(prev => ({
            ...prev,
            [effectId]: effect.default
          }));
        }
        return [...prev, effectId];
      }
    });
  }, [availableEffects]);

  const adjustEffectIntensity = useCallback((effectId: string, intensity: number) => {
    setEffectIntensities(prev => ({
      ...prev,
      [effectId]: intensity
    }));
  }, []);

  return {
    availableEffects,
    activeEffects,
    toggleEffect,
    effectIntensities,
    adjustEffectIntensity
  };
};

export default useEffectsManager;
