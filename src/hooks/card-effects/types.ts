
import { Card } from '@/lib/types';

export interface CardEffect {
  id: string;
  name: string;
  description: string;
  category: 'holographic' | 'chrome' | 'vintage' | 'refractor' | 'special';
  cssClass?: string;
  intensity?: number; // 0-1 value for effect strength
  isDefault?: boolean;
}

export interface CardEffectsOptions {
  initialEffects?: Record<string, string[]>;
  defaultIntensity?: number;
  preferredEffects?: string[];
}

export interface CardEffectsResult {
  cardEffects: Record<string, string[]>;
  isLoading: boolean;
  addEffect: (cardId: string, effect: string) => void;
  removeEffect: (cardId: string, effect: string) => void;
  toggleEffect: (cardId: string, effect: string) => void;
  clearEffects: (cardId: string) => void;
  setCardEffects: (cardId: string, effects: string[]) => void;
}

export interface EffectSettings {
  motionSpeed: number;
  pulseIntensity: number;
  shimmerSpeed: number;
  goldIntensity: number;
  chromeIntensity: number;
  vintageIntensity: number;
  refractorIntensity: number;
  spectralIntensity: number;
}
