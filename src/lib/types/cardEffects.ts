
export interface CardEffect {
  id: string;
  name: string;
  type: 'visual' | 'animation' | 'lighting';
  intensity?: number;
  enabled: boolean;
  className?: string;
}

export interface CardEffectSettings {
  intensity: number;
  color?: string;
  speed?: number;
  direction?: 'horizontal' | 'vertical' | 'radial';
  animationEnabled?: boolean;
  pattern?: string;
  angle?: number;
}

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
  setActiveEffects?: (effects: string[]) => void;
}

export type EffectSettings = CardEffectSettings;
