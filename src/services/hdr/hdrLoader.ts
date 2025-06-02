
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { HDRResolution } from './types';
import { HDR_LOCAL_PATHS, HDR_FALLBACK_URLS } from './hdrPaths';
import { TextureUtils } from './textureUtils';

export class HDRLoader {
  private loader: RGBELoader;

  constructor() {
    this.loader = new RGBELoader();
    this.loader.setDataType(THREE.FloatType);
  }

  /**
   * Try to load HDR with adaptive resolution and fallbacks
   */
  async loadWithFallbacks(environmentType: string, optimalResolution: HDRResolution): Promise<THREE.DataTexture> {
    const resolutionFallbacks: Array<HDRResolution> = [optimalResolution];
    
    // Add fallback resolutions
    if (optimalResolution !== '1k') resolutionFallbacks.push('1k');
    if (optimalResolution === '8k') resolutionFallbacks.splice(1, 0, '4k', '2k');
    if (optimalResolution === '4k') resolutionFallbacks.splice(1, 0, '2k');
    
    console.log(`HDRImageCache: Loading ${environmentType} with resolution priority: [${resolutionFallbacks.join(', ')}]`);
    
    // Try local files first with resolution fallbacks
    for (const resolution of resolutionFallbacks) {
      const localPath = HDR_LOCAL_PATHS[environmentType]?.[resolution];
      if (localPath) {
        try {
          console.log(`HDRImageCache: Attempting local ${resolution} HDR: ${localPath}`);
          
          const texture = await this.loadHDRTexture(localPath);
          console.log(`HDRImageCache: Successfully loaded local ${resolution} HDR: ${localPath}`);
          return texture;
        } catch (error) {
          console.warn(`HDRImageCache: Local ${resolution} HDR failed for ${environmentType}:`, error);
        }
      }
    }
    
    // Try remote fallbacks with resolution priority
    for (const resolution of resolutionFallbacks) {
      const fallbackUrls = HDR_FALLBACK_URLS[environmentType]?.[resolution] || [];
      
      for (const url of fallbackUrls) {
        try {
          console.log(`HDRImageCache: Attempting ${resolution} fallback: ${url}`);
          
          const texture = await this.loadHDRTexture(url);
          console.log(`HDRImageCache: Successfully loaded ${resolution} fallback: ${url}`);
          return texture;
        } catch (error) {
          console.warn(`HDRImageCache: ${resolution} fallback failed for ${environmentType}:`, error);
        }
      }
    }
    
    console.log(`HDRImageCache: All HDR sources failed for ${environmentType}, using enhanced procedural fallback`);
    return TextureUtils.createFallbackTexture(environmentType, optimalResolution);
  }

  private loadHDRTexture(url: string): Promise<THREE.DataTexture> {
    return new Promise<THREE.DataTexture>((resolve, reject) => {
      this.loader.load(
        url,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          TextureUtils.applyEnhancedFiltering(texture);
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }
}
