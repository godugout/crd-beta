
// Default values and fallbacks for card rendering

// Default image URLs for when card images fail to load
export const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
export const FALLBACK_FRONT_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
export const FALLBACK_BACK_IMAGE_URL = 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65';

// Default rendering quality presets
export const RENDERING_QUALITY_PRESETS = {
  high: {
    effectDetail: 1.0,
    lightingQuality: 'pbr',
    reflectionIntensity: 0.8,
    textureSize: 2048,
    animationEnabled: true,
    shadowEnabled: true
  },
  medium: {
    effectDetail: 0.7,
    lightingQuality: 'standard',
    reflectionIntensity: 0.6,
    textureSize: 1024,
    animationEnabled: true,
    shadowEnabled: true
  },
  low: {
    effectDetail: 0.4,
    lightingQuality: 'basic',
    reflectionIntensity: 0.3,
    textureSize: 512,
    animationEnabled: false,
    shadowEnabled: false
  }
};

// Detect device performance tiers
export const detectDevicePerformance = (): 'high' | 'medium' | 'low' => {
  // Check for hardware capabilities
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory || 4;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isOldBrowser = !window.requestAnimationFrame || !window.performance;
  
  // Estimate device capability
  if (cores >= 8 && memory >= 4 && !isMobile && !isOldBrowser) {
    return 'high';
  } else if (cores <= 2 || memory <= 2 || (isMobile && isOldBrowser)) {
    return 'low';
  } else {
    return 'medium';
  }
};

// Get optimized effect settings based on device performance
export const getOptimizedEffectSettings = (
  devicePerformance: 'high' | 'medium' | 'low', 
  activeEffects: string[]
) => {
  const settings = {...RENDERING_QUALITY_PRESETS[devicePerformance]};
  
  // Further reduce quality for multiple premium effects
  const premiumEffects = activeEffects.filter(e => 
    ['Holographic', 'Refractor', 'Superfractor'].includes(e)
  );
  
  if (premiumEffects.length > 1 && devicePerformance !== 'high') {
    return {
      ...settings,
      effectDetail: settings.effectDetail * 0.7,
      animationEnabled: devicePerformance === 'high'
    };
  }
  
  return settings;
};

// Format to use for rendering text on cards
export const CARD_TEXT_FORMATS = {
  title: {
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
  },
  description: {
    fontFamily: '"Inter", system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: 'normal',
    color: '#E0E0E0',
    textAlign: 'center',
    textShadow: '0 1px 1px rgba(0,0,0,0.5)'
  }
};
