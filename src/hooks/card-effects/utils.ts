
import { PremiumCardEffect } from './types';

// Helper to create effect IDs in a consistent format
export const createEffectId = (cardId: string, effectName: string) => `${cardId}:${effectName}`;

// Base effects available to all users
export const BASE_EFFECTS: PremiumCardEffect[] = [
  {
    id: "shimmer",
    name: "Shimmer",
    category: "standard",
    settings: {
      intensity: 0.5,
      speed: 0.8,
    },
    description: "Subtle shimmer effect that adds a gentle glow",
    premium: false,
    iconUrl: "/effects/shimmer-icon.svg",
    enabled: true
  },
  {
    id: "vintage",
    name: "Vintage",
    category: "standard",
    settings: {
      intensity: 0.6,
      speed: 0.4,
      pattern: "grain"
    },
    description: "Classic aged look with subtle grain texture",
    premium: true,
    iconUrl: "/effects/vintage-icon.svg",
    enabled: true
  },
  {
    id: "refractor",
    name: "Refractor",
    category: "premium",
    settings: {
      intensity: 0.7,
      speed: 0.6,
      pattern: "lines"
    },
    description: "Light-bending prismatic effect with angular highlights",
    premium: true,
    iconUrl: "/effects/refractor-icon.svg",
    enabled: true
  },
  {
    id: "holographic",
    name: "Holographic",
    category: "premium",
    settings: {
      intensity: 0.8,
      speed: 1.0,
      pattern: "rainbow"
    },
    description: "Rainbow reflective effect that shifts with viewing angle",
    premium: true,
    iconUrl: "/effects/holographic-icon.svg",
    enabled: true
  },
  {
    id: "prismatic",
    name: "Prismatic",
    category: "premium",
    settings: {
      intensity: 0.75,
      speed: 1.2,
      pattern: "diamonds",
      animationEnabled: true
    },
    description: "Colorful geometric pattern with depth and motion",
    premium: true,
    iconUrl: "/effects/prismatic-icon.svg",
    enabled: true
  },
  {
    id: "chrome",
    name: "Chrome",
    category: "premium",
    settings: {
      intensity: 0.6,
      speed: 0.5,
      pattern: "metallic"
    },
    description: "Metallic chrome finish with reflection and shine",
    premium: true,
    iconUrl: "/effects/chrome-icon.svg",
    enabled: true
  },
  {
    id: "foil",
    name: "Foil",
    category: "premium",
    settings: {
      intensity: 0.7,
      speed: 0.4,
      pattern: "foil"
    },
    description: "Textured foil effect with subtle highlights",
    premium: true,
    iconUrl: "/effects/foil-icon.svg",
    enabled: true
  }
];

// Premium effects only available to premium users or special cards
export const PREMIUM_EFFECTS = BASE_EFFECTS.filter(effect => effect.premium);

// Standard effects available to all users
export const STANDARD_EFFECTS = BASE_EFFECTS.filter(effect => !effect.premium);

// Get effect by ID utility function
export const getEffectById = (effects: PremiumCardEffect[], id: string): PremiumCardEffect | undefined => {
  return effects.find(effect => effect.id === id);
};

// Determine if an effect is enabled for a given user
export const isEffectEnabledForUser = (
  effect: PremiumCardEffect,
  isPremiumUser: boolean = false
): boolean => {
  if (!effect.premium) return true;
  return isPremiumUser;
};
