/**
 * HDR Image Cache Service
 * Preloads and caches HDR panoramic images for faster environment loading
 */

import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

interface CachedHDRImage {
  texture: THREE.DataTexture;
  url: string;
  loadedAt: number;
}

class HDRImageCacheService {
  private cache: Map<string, CachedHDRImage> = new Map();
  private loader: RGBELoader;
  private preloadPromises: Map<string, Promise<THREE.DataTexture>> = new Map();

  constructor() {
    this.loader = new RGBELoader();
    this.loader.setDataType(THREE.FloatType);
  }

  /**
   * HDR URLs for different environments with fallbacks
   */
  private readonly HDR_URLS = {
    stadium: [
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/stadium_01_1k.hdr',
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/cape_hill_1k.hdr'
    ],
    gallery: [
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/museum_of_ethnography_1k.hdr',
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr'
    ],
    studio: [
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/photo_studio_01_1k.hdr',
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr'
    ],
    cosmic: [
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/milky_way_1k.hdr',
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/quarry_01_1k.hdr'
    ],
    underwater: [
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/underwater_01_1k.hdr',
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr'
    ],
    forest: [
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/forest_slope_1k.hdr',
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/abandoned_parking_1k.hdr'
    ],
    nightsky: [
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/night_1k.hdr',
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/evening_road_01_1k.hdr'
    ],
    luxury: [
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/royal_esplanade_1k.hdr',
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/hotel_room_1k.hdr'
    ],
    cyberpunk: [
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/neon_photostudio_1k.hdr',
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/urban_alley_01_1k.hdr'
    ],
    cardshop: [
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloppenheim_02_1k.hdr',
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_workshop_foundry_1k.hdr'
    ]
  };

