
export interface MaterialSimulation {
  textureUrl: string;
  baseColor: string;
  color: string;
  texture: string;
  type: string;
  weathering: number;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  ior?: number;
  transmission?: number;
  reflectivity?: number;
  emissive?: string;
  envMapIntensity?: number;
}
