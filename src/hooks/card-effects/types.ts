
export interface CardEffectSettings {
  intensity?: number;
  speed?: number;
  pattern?: string;
  color?: string;
  animationEnabled?: boolean;
}

export interface BaseCardEffect {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  settings: CardEffectSettings;
  icon?: string;
  iconUrl?: string;
}

export interface PremiumCardEffect extends BaseCardEffect {
  premium: boolean;
  price?: number;
  category: string;  // Added category property
  requiresGPU?: boolean;
  compatibleWith?: string[];
}

export interface EffectCategory {
  id: string;
  name: string;
  description: string;
  effects: PremiumCardEffect[];
}
