import { Card } from '@/lib/types';
import { debounce } from 'lodash-es';
import { PremiumCardEffect } from './types';

/**
 * Get default effects based on card metadata
 */
export function getDefaultEffectsForCard(card: Card): string[] {
  const defaultEffects: string[] = [];
  
  // Add default effects based on tags
  if (card.tags?.includes('premium') || card.tags?.includes('rare')) {
    defaultEffects.push('Holographic');
  }
  
  if (card.tags?.includes('ultra-rare') || card.tags?.includes('limited')) {
    defaultEffects.push('Refractor');
  }
  
  if (card.tags?.includes('legendary') || card.tags?.includes('one-of-one')) {
    defaultEffects.push('Superfractor');
  }
  
  // Add effects based on collection
  if (card.collectionId?.includes('chrome')) {
    defaultEffects.push('Chrome');
  }
  
  if (card.collectionId?.includes('prizm')) {
    defaultEffects.push('Prizm');
  }
  
  // Add default effect if no match
  if (defaultEffects.length === 0 && card.imageUrl) {
    // Default to no effects for regular cards
  }
  
  return defaultEffects;
}

/**
 * Process cards in batches to prevent UI blocking
 */
export async function processCardsBatch(
  cards: Card[],
  initialEffects: Record<string, string[]>
): Promise<Record<string, string[]>> {
  const updatedEffects = { ...initialEffects };
  const batchSize = 10;
  
  for (let i = 0; i < cards.length; i += batchSize) {
    const batch = cards.slice(i, i + batchSize);
    
    // Process this batch
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        batch.forEach(card => {
          if (!updatedEffects[card.id]) {
            const defaultEffects = getDefaultEffectsForCard(card);
            if (defaultEffects.length > 0) {
              updatedEffects[card.id] = defaultEffects;
            }
          }
        });
        resolve();
      }, 0);
    });
  }
  
  return updatedEffects;
}

/**
 * Predefined premium effects for cards
 */
