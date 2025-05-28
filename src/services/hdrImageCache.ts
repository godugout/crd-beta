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
   * HDR URLs for different environments
   */
  private readonly HDR_URLS = {
    stadium: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/stadium_01_2k.hdr',
    gallery: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/museum_of_ethnography_2k.hdr',
    studio: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/photo_studio_01_2k.hdr',
    cosmic: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/space_01_2k.hdr',
    underwater: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/underwater_world_2k.hdr'
  };

  /**
   * Preload all HDR images for faster environment switching
   */
  async preloadAll(): Promise<void> {
    console.log('HDRImageCache: Starting preload of all HDR images...');
    
    const preloadPromises = Object.entries(this.HDR_URLS).map(([key, url]) => 
      this.preload(url).catch(error => {
        console.warn(`HDRImageCache: Failed to preload ${key}:`, error);
        return null;
      })
    );

    await Promise.allSettled(preloadPromises);
    console.log(`HDRImageCache: Preload complete. Cached ${this.cache.size} images.`);
  }

  /**
   * Preload a specific HDR image
   */
  async preload(url: string): Promise<THREE.DataTexture | null> {
    if (this.cache.has(url)) {
      console.log(`HDRImageCache: ${url} already cached`);
      return this.cache.get(url)!.texture;
    }

    if (this.preloadPromises.has(url)) {
      console.log(`HDRImageCache: ${url} already loading, waiting for completion`);
      return this.preloadPromises.get(url)!;
    }

    const preloadPromise = new Promise<THREE.DataTexture>((resolve, reject) => {
      console.log(`HDRImageCache: Loading ${url}...`);
      
      this.loader.load(
        url,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          
          const cachedImage: CachedHDRImage = {
            texture,
            url,
            loadedAt: Date.now()
          };
          
          this.cache.set(url, cachedImage);
          console.log(`HDRImageCache: Successfully cached ${url}`);
          resolve(texture);
        },
        (progress) => {
          console.log(`HDRImageCache: Loading progress for ${url}:`, progress);
        },
        (error) => {
          console.error(`HDRImageCache: Failed to load ${url}:`, error);
          reject(error);
        }
      );
    });

    this.preloadPromises.set(url, preloadPromise);
    
    try {
      const texture = await preloadPromise;
      this.preloadPromises.delete(url);
      return texture;
    } catch (error) {
      this.preloadPromises.delete(url);
      throw error;
    }
  }

  /**
   * Get cached HDR texture or load it if not cached
   */
  async getTexture(url: string): Promise<THREE.DataTexture | null> {
    const cached = this.cache.get(url);
    if (cached) {
      console.log(`HDRImageCache: Returning cached texture for ${url}`);
      return cached.texture;
    }

    console.log(`HDRImageCache: Texture not cached, loading ${url}...`);
    return this.preload(url);
  }

  /**
   * Get HDR URL for environment type
   */
  getUrlForEnvironment(environmentType: string): string {
    const key = environmentType.toLowerCase() as keyof typeof this.HDR_URLS;
    return this.HDR_URLS[key] || this.HDR_URLS.studio;
  }

  /**
   * Clear old cache entries (older than 30 minutes)
   */
  clearOldEntries(): void {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes

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

// Preload images when the module loads
hdrImageCache.preloadAll().catch(error => {
  console.warn('HDRImageCache: Initial preload failed:', error);
});

// Clear old entries every 10 minutes
setInterval(() => {
  hdrImageCache.clearOldEntries();
}, 10 * 60 * 1000);

export default hdrImageCache;
