
/**
 * PBR (Physically-Based Rendering) material settings
 */
export interface PbrSettings {
  roughness: number;  // Controls how rough/smooth the surface appears (0-1)
  metalness: number;  // Controls how metallic the material appears (0-1)
  exposure: number;   // Controls the overall brightness of the scene
  envMapIntensity: number;  // Controls the intensity of environment reflections
  reflectionStrength: number;  // Controls how reflective the surface is
}

/**
 * Material presets for different card finishes
 */
export enum MaterialPreset {
  GLOSSY = 'glossy',
  MATTE = 'matte',
  FOIL = 'foil',
  CHROME = 'chrome',
  HOLOGRAPHIC = 'holographic',
  REFRACTOR = 'refractor',
  TEXTURED = 'textured'
}

/**
 * Option interface for material presets
 */
export interface MaterialPresetOption {
  label: string;
  value: MaterialPreset;
  settings: PbrSettings;
}

/**
 * Scene options for the PBR renderer
 */
export interface PbrSceneOptions {
  cleanup: () => void;
}

/**
 * Material property extension for Card type
 */
export interface CardMaterialProperties {
  preset: MaterialPreset;
  customSettings?: PbrSettings;
}
