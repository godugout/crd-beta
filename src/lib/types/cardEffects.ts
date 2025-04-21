
/**
 * Card effect settings interface
 */
export interface CardEffectSettings {
  intensity?: number;
  speed?: number;
  pattern?: string;
  color?: string;
  animationEnabled?: boolean;
  [key: string]: any;
}

/**
 * Card effect interface
 */
export interface CardEffect {
  id: string;
  name: string;
  enabled: boolean;
  settings: CardEffectSettings;
  className?: string;
}

/**
 * Card effects options for the hook
 */
export interface CardEffectsOptions {
  initialEffects?: Record<string, string[]>;
  presets?: Record<string, string[]>;
  defaultIntensity?: number;
  performanceMode?: 'high' | 'medium' | 'low';
}

/**
 * Card effects result from the hook
 */
export interface CardEffectsResult {
  cardEffects: Record<string, string[]>;
  isLoading: boolean;
  addEffect: (cardId: string, effect: string) => void;
  removeEffect: (cardId: string, effect: string) => void;
  toggleEffect: (cardId: string, effect: string) => void;
  clearEffects: (cardId: string) => void;
  setCardEffects: (cardId: string, effects: string[]) => void;
  activeEffects: string[];
  setActiveEffects: (effects: string[]) => void;
}

/**
 * Additional effect settings for premium effects
 */
export type EffectSettings = CardEffectSettings;
