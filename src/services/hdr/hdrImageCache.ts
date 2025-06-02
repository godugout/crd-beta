
import * as THREE from 'three';
import { CachedHDRImage, HDRStats, HDRResolution } from './types';
import { DeviceCapabilitiesService } from './deviceCapabilities';
import { HDRLoader } from './hdrLoader';
import { HDR_LOCAL_PATHS, HDR_FALLBACK_URLS, ENVIRONMENT_TYPE_MAP } from './hdrPaths';

export class HDRImageCacheService {
  private cache: Map<string, CachedHDRImage> = new Map();
  private preloadPromises: Map<string, Promise<THREE.DataTexture>> = new Map();
  private deviceService: DeviceCapabilitiesService;
  private hdrLoader: HDRLoader;

  constructor() {
    this.deviceService = new DeviceCapabilitiesService();
    this.hdrLoader = new HDRLoader();
  }

  /**
   * Preload all HDR images for faster environment switching
   */
  async preloadAll(): Promise<void> {
    console.log('HDRImageCache: Starting adaptive preload of all HDR images...');
    console.log(`HDRImageCache: Using optimal resolution: ${this.deviceService.getOptimalResolution()}`);
    
    const preloadPromises = Object.keys(HDR_LOCAL_PATHS).map(key => 
      this.preloadEnvironment(key).catch(error => {
        console.warn(`HDRImageCache: Failed to preload ${key}:`, error);
        return null;
      })
    );

    await Promise.allSettled(preloadPromises);
    console.log(`HDRImageCache: Adaptive preload complete. Cached ${this.cache.size} images.`);
  }

  /**
   * Preload a specific environment with adaptive resolution
   */
  async preloadEnvironment(environmentType: string): Promise<THREE.DataTexture | null> {
    const optimalResolution = this.deviceService.getOptimalResolution();
    const cacheKey = `${environmentType}_${optimalResolution}`;
    
    if (this.cache.has(cacheKey)) {
      console.log(`HDRImageCache: ${environmentType} (${optimalResolution}) already cached`);
      return this.cache.get(cacheKey)!.texture;
    }

    if (this.preloadPromises.has(cacheKey)) {
      console.log(`HDRImageCache: ${environmentType} (${optimalResolution}) already loading`);
      return this.preloadPromises.get(cacheKey)!;
    }

    const preloadPromise = this.hdrLoader.loadWithFallbacks(environmentType, optimalResolution);
    this.preloadPromises.set(cacheKey, preloadPromise);
    
    try {
      const texture = await preloadPromise;
      
      const cachedImage: CachedHDRImage = {
        texture,
        url: cacheKey,
        loadedAt: Date.now(),
        resolution: optimalResolution
      };
      
      this.cache.set(cacheKey, cachedImage);
      this.preloadPromises.delete(cacheKey);
      return texture;
    } catch (error) {
      this.preloadPromises.delete(cacheKey);
      throw error;
    }
  }

  /**
   * Get cached HDR texture or load it with adaptive resolution
   */
  async getTexture(environmentType: string): Promise<THREE.DataTexture | null> {
    const optimalResolution = this.deviceService.getOptimalResolution();
    const cacheKey = `${environmentType}_${optimalResolution}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      console.log(`HDRImageCache: Returning cached ${optimalResolution} texture for ${environmentType}`);
      return cached.texture;
    }

    console.log(`HDRImageCache: Loading ${optimalResolution} texture for ${environmentType}...`);
    return this.preloadEnvironment(environmentType);
  }

  /**
   * Get HDR URLs for environment type - returns array of fallback URLs
   */
  getUrlsForEnvironment(environmentType: string): string[] {
    const normalizedType = environmentType.toLowerCase();
    const mappedType = ENVIRONMENT_TYPE_MAP[normalizedType] || normalizedType;
    const optimalResolution = this.deviceService.getOptimalResolution();
    
    return HDR_FALLBACK_URLS[mappedType]?.[optimalResolution] || 
           HDR_FALLBACK_URLS.studio[optimalResolution] || 
           HDR_FALLBACK_URLS.studio['1k'];
  }

  /**
   * Get first HDR URL for environment type - returns single URL string
   */
  getUrlForEnvironment(environmentType: string): string {
    const urls = this.getUrlsForEnvironment(environmentType);
    return urls[0] || '';
  }

  /**
   * Get HDR file path for environment type
   */
  getPathForEnvironment(environmentType: string): string {
    const normalizedType = environmentType.toLowerCase();
    const mappedType = ENVIRONMENT_TYPE_MAP[normalizedType] || normalizedType;
    const optimalResolution = this.deviceService.getOptimalResolution();
    
    return HDR_LOCAL_PATHS[mappedType]?.[optimalResolution] || 
           HDR_LOCAL_PATHS.studio[optimalResolution] || 
           HDR_LOCAL_PATHS.studio['1k'];
  }

  /**
   * Clear old cache entries (older than 30 minutes)
   */
  clearOldEntries(): void {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000;

    for (const [url, cached] of this.cache.entries()) {
      if (now - cached.loadedAt > maxAge) {
        cached.texture.dispose();
        this.cache.delete(url);
        console.log(`HDRImageCache: Cleared old cache entry for ${url}`);
      }
    }
  }

  /**
   * Get cache statistics including resolution info
   */
  getStats(): HDRStats {
    const resolutionCounts = new Map<string, number>();
    for (const cached of this.cache.values()) {
      const count = resolutionCounts.get(cached.resolution) || 0;
      resolutionCounts.set(cached.resolution, count + 1);
    }

    return {
      cachedImages: this.cache.size,
      loadingImages: this.preloadPromises.size,
      cacheUrls: Array.from(this.cache.keys()),
      resolutionBreakdown: Object.fromEntries(resolutionCounts),
      optimalResolution: this.deviceService.getOptimalResolution(),
      deviceCapabilities: this.deviceService.getCapabilities()
    };
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    for (const cached of this.cache.values()) {
      cached.texture.dispose();
    }
    this.cache.clear();
    this.preloadPromises.clear();
    console.log('HDRImageCache: Cleared all cache');
  }
}
