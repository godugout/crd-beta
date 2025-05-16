
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

export type EffectUpdateCallback = (effectIds: string[]) => void;
