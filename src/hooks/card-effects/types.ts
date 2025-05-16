
export interface CardEffectSettings {
  intensity?: number;
  speed?: number;
  pattern?: string;
  color?: string;
  colorScheme?: string[] | string;
  animationEnabled?: boolean;
  [key: string]: any; // Allow for additional properties as needed
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
  category: string;
  requiresGPU?: boolean;
  compatibleWith?: string[];
}

export interface EffectCategory {
  id: string;
  name: string;
  description: string;
  effects: PremiumCardEffect[];
}

export interface CardEffectDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultSettings: CardEffectSettings;
  premium: boolean;
  enabled: boolean;
  iconUrl?: string;
  thumbnail?: string;
  cssClass?: string;
  supportedCardTypes?: string[];
  renderer: (element: HTMLElement, settings: CardEffectSettings) => void;
}

export interface UseCardEffectsResult {
  effects: PremiumCardEffect[];
  categories: EffectCategory[];
  activeEffects: string[];
  toggleEffect: (effectId: string) => void;
  updateEffectSettings: (effectId: string, settings: Partial<CardEffectSettings>) => void;
  applyEffectsToElement: (element: HTMLElement) => void;
  effectsLoading: boolean;
}
