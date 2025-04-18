
import { useState, useCallback } from 'react';

export interface CardEffect {
  id: string;
  name: string;
  enabled: boolean;
  settings: {
    intensity: number;
    color?: string;
    speed?: number;
    pattern?: string;
    animationEnabled?: boolean;
  };
}

export const useCardEffects = (initialEffects: string[] = []) => {
  const [effects, setEffects] = useState<CardEffect[]>([
    {
      id: 'holographic',
      name: 'Holographic',
      enabled: initialEffects.includes('holographic'),
      settings: {
        intensity: 1.0,
        color: '#00ffff',
        animationEnabled: true
      }
    },
    {
      id: 'refractor',
      name: 'Refractor',
      enabled: initialEffects.includes('refractor'),
      settings: {
        intensity: 0.8,
        pattern: 'wave'
      }
    },
    {
      id: 'chrome',
      name: 'Chrome',
      enabled: initialEffects.includes('chrome'),
      settings: {
        intensity: 1.0
      }
    },
    {
      id: 'goldFoil',
      name: 'Gold Foil',
      enabled: initialEffects.includes('goldFoil'),
      settings: {
        intensity: 0.7,
        color: '#ffcc00'
      }
    },
    {
      id: 'vintage',
      name: 'Vintage',
      enabled: initialEffects.includes('vintage'),
      settings: {
        intensity: 0.6
      }
    },
    {
      id: 'prismatic',
      name: 'Prismatic',
      enabled: initialEffects.includes('prismatic'),
      settings: {
        intensity: 0.8,
        color: '#ff00ff'
      }
    },
    {
      id: 'mojo',
      name: 'Mojo',
      enabled: initialEffects.includes('mojo'),
      settings: {
        intensity: 0.9,
        pattern: 'swirl'
      }
    }
  ]);
  
  // Toggle an effect on or off
  const toggleEffect = useCallback((effectId: string) => {
    setEffects(prevEffects => 
      prevEffects.map(effect => 
        effect.id === effectId 
          ? { ...effect, enabled: !effect.enabled } 
          : effect
      )
    );
  }, []);
  
  // Update effect intensity
  const updateIntensity = useCallback((effectId: string, intensity: number) => {
    setEffects(prevEffects => 
      prevEffects.map(effect => 
        effect.id === effectId 
          ? { ...effect, settings: { ...effect.settings, intensity } } 
          : effect
      )
    );
  }, []);
  
  // Get active effect IDs
  const getActiveEffectIds = useCallback(() => {
    return effects
      .filter(effect => effect.enabled)
      .map(effect => effect.id);
  }, [effects]);
  
  // Get effect intensities as a record
  const getEffectIntensities = useCallback(() => {
    return effects.reduce((acc, effect) => {
      acc[effect.id] = effect.settings.intensity;
      return acc;
    }, {} as Record<string, number>);
  }, [effects]);
  
  return {
    effects,
    toggleEffect,
    updateIntensity,
    activeEffects: getActiveEffectIds(),
    effectIntensities: getEffectIntensities()
  };
};

export default useCardEffects;
