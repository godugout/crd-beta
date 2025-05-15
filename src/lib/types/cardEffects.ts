
import { JsonValue } from './index';

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
  [key: string]: JsonValue | undefined;
}

export interface PremiumCardEffect extends CardEffect {
  premium: boolean;
  requiresSubscription: boolean;
}

export interface CardEffectsResult {
  cssClasses: string;
  effectData: Record<string, any>;
  jsxElements?: React.ReactNode[];
}

export type EffectSettings = CardEffectSettings;
