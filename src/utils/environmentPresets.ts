
// Define valid environment presets for three.js/react-three-fiber
const VALID_ENVIRONMENT_PRESETS = [
  'sunset', 
  'dawn', 
  'night', 
  'warehouse', 
  'forest', 
  'apartment', 
  'studio', 
  'city', 
  'park', 
  'lobby'
];

/**
 * Maps a string preset name to a valid environment preset
 * @param preset Preset name to validate
 * @returns Valid environment preset name
 */
export const getEnvironmentPreset = (preset: string): string => {
  // Default to 'studio' for best lighting
  const defaultPreset = 'studio';
  
  if (!preset || typeof preset !== 'string') {
    return defaultPreset;
  }
  
  // Check if the preset is valid
  const normalizedPreset = preset.toLowerCase().trim();
  
  if (VALID_ENVIRONMENT_PRESETS.includes(normalizedPreset)) {
    return normalizedPreset;
  }
  
  // Map similar names to valid presets
  const presetMap: Record<string, string> = {
    'day': 'dawn',
    'evening': 'sunset',
    'dark': 'night',
    'indoor': 'apartment',
    'outdoors': 'park',
    'nature': 'forest',
    'urban': 'city',
    'professional': 'studio'
  };
  
  return presetMap[normalizedPreset] || defaultPreset;
};

/**
 * Gets a list of all available environment presets
 */
export const getAllEnvironmentPresets = (): string[] => {
  return [...VALID_ENVIRONMENT_PRESETS];
};

/**
 * Gets the appropriate intensity for an effect based on environment
 */
export const getEffectIntensityForEnvironment = (
  effect: string,
  environment: string,
  baseIntensity = 0.7
): number => {
  // Adjust intensities based on environment lighting
  const intensityFactors: Record<string, Record<string, number>> = {
    'holographic': {
      'night': 1.2,
      'studio': 1.0,
      'sunset': 0.9,
      'dawn': 0.8,
      'day': 0.7
    },
    'refractor': {
      'night': 1.3,
      'studio': 1.0,
      'sunset': 0.85,
      'dawn': 0.8,
      'day': 0.7
    }
  };
  
  const normalizedEffect = effect.toLowerCase();
  const normalizedEnvironment = environment.toLowerCase();
  
  // Get the effect-specific modifiers or default to 1.0
  const effectFactors = intensityFactors[normalizedEffect] || {};
  const intensityFactor = effectFactors[normalizedEnvironment] || 1.0;
  
  return baseIntensity * intensityFactor;
};
