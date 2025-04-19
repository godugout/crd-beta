
// Valid environment presets for the @react-three/drei Environment component
export type ValidEnvironmentPreset = 
  | 'sunset' | 'dawn' | 'night' | 'warehouse' 
  | 'forest' | 'apartment' | 'studio' | 'city' 
  | 'park' | 'lobby';

// Maps custom lighting presets to valid @react-three/drei environment presets
export const mapLightingPresetToEnvironment = (preset: string): string => {
  // Use console to debug which presets are being applied
  console.log("Mapping lighting/scene preset:", preset);
  
  switch (preset) {
    case 'studio':
      return 'studio';
    case 'natural':
      return 'park';
    case 'dramatic':
      return 'night';
    case 'display_case':
      return 'lobby';
    default:
      console.warn(`Unknown preset "${preset}" - falling back to "studio"`);
      return 'studio';
  }
};

// Custom lighting preset configurations
export const lightingPresets = {
  studio: {
    primaryLight: { intensity: 1.0, x: 10, y: 10, z: 10, color: '#ffffff' },
    ambientLight: { intensity: 0.7 },
    envMapIntensity: 1.0,
    environmentType: 'studio',
    useDynamicLighting: true,
    autoRotate: false
  },
  natural: {
    primaryLight: { intensity: 1.2, x: 5, y: 15, z: 5, color: '#f8e3cb' },
    ambientLight: { intensity: 0.5 },
    envMapIntensity: 0.8,
    environmentType: 'natural',
    useDynamicLighting: true,
    autoRotate: false
  },
  dramatic: {
    primaryLight: { intensity: 1.5, x: 3, y: 10, z: 10, color: '#89a0e0' },
    ambientLight: { intensity: 0.3 },
    envMapIntensity: 0.6,
    environmentType: 'dramatic',
    useDynamicLighting: true,
    autoRotate: false
  },
  display_case: {
    primaryLight: { intensity: 0.8, x: 0, y: 10, z: 0, color: '#ffffff' },
    ambientLight: { intensity: 0.6 },
    envMapIntensity: 1.2,
    environmentType: 'display_case',
    useDynamicLighting: false,
    autoRotate: true
  }
};
