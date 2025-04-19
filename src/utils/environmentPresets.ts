
/**
 * Maps our custom lighting presets to valid @react-three/drei environment presets
 */
export const mapLightingPresetToEnvironment = (
  preset: string
): string => {
  const validPresets = {
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
  } as const;
  
  // First, check if the preset is already a valid @react-three/drei preset
  if (getValidEnvironmentPresets().includes(preset)) {
    return preset;
  }
  
  // Ensure we always return a valid preset
  return (validPresets[preset as keyof typeof validPresets] || "studio");
};

/**
 * Gets a list of all valid environment presets
 */
export const getValidEnvironmentPresets = (): string[] => {
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
 * Type-safe environment presets for TypeScript
 */
export type ValidEnvironmentPreset = 
  "apartment" | "city" | "dawn" | "forest" | "lobby" | 
  "night" | "park" | "studio" | "sunset" | "warehouse";
