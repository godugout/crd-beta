
export interface CardEffectSettings {
  intensity?: number;
  speed?: number;
  pattern?: string;
  color?: string;
  colorScheme?: string[];
  animationEnabled?: boolean;
  [key: string]: any;
}

export interface UseCardEffectsResult {
  cardEffects: Record<string, string[]>;
  activeEffects: string[];
  setActiveEffects: (effects: string[]) => void;
  addEffect: (cardId: string, effect: string) => void;
  removeEffect: (cardId: string, effect: string) => void;
  toggleEffect: (cardId: string, effect: string) => void;
  setCardEffects: (cardId: string, effects: string[]) => void;
  clearEffects: (cardId: string) => void;
  updateEffectSettings: (cardId: string, effect: string, settings: CardEffectSettings) => void;
  getEffectSettings: (cardId: string, effect: string) => CardEffectSettings | undefined;
}

export interface CardEffect {
  id: string;
  name: string;
  enabled: boolean;
  settings: CardEffectSettings;
  className?: string;
}

export interface CardEffectDefinition {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'premium' | 'standard' | 'special';
  defaultSettings: CardEffectSettings;
  cssClass: string;
  supportedCardTypes: string[];
  renderFunction?: (settings: CardEffectSettings) => React.ReactNode;
}

export interface PremiumCardEffect extends CardEffect {
  premium: boolean;
  requiresSubscription: boolean;
}

export interface MaterialSimulation {
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  ior: number;
  transmission: number;
  reflectivity: number;
  emissive: string;
  envMapIntensity: number;
}
