
import * as THREE from 'three';

export interface CachedHDRImage {
  texture: THREE.DataTexture;
  url: string;
  loadedAt: number;
  resolution: string;
}

export interface DeviceCapabilities {
  maxTextureSize: number;
  supportsHighRes: boolean;
  isHighDPI: boolean;
  screenSize: 'small' | 'medium' | 'large' | 'xlarge';
}

export type HDRResolution = '1k' | '2k' | '4k' | '8k';

export type EnvironmentType = 
  | 'studio' | 'gallery' | 'stadium' | 'twilight' | 'quarry' 
  | 'coastline' | 'hillside' | 'milkyway' | 'esplanade' 
  | 'neonclub' | 'industrial';

export interface HDRPaths {
  [key: string]: {
    [resolution in HDRResolution]: string;
  };
}

export interface HDRStats {
  cachedImages: number;
  loadingImages: number;
  cacheUrls: string[];
  resolutionBreakdown: Record<string, number>;
  optimalResolution: string;
  deviceCapabilities: DeviceCapabilities | null;
}
