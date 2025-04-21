
export type ValidEnvironmentPreset = 
  | 'studio' 
  | 'natural' 
  | 'dramatic' 
  | 'display_case' 
  | 'sunset' 
  | 'dawn' 
  | 'night'
  | 'warehouse'
  | 'apartment'
  | 'lobby'
  | 'forest'
  | 'park'
  | 'city';

interface EnvironmentPreset {
  name: string;
  intensity: number;
  path?: string;
  description?: string;
}

export const lightingPresets: Record<ValidEnvironmentPreset, EnvironmentPreset> = {
  studio: {
    name: 'Studio',
    intensity: 1.0,
    path: '/environments/studio.hdr',
    description: 'Clean, bright lighting for product showcase'
  },
  natural: {
    name: 'Natural',
    intensity: 0.8,
    path: '/environments/natural.hdr',
    description: 'Outdoor daylight environment'
  },
  dramatic: {
    name: 'Dramatic',
    intensity: 1.5,
    path: '/environments/dramatic.hdr',
    description: 'High contrast lighting for dramatic effect'
  },
  display_case: {
    name: 'Display Case',
    intensity: 0.9,
    path: '/environments/display_case.hdr',
    description: 'Museum-like display lighting'
  },
  sunset: {
    name: 'Sunset',
    intensity: 0.7,
    path: '/environments/sunset.hdr',
    description: 'Warm sunset lighting'
  },
  dawn: {
    name: 'Dawn',
    intensity: 0.6,
    path: '/environments/dawn.hdr',
    description: 'Cool morning lighting'
  },
  night: {
    name: 'Night',
    intensity: 0.4,
    path: '/environments/night.hdr',
    description: 'Dark night setting with limited ambient light'
  },
  // Adding missing environment presets
  warehouse: {
    name: 'Warehouse',
    intensity: 0.8,
    path: '/environments/display_case.hdr',
    description: 'Industrial warehouse lighting'
  },
  apartment: {
    name: 'Apartment',
    intensity: 0.65,
    path: '/environments/display_case.hdr',
    description: 'Cozy home lighting'
  },
  lobby: {
    name: 'Lobby',
    intensity: 1.2,
    path: '/environments/display_case.hdr',
    description: 'Business lobby lighting'
  },
  forest: {
    name: 'Forest',
    intensity: 0.6,
    path: '/environments/natural.hdr',
    description: 'Dappled forest lighting'
  },
  park: {
    name: 'Park',
    intensity: 0.75,
    path: '/environments/natural.hdr',
    description: 'Open park lighting'
  },
  city: {
    name: 'City',
    intensity: 0.9,
    path: '/environments/natural.hdr',
    description: 'Urban city lighting'
  }
};

export const getEnvironmentPath = (preset: ValidEnvironmentPreset): string => {
  return lightingPresets[preset]?.path || '/environments/studio.hdr';
};

export const getEnvironmentIntensity = (preset: ValidEnvironmentPreset): number => {
  return lightingPresets[preset]?.intensity || 1.0;
};

export default lightingPresets;
