/**
 * HDR Image Cache Service
 * Preloads and caches HDR panoramic images for faster environment loading
 * Now supports adaptive resolution based on screen size and device capabilities
 */

import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

interface CachedHDRImage {
  texture: THREE.DataTexture;
  url: string;
  loadedAt: number;
  resolution: string;
}

interface DeviceCapabilities {
  maxTextureSize: number;
  supportsHighRes: boolean;
  isHighDPI: boolean;
  screenSize: 'small' | 'medium' | 'large' | 'xlarge';
}

class HDRImageCacheService {
  private cache: Map<string, CachedHDRImage> = new Map();
  private loader: RGBELoader;
  private preloadPromises: Map<string, Promise<THREE.DataTexture>> = new Map();
  private deviceCapabilities: DeviceCapabilities | null = null;

  constructor() {
    this.loader = new RGBELoader();
    this.loader.setDataType(THREE.FloatType);
    this.detectDeviceCapabilities();
  }

  /**
   * Detect device capabilities for adaptive HDR loading
   */
  private detectDeviceCapabilities(): void {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      this.deviceCapabilities = {
        maxTextureSize: 1024,
        supportsHighRes: false,
        isHighDPI: window.devicePixelRatio > 1,
        screenSize: 'small'
      };
      return;
    }

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const screenWidth = window.innerWidth * window.devicePixelRatio;
    
    let screenSize: 'small' | 'medium' | 'large' | 'xlarge' = 'small';
    if (screenWidth >= 3840) screenSize = 'xlarge';      // 4K+
    else if (screenWidth >= 2560) screenSize = 'large';   // 1440p+
    else if (screenWidth >= 1920) screenSize = 'medium';  // 1080p+
    
    this.deviceCapabilities = {
      maxTextureSize,
      supportsHighRes: maxTextureSize >= 4096 && screenWidth >= 1920,
      isHighDPI: window.devicePixelRatio > 1,
      screenSize
    };

