
export interface PbrSettings {
  roughness: number;
  metalness: number;
  exposure: number;
  envMapIntensity: number;
  reflectionStrength: number;
  holographicEffect: number; // Added for holographic effect intensity
  chromeEffect: number;     // Added for chrome effect intensity
  vintageEffect: number;    // Added for vintage effect intensity
}

export interface PbrSceneOptions {
  cleanup: () => void;
}
