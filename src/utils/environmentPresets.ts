
/**
 * Define valid environment presets for TypeScript
 */
export type ValidEnvironmentPreset = 
  "apartment" | "city" | "dawn" | "forest" | "lobby" | 
  "night" | "park" | "studio" | "sunset" | "warehouse";

/**
 * Gets a list of all valid environment presets
 */
export const getValidEnvironmentPresets = (): ValidEnvironmentPreset[] => {
  return [
    "apartment", 
    "city", 
    "dawn", 
    "forest", 
    "lobby", 
    "night", 
    "park", 
    "studio", 
    "sunset", 
    "warehouse"
  ];
};

/**
 * Maps our custom lighting presets to valid @react-three/drei environment presets
 */
export const mapLightingPresetToEnvironment = (
  preset: string
): ValidEnvironmentPreset => {
  const validPresets: Record<string, ValidEnvironmentPreset> = {
    studio: "studio",
    natural: "park",
    dramatic: "night", 
    display_case: "lobby",
    bright: "city",
    dim: "apartment",
    outdoor: "dawn",
    indoor: "warehouse",
    sunset: "sunset",
    default: "studio"
  };
  
  // First, check if the preset is already a valid @react-three/drei preset
  if (getValidEnvironmentPresets().includes(preset as ValidEnvironmentPreset)) {
    return preset as ValidEnvironmentPreset;
  }
  
  // Return the mapped preset or default to studio
  return validPresets[preset] || "studio";
};
