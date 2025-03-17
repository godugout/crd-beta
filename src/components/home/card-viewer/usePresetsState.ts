
import { useState } from 'react';
import { EffectPreset } from './EffectsPresets';

const BUILT_IN_PRESETS: EffectPreset[] = [
  {
    id: 'premium-sports',
    name: 'Premium Sports Card',
    description: 'High-end look for sports collectors',
    effects: ['Gold Foil', 'Refractor'],
    settings: {
      motionSpeed: 1.2,
      pulseIntensity: 1.0,
      shimmerSpeed: 3.0,
      goldIntensity: 1.3,
      chromeIntensity: 1.0,
      vintageIntensity: 1.0
    },
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'vintage-collector',
    name: 'Vintage Collector',
    description: 'Classic aged appearance for retro cards',
    effects: ['Vintage'],
    settings: {
      motionSpeed: 0.8,
      pulseIntensity: 1.0,
      shimmerSpeed: 3.0,
      goldIntensity: 1.0,
      chromeIntensity: 1.0,
      vintageIntensity: 1.5
    },
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'modern-showcase',
    name: 'Modern Showcase',
    description: 'Bold and vibrant modern card style',
    effects: ['Chrome', 'Electric'],
    settings: {
      motionSpeed: 1.5,
      pulseIntensity: 1.2,
      shimmerSpeed: 3.0,
      goldIntensity: 1.0,
      chromeIntensity: 1.4,
      vintageIntensity: 1.0
    },
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'limited-edition',
    name: 'Limited Edition',
    description: 'Premium look for special releases',
    effects: ['Prismatic', 'Gold Foil'],
    settings: {
      motionSpeed: 1.3,
      pulseIntensity: 1.0,
      shimmerSpeed: 3.0,
      goldIntensity: 1.2,
      chromeIntensity: 1.0,
      vintageIntensity: 1.0
    },
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'holographic-deluxe',
    name: 'Holographic Deluxe',
    description: 'Shimmering rainbow effect for premium cards',
    effects: ['Classic Holographic', 'Prismatic'],
    settings: {
      motionSpeed: 1.0,
      pulseIntensity: 1.0,
      shimmerSpeed: 4.0,
      goldIntensity: 1.0,
      chromeIntensity: 1.0,
      vintageIntensity: 1.0
    },
    thumbnail: '/placeholder.svg'
  }
];

export const usePresetsState = () => {
  const [userPresets, setUserPresets] = useState<EffectPreset[]>([]);
  const [builtInPresets, setBuiltInPresets] = useState<EffectPreset[]>(
    BUILT_IN_PRESETS.map(preset => ({ ...preset, isFavorite: false }))
  );

  const handleToggleFavorite = (presetId: string) => {
    // Handle both built-in and user presets
    if (presetId.startsWith('user-')) {
      setUserPresets(prev => 
        prev.map(preset => 
          preset.id === presetId 
            ? { ...preset, isFavorite: !preset.isFavorite } 
            : preset
        )
      );
    } else {
      setBuiltInPresets(prev => 
        prev.map(preset => 
          preset.id === presetId 
            ? { ...preset, isFavorite: !preset.isFavorite } 
            : preset
        )
      );
    }
  };

  const saveUserPreset = (name: string, effects: string[], settings: any) => {
    const newPreset: EffectPreset = {
      id: `user-${Date.now()}`,
      name,
      description: `Custom combination with ${effects.length} effects`,
      effects: [...effects],
      settings,
      thumbnail: '', // Could be a screenshot of the card with effects
      isFavorite: false
    };

    setUserPresets(prev => [newPreset, ...prev]);
    return newPreset;
  };

  return {
    userPresets,
    builtInPresets,
    handleToggleFavorite,
    saveUserPreset
  };
};
