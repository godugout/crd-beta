
export interface PremiumCardEffect {
  id: string;
  name: string;
  category: string;
  settings: {
    intensity: number;
    speed: number;
    pattern?: string;
    color?: string;
    angle?: number;
    animationEnabled?: boolean;
    [key: string]: any;
  };
  description: string;
  premium?: boolean;
  iconUrl?: string;
}

export interface CardEffectSettings {
  intensity: number;
  speed: number;
  color?: string;
  pattern?: string;
  blend?: 'normal' | 'multiply' | 'screen' | 'overlay';
  animationEnabled?: boolean;
}

export interface CardEffectsOptions {
  initialEffects?: Record<string, string[]>;
  defaultIntensity?: number;
  motionSensitivity?: number;
  performanceMode?: 'high' | 'balanced' | 'low';
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

export type CardEffectLibrary = Record<string, PremiumCardEffect>;

export interface MaterialSimulation {
  type: 'metal' | 'canvas' | 'glossy' | 'matte' | 'embossed';
  baseColor?: string;
  textureUrl?: string;
  normalMapUrl?: string;
  roughness?: number;
  metalness?: number;
  reflectivity?: number;
}
