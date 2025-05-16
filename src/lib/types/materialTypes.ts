
export interface MaterialSimulation {
  id: string;
  name: string;
  type: 'metal' | 'plastic' | 'paper' | 'glass' | 'fabric' | 'custom';
  textureUrl: string;
  baseColor: string;
  roughness: number;
  metallic: number;
  normalMap?: string;
  weathering: number;
  finishType: 'matte' | 'glossy' | 'satin' | 'textured';
  reflectivity: number;
  opacity: number;
  previewUrl?: string;
  description?: string;
}

export interface MaterialPreset {
  id: string;
  name: string;
  simulation: MaterialSimulation;
  tags: string[];
  isOfficial: boolean;
  popularity: number;
}

export interface MaterialLayer {
  id: string;
  name: string;
  simulation: MaterialSimulation;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  mask?: string;
}

export interface RenderSettings {
  lightPosition: { x: number; y: number; z: number };
  environmentMapUrl?: string;
  shadowIntensity: number;
  ambientLightColor: string;
  ambientLightIntensity: number;
  mainLightColor: string;
  mainLightIntensity: number;
  cameraDistance: number;
  cameraFOV: number;
}
