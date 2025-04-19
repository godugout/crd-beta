
/**
 * Card visual effects
 */

export interface CardEffect {
  id: string;
  name: string;
  enabled: boolean;
  settings: CardEffectSettings;
  className?: string;
}

export interface CardEffectSettings {
  intensity?: number;
  speed?: number;
  pattern?: string;
  color?: string;
  animationEnabled?: boolean;
  [key: string]: any;
}

export type EffectPreset = {
  name: string;
  effects: CardEffect[];
  description?: string;
  thumbnail?: string;
};
