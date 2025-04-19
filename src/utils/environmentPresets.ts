
// Valid environment presets supported by @react-three/drei
export type ValidEnvironmentPreset = 
  | 'sunset'
  | 'dawn'
  | 'night'
  | 'warehouse'
  | 'forest'
  | 'apartment'
  | 'studio'
  | 'city'
  | 'park'
  | 'lobby';

// Define lighting preset options for UI
export const lightingPresets = [
  { value: 'studio', label: 'Studio' },
  { value: 'natural', label: 'Natural Light' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'display_case', label: 'Display Case' }
];

// Map our custom lighting presets to valid drei environment presets
export const mapLightingPresetToEnvironment = (preset: string): ValidEnvironmentPreset => {
  switch (preset) {
    case 'natural':
      return 'forest';
    case 'dramatic':
      return 'night';
    case 'display_case':
      return 'lobby';
    case 'studio':
    default:
      return 'studio';
  }
};

// Get the appropriate environment preset with type safety
export const getEnvironmentPreset = (
  preset: string = 'studio'
): ValidEnvironmentPreset => {
  return mapLightingPresetToEnvironment(preset);
};
