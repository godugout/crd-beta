// Import necessary types
import { PremiumCardEffect } from './types';
import { CardEffectSettings } from '@/lib/types/cardTypes';

// Export card effect factories and utilities
export const createCardEffect = (
  id: string,
  name: string,
  category: string,
  settings: CardEffectSettings,
  description: string = '',
  premium: boolean = false,
  iconUrl: string = ''
): PremiumCardEffect => {
  return {
    id,
    name,
    category,
    settings,
    description,
    premium,
    iconUrl,
    enabled: false,  // Add this to fix the missing property error
    className: `effect-${id.toLowerCase()}`
  };
};

// Update the PREMIUM_EFFECTS data to include the enabled property
export const PREMIUM_EFFECTS: PremiumCardEffect[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    category: 'premium',
    enabled: false,
    settings: {
      intensity: 0.7,
      speed: 1.0,
    },
    description: 'Rainbow holographic effect that changes with movement',
    premium: false,
    iconUrl: '/assets/effects/holographic-icon.svg'
  },
  {
    id: 'refractor',
    name: 'Refractor',
    category: 'premium',
    enabled: false,
    settings: {
      intensity: 0.6,
      speed: 0.8,
      pattern: 'noise',
    },
    description: 'Prismatic refractor effect that bends light',
    premium: true,
    iconUrl: '/assets/effects/refractor-icon.svg'
  },
  {
    id: 'iridescent',
    name: 'Iridescent',
    category: 'premium',
    enabled: false,
    settings: {
      intensity: 0.7,
      speed: 0.6,
      pattern: 'ripples',
    },
    description: 'Shimmering iridescent effect with subtle color shifts',
    premium: true,
    iconUrl: '/assets/effects/iridescent-icon.svg'
  },
  {
    id: 'opalescent',
    name: 'Opalescent',
    category: 'premium',
    enabled: false,
    settings: {
      intensity: 0.5,
      speed: 0.7,
      pattern: 'swirls',
    },
    description: 'Milky opalescent effect with a soft glow',
    premium: true,
    iconUrl: '/assets/effects/opalescent-icon.svg'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    category: 'premium',
    enabled: false,
    settings: {
      intensity: 0.6,
      speed: 0.9,
      pattern: 'waves',
      animationEnabled: true,
    },
    description: 'Dynamic aurora effect with flowing colors',
    premium: true,
    iconUrl: '/assets/effects/aurora-icon.svg'
  },
  {
    id: 'nebula',
    name: 'Nebula',
    category: 'premium',
    enabled: false,
    settings: {
      intensity: 0.7,
      speed: 0.7,
      pattern: 'clouds',
    },
    description: 'Cosmic nebula effect with swirling stardust',
    premium: true,
    iconUrl: '/assets/effects/nebula-icon.svg'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    category: 'premium',
    enabled: false,
    settings: {
      intensity: 0.4,
      speed: 0.4,
      pattern: 'dots',
    },
    description: 'Aged vintage effect with subtle imperfections',
    premium: true,
    iconUrl: '/assets/effects/vintage-icon.svg'
  },
  {
    id: 'chrome',
    name: 'Chrome',
    category: 'premium',
    enabled: false,
    settings: {
      intensity: 0.8,
      speed: 0.5,
      pattern: 'linear',
    },
    description: 'Reflective chrome finish with dynamic lighting',
    premium: true,
    iconUrl: '/assets/effects/chrome-icon.svg'
  },
];

export const getEffectById = (effectId: string): PremiumCardEffect | undefined => {
  return PREMIUM_EFFECTS.find(effect => effect.id === effectId);
};