    console.log('HDRImageCache: Device capabilities detected:', this.deviceCapabilities);
  }

  /**
   * Get optimal HDR resolution based on device capabilities
   */
  private getOptimalResolution(): '1k' | '2k' | '4k' | '8k' {
    if (!this.deviceCapabilities) return '1k';
    
    const { screenSize, supportsHighRes, maxTextureSize } = this.deviceCapabilities;
    
    // Conservative approach - prioritize performance
    if (screenSize === 'xlarge' && maxTextureSize >= 8192 && supportsHighRes) {
      return '4k'; // Use 4k for 4K+ screens (8k might be too intensive)
    } else if (screenSize === 'large' && maxTextureSize >= 4096 && supportsHighRes) {
      return '4k';
    } else if (screenSize === 'medium' && maxTextureSize >= 2048) {
      return '2k';
    } else {
      return '1k';
    }
  }

  /**
   * HDR file paths for different environments with multiple resolutions
   */
  private readonly HDR_PATHS = {
    studio: {
      '1k': '/environments/scenes/photo_studio_1k.hdr',
      '2k': '/environments/scenes/photo_studio_2k.hdr',
      '4k': '/environments/scenes/photo_studio_4k.hdr',
      '8k': '/environments/scenes/photo_studio_8k.hdr'
    },
    gallery: {
      '1k': '/environments/scenes/art_gallery_1k.hdr',
      '2k': '/environments/scenes/art_gallery_2k.hdr', 
      '4k': '/environments/scenes/art_gallery_4k.hdr',
      '8k': '/environments/scenes/art_gallery_8k.hdr'
    },
    stadium: {
      '1k': '/environments/scenes/sports_stadium_1k.hdr',
      '2k': '/environments/scenes/sports_stadium_2k.hdr',
      '4k': '/environments/scenes/sports_stadium_4k.hdr',
      '8k': '/environments/scenes/sports_stadium_8k.hdr'
    },
    twilight: {
      '1k': '/environments/scenes/twilight_road_1k.hdr',
      '2k': '/environments/scenes/twilight_road_2k.hdr',
      '4k': '/environments/scenes/twilight_road_4k.hdr',
      '8k': '/environments/scenes/twilight_road_8k.hdr'
    },
    quarry: {
      '1k': '/environments/scenes/stone_quarry_1k.hdr',
      '2k': '/environments/scenes/stone_quarry_2k.hdr',
      '4k': '/environments/scenes/stone_quarry_4k.hdr',
      '8k': '/environments/scenes/stone_quarry_8k.hdr'
    },
    coastline: {
      '1k': '/environments/scenes/ocean_coastline_1k.hdr',
      '2k': '/environments/scenes/ocean_coastline_2k.hdr',
      '4k': '/environments/scenes/ocean_coastline_4k.hdr',
      '8k': '/environments/scenes/ocean_coastline_8k.hdr'
    },
    hillside: {
      '1k': '/environments/scenes/forest_hillside_1k.hdr',
      '2k': '/environments/scenes/forest_hillside_2k.hdr',
      '4k': '/environments/scenes/forest_hillside_4k.hdr',
      '8k': '/environments/scenes/forest_hillside_8k.hdr'
    },
    milkyway: {
      '1k': '/environments/scenes/starry_night_1k.hdr',
      '2k': '/environments/scenes/starry_night_2k.hdr',
      '4k': '/environments/scenes/starry_night_4k.hdr',
      '8k': '/environments/scenes/starry_night_8k.hdr'
    },
    esplanade: {
      '1k': '/environments/scenes/royal_esplanade_1k.hdr',
      '2k': '/environments/scenes/royal_esplanade_2k.hdr',
      '4k': '/environments/scenes/royal_esplanade_4k.hdr',
      '8k': '/environments/scenes/royal_esplanade_8k.hdr'
    },
    neonclub: {
      '1k': '/environments/scenes/cyberpunk_neon_1k.hdr',
      '2k': '/environments/scenes/cyberpunk_neon_2k.hdr',
      '4k': '/environments/scenes/cyberpunk_neon_4k.hdr',
      '8k': '/environments/scenes/cyberpunk_neon_8k.hdr'
    },
    industrial: {
      '1k': '/environments/scenes/industrial_workshop_1k.hdr',
      '2k': '/environments/scenes/industrial_workshop_2k.hdr',
      '4k': '/environments/scenes/industrial_workshop_4k.hdr',
      '8k': '/environments/scenes/industrial_workshop_8k.hdr'
    }
  };

  /**
   * Fallback URLs from Polyhaven with higher resolutions
   */
  private readonly FALLBACK_URLS = {
    studio: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/photo_studio_01_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/photo_studio_01_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/photo_studio_01_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/photo_studio_01_8k.hdr']
    },
    gallery: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/museum_of_ethnography_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/museum_of_ethnography_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/museum_of_ethnography_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/museum_of_ethnography_8k.hdr']
    },
    stadium: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/cape_hill_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/cape_hill_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/cape_hill_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/cape_hill_8k.hdr']
    },
    twilight: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/evening_road_01_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/evening_road_01_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/evening_road_01_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/evening_road_01_8k.hdr']
    },
    quarry: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/quarry_01_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/quarry_01_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/quarry_01_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/quarry_01_8k.hdr']
    },
    coastline: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/venice_sunset_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/venice_sunset_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/venice_sunset_8k.hdr']
    },
    hillside: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/forest_slope_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/forest_slope_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/forest_slope_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/forest_slope_8k.hdr']
    },
    milkyway: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/starry_night_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/starry_night_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/starry_night_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/starry_night_8k.hdr']
    },
    esplanade: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/royal_esplanade_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/royal_esplanade_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/royal_esplanade_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/royal_esplanade_8k.hdr']
    },
    neonclub: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/neon_photostudio_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/neon_photostudio_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/neon_photostudio_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/neon_photostudio_8k.hdr']
    },
    industrial: {
      '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_workshop_foundry_1k.hdr'],
      '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/industrial_workshop_foundry_2k.hdr'],
      '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/industrial_workshop_foundry_4k.hdr'],
      '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/industrial_workshop_foundry_8k.hdr']
    }
  };

  /**
   * Create a higher quality fallback procedural texture
   */
  private createFallbackTexture(environmentType: string): THREE.DataTexture {
    const optimalRes = this.getOptimalResolution();
    const sizeMap = { '1k': 512, '2k': 1024, '4k': 2048, '8k': 4096 };
    const size = sizeMap[optimalRes];
    
    const data = new Float32Array(size * size * 4);
    
    if (environmentType === 'milkyway') {
      // Enhanced starry night sky with higher detail
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const index = (i * size + j) * 4;
          
          // Base dark blue night sky with subtle gradient
          const gradient = Math.sin((i / size) * Math.PI) * 0.1;
          data[index] = 0.02 + gradient * 0.01;
          data[index + 1] = 0.02 + gradient * 0.02;
          data[index + 2] = 0.15 + gradient * 0.05;
          data[index + 3] = 1.0;
          
          // More detailed star field
          const starChance = optimalRes === '4k' || optimalRes === '8k' ? 0.9995 : 0.998;
          if (Math.random() > starChance) {
            const brightness = 0.6 + Math.random() * 0.4;
            const twinkle = Math.sin(Date.now() * 0.001 + i * j) * 0.1 + 0.9;
            data[index] = brightness * twinkle;
            data[index + 1] = brightness * twinkle;
            data[index + 2] = brightness * twinkle;
          }
          
          // Enhanced milky way streak with more detail
          const distanceFromCenter = Math.abs(i - size / 2) / (size / 2);
          if (distanceFromCenter < 0.4) {
            const intensity = (0.4 - distanceFromCenter) / 0.4;
            const noise = Math.sin(j * 0.1) * Math.cos(i * 0.1) * 0.05;
            const milkyIntensity = intensity * 0.15 + noise;
            data[index] += milkyIntensity * 0.8;
            data[index + 1] += milkyIntensity * 0.9;
            data[index + 2] += milkyIntensity * 1.0;
          }
        }
      }
    } else {
      // Enhanced procedural textures for other environments
      const colors = {
        stadium: [0.2, 0.3, 0.5, 1.0],
        gallery: [0.9, 0.9, 0.95, 1.0],
        studio: [0.8, 0.8, 0.85, 1.0],
        twilight: [0.15, 0.1, 0.2, 1.0],
        quarry: [0.4, 0.35, 0.3, 1.0],
        coastline: [0.2, 0.4, 0.6, 1.0],
        hillside: [0.2, 0.4, 0.2, 1.0],
        esplanade: [0.4, 0.3, 0.2, 1.0],
        neonclub: [0.1, 0.05, 0.2, 1.0],
        industrial: [0.3, 0.25, 0.2, 1.0]
      };

      const color = colors[environmentType as keyof typeof colors] || [0.5, 0.5, 0.5, 1.0];
      
      for (let i = 0; i < size * size; i++) {
        const index = i * 4;
        // Add subtle noise for more realistic appearance
        const noise = (Math.random() - 0.5) * 0.1;
        data[index] = Math.max(0, color[0] + noise);
        data[index + 1] = Math.max(0, color[1] + noise);
        data[index + 2] = Math.max(0, color[2] + noise);
        data[index + 3] = color[3];
      }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.needsUpdate = true;
    
    // Enhanced texture filtering
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    
    console.log(`HDRImageCache: Created enhanced ${optimalRes} fallback texture for ${environmentType}`);
    return texture;
  }

  /**
   * Try to load HDR with adaptive resolution and fallbacks
   */
  private async loadWithFallbacks(environmentType: string): Promise<THREE.DataTexture> {
    const optimalResolution = this.getOptimalResolution();
    const resolutionFallbacks: Array<'1k' | '2k' | '4k' | '8k'> = [optimalResolution];
    
    // Add fallback resolutions
    if (optimalResolution !== '1k') resolutionFallbacks.push('1k');
    if (optimalResolution === '8k') resolutionFallbacks.splice(1, 0, '4k', '2k');
    if (optimalResolution === '4k') resolutionFallbacks.splice(1, 0, '2k');
    
    console.log(`HDRImageCache: Loading ${environmentType} with resolution priority: [${resolutionFallbacks.join(', ')}]`);
    
    // Try local files first with resolution fallbacks
    for (const resolution of resolutionFallbacks) {
      const localPath = this.HDR_PATHS[environmentType as keyof typeof this.HDR_PATHS]?.[resolution];
      if (localPath) {
        try {
          console.log(`HDRImageCache: Attempting local ${resolution} HDR: ${localPath}`);
          
          const texture = await new Promise<THREE.DataTexture>((resolve, reject) => {
            this.loader.load(
              localPath,
              (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                // Enhanced texture filtering for better quality
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.generateMipmaps = true;
                console.log(`HDRImageCache: Successfully loaded local ${resolution} HDR: ${localPath}`);
                resolve(texture);
              },
              undefined,
              reject
            );
          });
          
          return texture;
        } catch (error) {
          console.warn(`HDRImageCache: Local ${resolution} HDR failed for ${environmentType}:`, error);
        }
      }
    }
    
    // Try remote fallbacks with resolution priority
    for (const resolution of resolutionFallbacks) {
      const fallbackUrls = this.FALLBACK_URLS[environmentType as keyof typeof this.FALLBACK_URLS]?.[resolution] || [];
      
      for (const url of fallbackUrls) {
        try {
          console.log(`HDRImageCache: Attempting ${resolution} fallback: ${url}`);
          
          const texture = await new Promise<THREE.DataTexture>((resolve, reject) => {
            this.loader.load(
              url,
              (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.generateMipmaps = true;
                console.log(`HDRImageCache: Successfully loaded ${resolution} fallback: ${url}`);
                resolve(texture);
              },
              undefined,
              reject
            );
          });
          
          return texture;
        } catch (error) {
          console.warn(`HDRImageCache: ${resolution} fallback failed for ${environmentType}:`, error);
        }
      }
    }
    
    console.log(`HDRImageCache: All HDR sources failed for ${environmentType}, using enhanced procedural fallback`);
    return this.createFallbackTexture(environmentType);
  }

  /**
   * Preload all HDR images for faster environment switching
   */
  async preloadAll(): Promise<void> {
    console.log('HDRImageCache: Starting adaptive preload of all HDR images...');
    console.log(`HDRImageCache: Using optimal resolution: ${this.getOptimalResolution()}`);
    
    const preloadPromises = Object.keys(this.HDR_PATHS).map(key => 
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
    const optimalResolution = this.getOptimalResolution();
    const cacheKey = `${environmentType}_${optimalResolution}`;
    
    if (this.cache.has(cacheKey)) {
      console.log(`HDRImageCache: ${environmentType} (${optimalResolution}) already cached`);
      return this.cache.get(cacheKey)!.texture;
    }

    if (this.preloadPromises.has(cacheKey)) {
      console.log(`HDRImageCache: ${environmentType} (${optimalResolution}) already loading`);
      return this.preloadPromises.get(cacheKey)!;
    }

    const preloadPromise = this.loadWithFallbacks(environmentType);
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
    const optimalResolution = this.getOptimalResolution();
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
   * Get HDR URLs for environment type - Updated with new environment names - Fixed return type
   */
  getUrlsForEnvironment(environmentType: string): string[] {
    const normalizedType = environmentType.toLowerCase();
    
    // Handle legacy aliases - map old names to new realistic names
    const typeMap: Record<string, string> = {
      'cosmic': 'milkyway',
      'space': 'milkyway',
      'nightsky': 'milkyway',
      'night': 'milkyway',
      'underwater': 'coastline',
      'ocean': 'coastline',
      'forest': 'hillside',
      'nature': 'hillside',
      'cyberpunk': 'neonclub',
      'cyber': 'neonclub',
      'neon': 'neonclub',
      'luxury': 'esplanade',
      'lounge': 'esplanade',
      'cardshop': 'industrial',
      'store': 'industrial',
      'mall': 'industrial',
      'retro': 'industrial'
    };
    
    const mappedType = typeMap[normalizedType] || normalizedType;
    const key = mappedType as keyof typeof this.FALLBACK_URLS;
    const optimalResolution = this.getOptimalResolution();
    
    return this.FALLBACK_URLS[key]?.[optimalResolution] || this.FALLBACK_URLS.studio[optimalResolution] || this.FALLBACK_URLS.studio['1k'];
  }

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
   * Get cache statistics including resolution info
   */
  getStats() {
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
      optimalResolution: this.getOptimalResolution(),
      deviceCapabilities: this.deviceCapabilities
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

  /**
   * Get HDR file path for environment type - Fixed return type
   */
  getPathForEnvironment(environmentType: string): string {
    const normalizedType = environmentType.toLowerCase();
    
    // Handle legacy aliases
    const typeMap: Record<string, string> = {
      'cosmic': 'milkyway',
      'space': 'milkyway',
      'nightsky': 'milkyway',
      'night': 'milkyway',
      'underwater': 'coastline',
      'ocean': 'coastline',
      'forest': 'hillside',
      'nature': 'hillside',
      'cyberpunk': 'neonclub',
      'cyber': 'neonclub',
      'neon': 'neonclub',
      'luxury': 'esplanade',
      'lounge': 'esplanade',
      'cardshop': 'industrial',
      'store': 'industrial',
      'mall': 'industrial',
      'retro': 'industrial'
    };
    
    const mappedType = typeMap[normalizedType] || normalizedType;
    const key = mappedType as keyof typeof this.HDR_PATHS;
    const optimalResolution = this.getOptimalResolution();
    
    return this.HDR_PATHS[key]?.[optimalResolution] || this.HDR_PATHS.studio[optimalResolution] || this.HDR_PATHS.studio['1k'];
  }
}

// Export singleton instance
export const hdrImageCache = new HDRImageCacheService();

// Preload images when the module loads (with error handling)
hdrImageCache.preloadAll().catch(error => {
  console.warn('HDRImageCache: Initial adaptive preload failed:', error);
});

// Clear old entries every 10 minutes
setInterval(() => {
  hdrImageCache.clearOldEntries();
}, 10 * 60 * 1000);

export default hdrImageCache;
