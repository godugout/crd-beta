
import { CardEffect, EffectLayer } from './types';

export interface EffectEngineOptions {
  intensity: number;
  animated: boolean;
  quality: 'low' | 'medium' | 'high';
  optimizeForMobile: boolean;
}

export const DEFAULT_EFFECTS: CardEffect[] = [
  {
    id: 'refractor',
    name: 'Refractor',
    description: 'Light refraction effect with rainbow prismatic effect',
    intensity: 1,
    thumbnailUrl: '/effects/refractor.jpg'
  },
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Classic holographic foil effect with moving patterns',
    intensity: 1,
    thumbnailUrl: '/effects/holographic.jpg'
  },
  {
    id: 'prismatic',
    name: 'Prismatic',
    description: 'Colorful prismatic light effect with color shifts',
    intensity: 1,
    thumbnailUrl: '/effects/prismatic.jpg'
  },
  {
    id: 'spectral',
    name: 'Spectral',
    description: 'Advanced spectral holographic effect with depth',
    intensity: 1,
    thumbnailUrl: '/effects/spectral.jpg'
  },
  {
    id: 'gold-foil',
    name: 'Gold Foil',
    description: 'Luxury gold foil effect with reflections',
    intensity: 1,
    thumbnailUrl: '/effects/gold-foil.jpg'
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic chrome effect with reflection',
    intensity: 1,
    thumbnailUrl: '/effects/chrome.jpg'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro vintage effect with color grading',
    intensity: 1,
    thumbnailUrl: '/effects/vintage.jpg'
  },
  {
    id: 'electric',
    name: 'Electric',
    description: 'Energetic glowing electric effect',
    intensity: 1,
    thumbnailUrl: '/effects/electric.jpg'
  }
];

// Helper function to get CSS classes for effects
export const getEffectClasses = (
  activeEffects: string[],
  options: Partial<EffectEngineOptions> = {}
): string => {
  const classes: string[] = [];
  const { intensity = 1, animated = true } = options;
  
  // Base class
  classes.push('card-with-effects');
  
  if (animated) {
    classes.push('effects-animated');
  }
  
  // Add effect-specific classes
  activeEffects.forEach(effectId => {
    switch (effectId) {
      case 'refractor':
        classes.push('card-refractor');
        break;
      case 'holographic':
        classes.push('card-holographic');
        break;
      case 'prismatic':
        classes.push('card-prismatic');
        break;
      case 'spectral':
        classes.push('spectral-hologram');
        break;
      case 'gold-foil':
        classes.push('card-gold-foil');
        break;
      case 'chrome':
        classes.push('card-chrome');
        break;
      case 'vintage':
        classes.push('card-vintage');
        break;
      case 'electric':
        classes.push('card-electric');
        break;
    }
  });
  
  // Add intensity class
  if (intensity !== 1) {
    classes.push(`effect-intensity-${Math.round(intensity * 10)}`);
  }
  
  return classes.join(' ');
};

// Helper function to get CSS variables for effects
export const getEffectVariables = (
  activeEffects: string[],
  options: Partial<EffectEngineOptions> = {}
): Record<string, string> => {
  const variables: Record<string, string> = {};
  const { intensity = 1 } = options;
  
  // Base variables
  variables['--effect-intensity'] = intensity.toString();
  variables['--motion-speed'] = '1';
  variables['--shimmer-speed'] = '3s';
  
  // Effect-specific variables
  if (activeEffects.includes('refractor')) {
    variables['--refractor-intensity'] = intensity.toString();
  }
  
  if (activeEffects.includes('holographic')) {
    variables['--shimmer-speed'] = `${3 / Math.max(0.5, Math.min(2, intensity))}s`;
  }
  
  if (activeEffects.includes('spectral')) {
    variables['--spectral-intensity'] = intensity.toString();
  }
  
  if (activeEffects.includes('gold-foil')) {
    variables['--gold-intensity'] = intensity.toString();
  }
  
  if (activeEffects.includes('chrome')) {
    variables['--chrome-intensity'] = intensity.toString();
  }
  
  if (activeEffects.includes('electric')) {
    variables['--pulse-intensity'] = intensity.toString();
  }
  
  return variables;
};

export const applyEffectsToElement = (
  element: HTMLElement,
  activeEffects: string[],
  options: Partial<EffectEngineOptions> = {}
): void => {
  // Add classes
  const classes = getEffectClasses(activeEffects, options).split(' ');
  classes.forEach(cls => element.classList.add(cls));
  
  // Set CSS variables
  const variables = getEffectVariables(activeEffects, options);
  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
};

// Helper function to get computationally expensive effects
export const getComputationallyExpensiveEffects = (): string[] => {
  return ['spectral', 'refractor', 'electric'];
};

// Helper to check if we should reduce quality based on device
export const shouldReduceEffectsQuality = (): boolean => {
  // Check if we're on a mobile device
  const isMobile = window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check if we have a preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return isMobile || prefersReducedMotion;
};