  /**
   * Create a fallback procedural texture
   */
  private createFallbackTexture(environmentType: string): THREE.DataTexture {
    const size = 512;
    const data = new Float32Array(size * size * 4);
    
    const colors = {
      stadium: [0.2, 0.3, 0.5, 1.0],
      gallery: [0.9, 0.9, 0.95, 1.0],
      studio: [0.8, 0.8, 0.85, 1.0],
      cosmic: [0.02, 0.02, 0.1, 1.0],
      underwater: [0.1, 0.3, 0.5, 1.0],
      forest: [0.2, 0.4, 0.2, 1.0],
      nightsky: [0.05, 0.05, 0.15, 1.0],
      luxury: [0.4, 0.3, 0.2, 1.0],
      cyberpunk: [0.1, 0.05, 0.2, 1.0],
      cardshop: [0.3, 0.25, 0.2, 1.0]
    };

    const color = colors[environmentType as keyof typeof colors] || [0.5, 0.5, 0.5, 1.0];
    
    for (let i = 0; i < size * size; i++) {
      const index = i * 4;
      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = color[3];
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.needsUpdate = true;
    
    console.log(`HDRImageCache: Created fallback texture for ${environmentType}`);
    return texture;
  }

  /**
   * Try to load HDR with fallbacks
   */
  private async loadWithFallbacks(urls: string[], environmentType: string): Promise<THREE.DataTexture> {
    for (let i = 0; i < urls.length; i++) {
      try {
        console.log(`HDRImageCache: Attempting to load ${urls[i]} (attempt ${i + 1}/${urls.length})`);
        
        const texture = await new Promise<THREE.DataTexture>((resolve, reject) => {
          this.loader.load(
            urls[i],
            (texture) => {
              texture.mapping = THREE.EquirectangularReflectionMapping;
              console.log(`HDRImageCache: Successfully loaded ${urls[i]}`);
              resolve(texture);
            },
            (progress) => {
              console.log(`HDRImageCache: Loading progress for ${urls[i]}:`, progress);
            },
            (error) => {
              console.warn(`HDRImageCache: Failed to load ${urls[i]}:`, error);
              reject(error);
            }
          );
        });
        
        return texture;
      } catch (error) {
        console.warn(`HDRImageCache: Failed to load ${urls[i]}:`, error);
        if (i === urls.length - 1) {
          console.log(`HDRImageCache: All HDR URLs failed for ${environmentType}, using fallback`);
          return this.createFallbackTexture(environmentType);
        }
      }
    }
    
    return this.createFallbackTexture(environmentType);
  }

  /**
   * Preload all HDR images for faster environment switching
   */
  async preloadAll(): Promise<void> {
    console.log('HDRImageCache: Starting preload of all HDR images...');
    
    const preloadPromises = Object.entries(this.HDR_URLS).map(([key, urls]) => 
      this.preloadEnvironment(key, urls).catch(error => {
        console.warn(`HDRImageCache: Failed to preload ${key}:`, error);
        return null;
      })
    );

    await Promise.allSettled(preloadPromises);
    console.log(`HDRImageCache: Preload complete. Cached ${this.cache.size} images.`);
  }

  /**
   * Preload a specific environment with fallbacks
   */
  async preloadEnvironment(environmentType: string, urls: string[]): Promise<THREE.DataTexture | null> {
    const cacheKey = `${environmentType}_primary`;
    
    if (this.cache.has(cacheKey)) {
      console.log(`HDRImageCache: ${environmentType} already cached`);
      return this.cache.get(cacheKey)!.texture;
    }

    if (this.preloadPromises.has(cacheKey)) {
      console.log(`HDRImageCache: ${environmentType} already loading, waiting for completion`);
      return this.preloadPromises.get(cacheKey)!;
    }

    const preloadPromise = this.loadWithFallbacks(urls, environmentType);
    this.preloadPromises.set(cacheKey, preloadPromise);
    
    try {
      const texture = await preloadPromise;
      
      const cachedImage: CachedHDRImage = {
        texture,
        url: cacheKey,
        loadedAt: Date.now()
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
   * Get cached HDR texture or load it if not cached
   */
  async getTexture(environmentType: string): Promise<THREE.DataTexture | null> {
    const cacheKey = `${environmentType}_primary`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      console.log(`HDRImageCache: Returning cached texture for ${environmentType}`);
      return cached.texture;
    }

    console.log(`HDRImageCache: Texture not cached, loading ${environmentType}...`);
    const urls = this.getUrlsForEnvironment(environmentType);
    return this.preloadEnvironment(environmentType, urls);
  }

  /**
   * Get HDR URLs for environment type
   */
  getUrlsForEnvironment(environmentType: string): string[] {
    const normalizedType = environmentType.toLowerCase();
    
    // Handle aliases
    const typeMap: Record<string, string> = {
      'night': 'nightsky',
      'nature': 'forest',
      'space': 'cosmic',
      'ocean': 'underwater',
      'store': 'cardshop',
      'mall': 'cardshop',
      'retro': 'cardshop',
      'cyber': 'cyberpunk',
      'neon': 'cyberpunk',
      'lounge': 'luxury'
    };
    
    const mappedType = typeMap[normalizedType] || normalizedType;
    const key = mappedType as keyof typeof this.HDR_URLS;
    
    return this.HDR_URLS[key] || this.HDR_URLS.studio;
  }

  /**
   * Get HDR URL for environment type (for backwards compatibility)
   */
  getUrlForEnvironment(environmentType: string): string {
    const urls = this.getUrlsForEnvironment(environmentType);
    return urls[0];
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
   * Get cache statistics
   */
  getStats() {
    return {
      cachedImages: this.cache.size,
      loadingImages: this.preloadPromises.size,
      cacheUrls: Array.from(this.cache.keys())
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

// Export singleton instance
export const hdrImageCache = new HDRImageCacheService();

// Preload images when the module loads (with error handling)
hdrImageCache.preloadAll().catch(error => {
  console.warn('HDRImageCache: Initial preload failed:', error);
});

// Clear old entries every 10 minutes
setInterval(() => {
  hdrImageCache.clearOldEntries();
}, 10 * 60 * 1000);

export default hdrImageCache;
