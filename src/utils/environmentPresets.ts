
// Define valid environment presets
export type ValidEnvironmentPreset = 
  'studio' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 
  'apartment' | 'city' | 'park' | 'lobby' | 'natural' | 'dramatic' | 'display_case';

// Environment preset configurations
export interface EnvironmentPresetConfig {
  name: string;
  background: boolean;
  blur?: number;
  intensity?: number;
  path?: string;
  files?: string;
}

// Mapping between lighting presets and environment types
export const mapLightingPresetToEnvironment = (preset: ValidEnvironmentPreset): string => {
  switch (preset) {
    case 'studio': return 'studio';
    case 'natural': return 'park';
    case 'dramatic': return 'night';
    case 'display_case': return 'lobby';
    case 'sunset': return 'sunset';
    case 'dawn': return 'dawn';
    case 'night': return 'night';
    case 'warehouse': return 'warehouse';
    case 'forest': return 'forest';
    case 'apartment': return 'apartment';
    case 'city': return 'city';
    case 'park': return 'park';
    case 'lobby': return 'lobby';
    default: return 'studio';
  }
};

// Environment preset settings
export const lightingPresets: Record<ValidEnvironmentPreset, EnvironmentPresetConfig> = {
  studio: {
    name: 'Studio',
    background: false,
    blur: 0.5,
    intensity: 1.0
  },
  sunset: {
    name: 'Sunset',
    background: true,
    blur: 0.3,
    intensity: 1.2
  },
  dawn: {
    name: 'Dawn',
    background: true,
    blur: 0.4,
    intensity: 0.8
  },
  night: {
    name: 'Night',
    background: true,
    blur: 0.6,
    intensity: 0.7
  },
  warehouse: {
    name: 'Warehouse',
    background: false,
    blur: 0.2,
    intensity: 0.9
  },
  forest: {
    name: 'Forest',
    background: true,
    blur: 0.4,
    intensity: 0.8
  },
  apartment: {
    name: 'Apartment',
    background: false,
    blur: 0.3,
    intensity: 1.1
  },
  city: {
    name: 'City',
    background: true,
    blur: 0.5,
    intensity: 1.2
  },
  park: {
    name: 'Park',
    background: true,
    blur: 0.3,
    intensity: 1.0
  },
  lobby: {
    name: 'Lobby',
    background: false,
    blur: 0.4,
    intensity: 1.1
  },
  natural: {
    name: 'Natural',
    background: true,
    blur: 0.4,
    intensity: 1.0
  },
  dramatic: {
    name: 'Dramatic',
    background: true,
    blur: 0.6,
    intensity: 1.3
  },
  display_case: {
    name: 'Display Case',
    background: false,
    blur: 0.3,
    intensity: 1.2
  }
};

// Get environment map by ID
export const getEnvironmentPreset = (id: ValidEnvironmentPreset): EnvironmentPresetConfig => {
  return lightingPresets[id] || lightingPresets.studio;
};

// Get environment path based on preset
export const getEnvironmentPath = (preset: ValidEnvironmentPreset): string => {
  const envPath = `/environments/${mapLightingPresetToEnvironment(preset)}.hdr`;
  return envPath;
};
