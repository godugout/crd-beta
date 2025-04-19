
/**
 * Valid environment presets for @react-three/drei's Environment component
 */
export type ValidEnvironmentPreset = 
  'apartment' | 'city' | 'dawn' | 'forest' | 'lobby' | 
  'night' | 'park' | 'studio' | 'sunset' | 'warehouse';

/**
 * Maps custom lighting presets to valid react-three/drei environment presets
 */
export function mapLightingPresetToEnvironment(preset: string): string {
  switch (preset) {
    case 'studio':
      return 'studio';
    case 'dramatic':
      return 'night';
    case 'natural':
      return 'sunset';
    case 'display_case':
      return 'city';
    case 'dawn':
      return 'dawn';
    case 'warehouse':
      return 'warehouse';
    default:
      return 'studio';
  }
}

/**
 * Returns optimized WebGL renderer parameters based on device capability detection
 */
export function getOptimizedRendererParams(): Record<string, any> {
  // Check if device is likely mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check for WebGL2 support
  const hasWebGL2 = typeof document !== 'undefined' && !!document.createElement('canvas').getContext('webgl2');
  
  // Detect GPU performance tier by checking for certain features
  let performanceTier = 'medium';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        
        // Check for high-end GPU indicators
        if (/NVIDIA|RTX|GTX|Radeon|AMD|Intel Iris|Apple M1|Apple M2/i.test(renderer)) {
          performanceTier = 'high';
        } else if (/Mali-G|PowerVR|Intel HD/i.test(renderer)) {
          performanceTier = 'low';
        }
      }
    }
  } catch (e) {
    console.log('GPU detection failed:', e);
  }
  
  // Return optimized parameters based on device capabilities
  if (performanceTier === 'high' && hasWebGL2 && !isMobile) {
    return {
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
      stencil: false,
      depth: true,
      precision: 'highp',
      logarithmicDepthBuffer: false
    };
  } else if (performanceTier === 'medium' || (!isMobile && hasWebGL2)) {
    return {
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
      stencil: false,
      depth: true,
      precision: 'mediump',
      logarithmicDepthBuffer: false
    };
  } else {
    return {
      powerPreference: 'default',
      antialias: false,
      alpha: false,
      stencil: false,
      depth: true,
      precision: 'mediump',
      logarithmicDepthBuffer: false
    };
  }
}

/**
 * Returns the optimum device pixel ratio for the current device
 * to balance quality and performance
 */
export function getOptimalDpr(qualityLevel: 'high' | 'medium' | 'low' = 'medium'): [number, number] {
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  switch (qualityLevel) {
    case 'high':
      return [1, Math.min(devicePixelRatio, 2)];
    case 'medium':
      return [0.75, Math.min(devicePixelRatio, 1.5)];
    case 'low':
      return [0.5, 1];
    default:
      return [0.75, Math.min(devicePixelRatio, 1.5)];
  }
}
