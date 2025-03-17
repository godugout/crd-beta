
export interface PbrSettings {
  roughness: number;
  metalness: number;
  exposure: number;
  envMapIntensity: number;
  reflectionStrength: number;
}

export interface ShaderMaterial {
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, any>;
}

export interface PbrSceneOptions {
  cleanup: () => void;
}
