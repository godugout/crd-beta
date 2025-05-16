
import { CardEffect, CardEffectSettings } from '@/lib/types/cardTypes';

export interface PremiumCardEffect extends CardEffect {
  premium: boolean;
  enabled: boolean;
  description?: string;
  iconUrl?: string;
}

export interface MaterialSimulation {
  type: string;
  intensity: number;
  reflectivity: number;
  roughness: number;
  metalness: number;
  pattern?: string;
  color?: string;
  texture?: string;
  baseColor?: string;
  weathering?: number;
}

export type CardEffectFunctionParams = {
  element: HTMLElement;
  settings: CardEffectSettings;
  isEnabled: boolean;
};

export type CardEffectFunction = (params: CardEffectFunctionParams) => void | (() => void);

export interface CardEffectRegistry {
  [key: string]: CardEffectFunction;
}

export interface CardEffectDefinition {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  defaultSettings: CardEffectSettings;
  cssClass?: string;
  supportedCardTypes?: string[];
  premium: boolean;
  enabled: boolean;
  renderer?: (element: HTMLElement, settings: any) => void;
  iconUrl?: string;
}

export type EffectUpdateCallback = (effectIds: string[]) => void;

// Re-export CardEffectSettings from cardTypes for components that import it from here
export type { CardEffectSettings } from '@/lib/types/cardTypes';

export type CardEffectsResult = {
  activeEffects: string[];
  effectSettings: Record<string, CardEffectSettings>;
};
