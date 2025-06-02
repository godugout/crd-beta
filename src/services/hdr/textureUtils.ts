
import * as THREE from 'three';
import { HDRResolution } from './types';

export class TextureUtils {
  /**
   * Create a higher quality fallback procedural texture
   */
  static createFallbackTexture(environmentType: string, optimalRes: HDRResolution): THREE.DataTexture {
    const sizeMap = { '1k': 512, '2k': 1024, '4k': 2048, '8k': 4096 };
    const size = sizeMap[optimalRes];
    
    const data = new Float32Array(size * size * 4);
    
    if (environmentType === 'milkyway') {
      TextureUtils.createStarryNightTexture(data, size, optimalRes);
    } else {
      TextureUtils.createEnvironmentTexture(data, size, environmentType);
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

  private static createStarryNightTexture(data: Float32Array, size: number, optimalRes: HDRResolution): void {
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
  }

  private static createEnvironmentTexture(data: Float32Array, size: number, environmentType: string): void {
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

  /**
   * Apply enhanced texture filtering
   */
  static applyEnhancedFiltering(texture: THREE.DataTexture): void {
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    
    // Enable anisotropic filtering if supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
      const ext = gl.getExtension('EXT_texture_filter_anisotropic');
      if (ext) {
        const maxAnisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        if (maxAnisotropy) {
          texture.anisotropy = Math.min(16, maxAnisotropy);
        }
      }
    }
  }
}
