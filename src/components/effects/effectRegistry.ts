
import { CardEffectDefinition } from '@/hooks/card-effects/types';

/**
 * Registry of all available card effects
 * Central configuration for effects and their default settings
 */
export const effectRegistry: Record<string, CardEffectDefinition> = {
  Holographic: {
    id: 'holographic',
    name: 'Holographic',
    description: 'Rainbow reflective effect that shifts with viewing angle',
    thumbnail: '/effects/holographic-thumb.jpg',
    category: 'premium',
    defaultSettings: {
      intensity: 0.7,
      speed: 1.0,
      pattern: 'linear',
      colorScheme: ['#ff0099', '#00ffcc', '#ffcc00', '#00ccff'],
      animationEnabled: true
    },
    cssClass: 'effect-holographic',
    supportedCardTypes: ['standard', 'premium', 'collectible'],
    premium: true,
    enabled: true,
    renderer: (element: HTMLElement, settings: any) => {
      // Apply holographic effect to the element
      element.classList.add('effect-holographic');
      element.style.setProperty('--hologram-intensity', settings.intensity.toString());
      element.style.setProperty('--motion-speed', settings.speed.toString());
    }
  },
  
  Refractor: {
    id: 'refractor',
    name: 'Refractor',
    description: 'Light-bending prismatic effect with angular highlights',
    thumbnail: '/effects/refractor-thumb.jpg',
    category: 'premium',
    defaultSettings: {
      intensity: 0.6,
      speed: 0.8,
      pattern: 'angular',
      colorScheme: ['#80ffea', '#8aff80', '#ffca80'],
      animationEnabled: true
    },
    cssClass: 'effect-refractor',
    supportedCardTypes: ['premium', 'collectible'],
    premium: true,
    enabled: true,
    renderer: (element: HTMLElement, settings: any) => {
      // Apply refractor effect to the element
      element.classList.add('card-refractor');
      element.style.setProperty('--refractor-intensity', settings.intensity.toString());
      element.style.setProperty('--motion-speed', settings.speed.toString());
    }
  },
  
  Chrome: {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic chrome finish with reflection and shine',
    thumbnail: '/effects/chrome-thumb.jpg',
    category: 'standard',
    defaultSettings: {
      intensity: 0.5,
      speed: 0.5,
      colorScheme: ['#ffffff', '#d0d0d0', '#a0a0a0'],
      animationEnabled: false
    },
    cssClass: 'effect-chrome',
    supportedCardTypes: ['standard', 'premium', 'collectible'],
    premium: false,
    enabled: true,
    renderer: (element: HTMLElement, settings: any) => {
      // Apply chrome effect to the element
      element.classList.add('card-chrome');
      element.style.setProperty('--chrome-intensity', settings.intensity.toString());
    }
  },
  
  Vintage: {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic aged look with subtle grain and color shift',
    thumbnail: '/effects/vintage-thumb.jpg',
    category: 'standard',
    defaultSettings: {
      intensity: 0.4,
      speed: 0.2,
      colorScheme: ['#ffe6cc', '#ffccaa'],
      animationEnabled: false
    },
    cssClass: 'effect-vintage',
    supportedCardTypes: ['standard', 'collectible'],
    premium: false,
    enabled: true,
    renderer: (element: HTMLElement, settings: any) => {
      // Apply vintage effect to the element
      element.classList.add('card-vintage');
      element.style.setProperty('--vintage-intensity', settings.intensity.toString());
    }
  },
  
  Shimmer: {
    id: 'shimmer',
    name: 'Shimmer',
    description: 'Subtle animated glow effect that pulses and moves',
    thumbnail: '/effects/shimmer-thumb.jpg',
    category: 'standard',
    defaultSettings: {
      intensity: 0.4,
      speed: 1.2,
      color: '#ffffff',
      animationEnabled: true
    },
    cssClass: 'effect-shimmer',
    supportedCardTypes: ['standard', 'premium', 'collectible'],
    premium: false,
    enabled: true,
    renderer: (element: HTMLElement, settings: any) => {
      // Apply shimmer effect to the element
      element.classList.add('effect-shimmer');
      element.style.setProperty('--shimmer-intensity', settings.intensity.toString());
      element.style.setProperty('--motion-speed', settings.speed.toString());
    }
  }
};

/**
 * Get effect definitions by category
 */
export const getEffectsByCategory = (category: 'premium' | 'standard' | 'special' | 'all'): CardEffectDefinition[] => {
  if (category === 'all') {
    return Object.values(effectRegistry);
  }
  
  return Object.values(effectRegistry).filter(effect => effect.category === category);
};

/**
 * Get effect definition by ID
 */
export const getEffectById = (id: string): CardEffectDefinition | undefined => {
  return effectRegistry[id] || Object.values(effectRegistry).find(effect => effect.id === id);
};

export default effectRegistry;
