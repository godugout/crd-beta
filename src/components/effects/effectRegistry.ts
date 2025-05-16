
import { CardEffectDefinition } from '@/hooks/card-effects/types';

// Define a basic set of effect definitions
const effectsRegistry: CardEffectDefinition[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Adds a rainbow holographic effect to the card',
    thumbnail: '/effects/holographic.jpg',
    category: 'premium',
    defaultSettings: {
      intensity: 0.7,
      speed: 0.5,
      pattern: 'linear'
    },
    cssClass: 'effect-holographic',
    supportedCardTypes: ['all'],
    premium: true,
    enabled: true,
    iconUrl: '/icons/holographic.svg'
  },
  {
    id: 'refractor',
    name: 'Refractor',
    description: 'Light refraction effect with prismatic colors',
    thumbnail: '/effects/refractor.jpg',
    category: 'premium',
    defaultSettings: {
      intensity: 0.6,
      speed: 0.4,
      pattern: 'radial'
    },
    cssClass: 'effect-refractor',
    supportedCardTypes: ['all'],
    premium: true,
    enabled: true,
    iconUrl: '/icons/refractor.svg'
  },
  {
    id: 'gold-foil',
    name: 'Gold Foil',
    description: 'Premium gold foil effect',
    thumbnail: '/effects/gold.jpg',
    category: 'premium',
    defaultSettings: {
      intensity: 0.8,
      speed: 0.3,
      pattern: 'linear'
    },
    cssClass: 'effect-gold',
    supportedCardTypes: ['premium'],
    premium: true,
    enabled: true,
    iconUrl: '/icons/gold.svg'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Standard card finish with subtle sheen',
    thumbnail: '/effects/classic.jpg',
    category: 'standard',
    defaultSettings: {
      intensity: 0.3,
      speed: 0.2
    },
    cssClass: 'effect-classic',
    supportedCardTypes: ['all'],
    premium: false,
    enabled: true,
    iconUrl: '/icons/classic.svg'
  }
];

// Get all available effects
export const getAllEffects = (): CardEffectDefinition[] => {
  return effectsRegistry;
};

// Get effects by category
export const getEffectsByCategory = (category: string): CardEffectDefinition[] => {
  return effectsRegistry.filter(effect => effect.category === category);
};

// Get a specific effect by ID
export const getEffectById = (effectId: string): CardEffectDefinition | null => {
  return effectsRegistry.find(effect => effect.id === effectId) || null;
};

export default effectsRegistry;