export const premiumEffects: PremiumCardEffect[] = [
  {
    id: 'holographic-rainbow',
    name: 'Holographic Rainbow',
    description: 'Full rainbow holographic effect',
    enabled: false,
    category: 'premium',
    settings: {
      intensity: 0.8,
      speed: 1.2,
    },
    premium: false,
    iconUrl: '/effects/holographic-icon.png'
  },
  {
    id: 'holographic-linear',
    name: 'Linear Holographic',
    description: 'Linear gradient holographic effect',
    enabled: false,
    category: 'premium',
    settings: {
      intensity: 0.7,
      speed: 1.0,
    },
    premium: false,
    iconUrl: '/effects/linear-holo-icon.png'
  },
  {
    id: 'refractor',
    name: 'Refractor',
    category: 'refractor',
    settings: {
      intensity: 1.0,
      speed: 0.8
    },
    description: 'Light-refracting pattern that creates a prism effect',
    premium: false,
    iconUrl: '/icons/effects/refractor.svg'
  },
  {
    id: 'superfractor',
    name: 'Superfractor',
    category: 'refractor',
    settings: {
      intensity: 1.0,
      speed: 1.2,
      pattern: 'extreme'
    },
    description: 'Extreme rainbow refractor pattern with intense light diffraction',
    premium: true,
    iconUrl: '/icons/effects/superfractor.svg'
  },
  {
    id: 'cracked-ice',
    name: 'Cracked Ice',
    category: 'refractor',
    settings: {
      intensity: 0.9,
      speed: 0.7,
      pattern: 'geometric'
    },
    description: 'Geometric pattern with multi-layered reflective surfaces',
    premium: true,
    iconUrl: '/icons/effects/cracked-ice.svg'
  },
  {
    id: 'mojo',
    name: 'Mojo',
    category: 'refractor',
    settings: {
      intensity: 0.85,
      speed: 1.1,
      pattern: 'spiral'
    },
    description: 'Spiral pattern with contrasting color shifting properties',
    premium: true,
    iconUrl: '/icons/effects/mojo.svg'
  },
  {
    id: 'pulsar',
    name: 'Pulsar',
    category: 'special',
    settings: {
      intensity: 0.75,
      speed: 1.5,
      pattern: 'radial',
      animationEnabled: true
    },
    description: 'Pulsating radial pattern with animated glow',
    premium: true,
    iconUrl: '/icons/effects/pulsar.svg'
  },
  {
    id: 'scope',
    name: 'Scope',
    category: 'special',
    settings: {
      intensity: 0.7,
      speed: 0.9,
      pattern: 'circular'
    },
    description: 'Lens-like circular patterns with magnification effects',
    premium: true,
    iconUrl: '/icons/effects/scope.svg'
  },
  {
    id: 'gold-foil',
    name: 'Gold Foil',
    category: 'foil',
    settings: {
      intensity: 0.8,
      speed: 0.5,
      color: '#FFD700'
    },
    description: 'Metallic gold foil effect with subtle light reflection',
    premium: false,
    iconUrl: '/icons/effects/gold-foil.svg'
  },
  {
    id: 'silver-foil',
    name: 'Silver Foil',
    category: 'foil',
    settings: {
      intensity: 0.8,
      speed: 0.5,
      color: '#C0C0C0'
    },
    description: 'Metallic silver foil effect with subtle light reflection',
    premium: false,
    iconUrl: '/icons/effects/silver-foil.svg'
  },
  {
    id: 'chrome',
    name: 'Chrome',
    category: 'texture',
    settings: {
      intensity: 0.9,
      speed: 0.6
    },
    description: 'Chrome-style metallic finish with realistic reflections',
    premium: false,
    iconUrl: '/icons/effects/chrome.svg'
  },
  {
    id: 'prizm',
    name: 'Prizm',
    category: 'refractor',
    settings: {
      intensity: 0.85,
      speed: 0.9,
      pattern: 'geometric'
    },
    description: 'Prizm-inspired geometric patterns with refractor capability',
    premium: false,
    iconUrl: '/icons/effects/prizm.svg'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    category: 'texture',
    settings: {
      intensity: 0.6,
      speed: 0.3
    },
    description: 'Classic vintage card look with subtle texture',
    premium: false,
    iconUrl: '/icons/effects/vintage.svg'
  },
  {
    id: 'canvas',
    name: 'Canvas',
    category: 'texture',
    settings: {
      intensity: 0.7,
      speed: 0.4
    },
    description: 'Canvas texture for a classic art card feel',
    premium: false,
    iconUrl: '/icons/effects/canvas.svg'
  },
  {
    id: 'linen',
    name: 'Linen',
    category: 'texture',
    settings: {
      intensity: 0.65,
      speed: 0.4
    },
    description: 'Subtle linen texture for vintage card designs',
    premium: false,
    iconUrl: '/icons/effects/linen.svg'
  },
  {
    id: 'spectral',
    name: 'Spectral',
    category: 'holographic',
    settings: {
      intensity: 0.9,
      speed: 1.1,
      animationEnabled: true
    },
    description: 'Advanced holographic effect with depth and motion',
    premium: true,
    iconUrl: '/icons/effects/spectral.svg'
  }
];

/**
 * Get the CSS class for a specific effect
 */
export function getEffectClass(effectName: string): string {
  // Normalize effect name for CSS class
  const normalizedName = effectName.toLowerCase().replace(/\s+/g, '-');
  return `card-${normalizedName}`;
}

/**
 * Generate CSS classes for active effects
 */
export function generateEffectClasses(activeEffects: string[]): string {
  return activeEffects.map(effect => getEffectClass(effect)).join(' ');
}

/**
 * Check if a device supports advanced effects
 */
export function supportsAdvancedEffects(): boolean {
  // Check for WebGL support
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    ));
  } catch (e) {
    return false;
  }
}

/**
 * Optimized debounced function for updating effects
 */
export const debouncedEffectUpdate = debounce(
  (callback: () => void) => {
    callback();
  }, 100
);
