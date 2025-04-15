
export interface PbrSettings {
  roughness: number;
  metalness: number;
  exposure: number;
  envMapIntensity: number;
  reflectionStrength: number;
}

export interface PbrSceneOptions {
  cleanup: () => void;
}
