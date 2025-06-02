
import { DeviceCapabilities, HDRResolution } from './types';

export class DeviceCapabilitiesService {
  private capabilities: DeviceCapabilities | null = null;

  constructor() {
    this.detectCapabilities();
  }

  /**
   * Detect device capabilities for adaptive HDR loading
   */
  private detectCapabilities(): void {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      this.capabilities = {
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
    
    this.capabilities = {
      maxTextureSize,
      supportsHighRes: maxTextureSize >= 4096 && screenWidth >= 1920,
      isHighDPI: window.devicePixelRatio > 1,
      screenSize
    };

    console.log('HDRImageCache: Device capabilities detected:', this.capabilities);
  }

  /**
   * Get optimal HDR resolution based on device capabilities
   */
  getOptimalResolution(): HDRResolution {
    if (!this.capabilities) return '1k';
    
    const { screenSize, supportsHighRes, maxTextureSize } = this.capabilities;
    
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

  getCapabilities(): DeviceCapabilities | null {
    return this.capabilities;
  }
}
