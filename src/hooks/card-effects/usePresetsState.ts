
import { useState, useCallback, useEffect } from 'react';
import { EffectSettings } from './types';

interface EffectPreset {
  id: string;
  name: string;
  description: string;
  effects: string[];
  settings: Partial<EffectSettings>;
  isFavorite?: boolean;
  isBuiltIn?: boolean;
  imageUrl?: string;
}

// Built-in presets for card effects
const BUILT_IN_PRESETS: EffectPreset[] = [
  {
    id: 'classic-holographic',
    name: 'Classic Holographic',
    description: 'Traditional rainbow holographic pattern',
    effects: ['Holographic'],
    settings: {
      motionSpeed: 1.0,
      shimmerSpeed: 1.2,
      refractorIntensity: 0.7
    },
    isBuiltIn: true,
    imageUrl: '/assets/effects/holographic-preset.jpg'
  },
  {
    id: 'premium-chrome',
    name: 'Premium Chrome',
    description: 'High-end chrome finish with reflective surface',
    effects: ['Chrome'],
    settings: {
      chromeIntensity: 1.0,
      refractorIntensity: 0.5
    },
    isBuiltIn: true,
    imageUrl: '/assets/effects/chrome-preset.jpg'
  },
  {
    id: 'vintage-heritage',
    name: 'Vintage Heritage',
    description: 'Classic aged look with subtle texturing',
    effects: ['Vintage'],
    settings: {
      vintageIntensity: 0.8,
      shimmerSpeed: 0.3
    },
    isBuiltIn: true,
    imageUrl: '/assets/effects/vintage-preset.jpg'
  },
  {
    id: 'spectral-prism',
    name: 'Spectral Prism',
    description: 'Advanced holographic effect with prismatic light refraction',
    effects: ['Spectral'],
    settings: {
      spectralIntensity: 0.9,
      motionSpeed: 1.2,
      shimmerSpeed: 1.5
    },
    isBuiltIn: true,
    imageUrl: '/assets/effects/spectral-preset.jpg'
  },
  {
    id: 'golden-signature',
    name: 'Golden Signature',
    description: 'Premium gold foil effect',
    effects: ['Gold Foil'],
    settings: {
      goldIntensity: 0.9,
      refractorIntensity: 0.3
    },
    isBuiltIn: true,
    imageUrl: '/assets/effects/gold-preset.jpg'
  }
];

const LOCAL_STORAGE_KEY = 'cardshow-effect-presets';

export function usePresetsState() {
  // User custom presets
  const [userPresets, setUserPresets] = useState<EffectPreset[]>([]);
  
  // Built-in presets with favorite status
  const [builtInPresets, setBuiltInPresets] = useState<EffectPreset[]>(BUILT_IN_PRESETS);

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Load user presets
        if (Array.isArray(parsed.userPresets)) {
          setUserPresets(parsed.userPresets);
        }
        
        // Apply favorite status to built-in presets
        if (Array.isArray(parsed.favoritePresets)) {
          setBuiltInPresets(prev => 
            prev.map(preset => ({
              ...preset,
              isFavorite: parsed.favoritePresets.includes(preset.id)
            }))
          );
        }
      }
    } catch (error) {
      console.error('Failed to load presets from localStorage', error);
    }
  }, []);

  // Save presets to localStorage when they change
  useEffect(() => {
    try {
      const favoritePresets = builtInPresets
        .filter(preset => preset.isFavorite)
        .map(preset => preset.id);
        
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        userPresets,
        favoritePresets
      }));
    } catch (error) {
      console.error('Failed to save presets to localStorage', error);
    }
  }, [userPresets, builtInPresets]);

  // Toggle favorite status for a preset
  const handleToggleFavorite = useCallback((presetId: string) => {
    // For built-in presets
    setBuiltInPresets(prev => 
      prev.map(preset => 
        preset.id === presetId
          ? { ...preset, isFavorite: !preset.isFavorite }
          : preset
      )
    );
    
    // For user presets
    setUserPresets(prev => 
      prev.map(preset => 
        preset.id === presetId
          ? { ...preset, isFavorite: !preset.isFavorite }
          : preset
      )
    );
  }, []);

  // Add a new user preset
  const saveUserPreset = useCallback((name: string, effects: string[], settings: Partial<EffectSettings>) => {
    const newPreset: EffectPreset = {
      id: `user-${Date.now()}`,
      name,
      description: `Custom preset created on ${new Date().toLocaleDateString()}`,
      effects,
      settings,
      isFavorite: false
    };
    
    setUserPresets(prev => [...prev, newPreset]);
    return newPreset;
  }, []);

  // Delete a user preset
  const deleteUserPreset = useCallback((presetId: string) => {
    setUserPresets(prev => prev.filter(preset => preset.id !== presetId));
  }, []);

  return {
    userPresets,
    builtInPresets,
    handleToggleFavorite,
    saveUserPreset,
    deleteUserPreset
  };
}

export default usePresetsState;
