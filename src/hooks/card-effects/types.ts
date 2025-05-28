
import { CardEffectSettings as BaseCardEffectSettings } from '@/components/card-creation/types/cardTypes';

export interface MaterialSimulation {
  /**
   * Type of material to simulate
   */
  type: 'canvas' | 'mesh' | 'synthetic';
  
  /**
   * Base color of the material
   */
  baseColor?: string;
  
  /**
   * URL to a texture image
   */
  textureUrl?: string;
  
  /**
   * Roughness of the material (0-1)
   * 0 = mirror-like, 1 = completely diffuse
   */
  roughness?: number;
  
  /**
   * Metalness of the material (0-1)
   * 0 = non-metal, 1 = metal
   */
  metalness?: number;
  
  /**
   * Weathering effect to apply
   */
  weathering?: 'new' | 'game-worn' | 'vintage';
  
  /**
   * Team colors for auto-extraction
   */
  teamColors?: string[];
}

// Add missing types that were causing build errors
export interface PremiumCardEffect {
  id: string;
  name: string;
  category: string;
  settings: CardEffectSettings;
  description: string;
  premium: boolean;
  iconUrl?: string;
}

export type CardEffectSettings = BaseCardEffectSettings;

export interface CardEffectsOptions {
  initialEffects?: Record<string, string[]>;
  presets?: Record<string, string[]>;
  defaultIntensity?: number;
  performanceMode?: 'high' | 'medium' | 'low';
}

export interface CardEffectsResult {
  cardEffects: Record<string, string[]>;
  isLoading: boolean;
  addEffect: (cardId: string, effect: string) => void;
  removeEffect: (cardId: string, effect: string) => void;
  toggleEffect: (cardId: string, effect: string) => void;
  clearEffects: (cardId: string) => void;
  setCardEffects: (cardId: string, effects: string[]) => void;
  setActiveEffects?: (effects: string[]) => void;  // Add optional method for ImmersiveCardViewer
}
