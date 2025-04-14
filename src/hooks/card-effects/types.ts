
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
  refractorIntensity?: number;
  refractorSpeed?: number;
  refractorColors?: string[];
  refractorAngle?: number;
  holographicIntensity?: number;
  holographicPattern?: 'linear' | 'circular' | 'angular' | 'geometric';
  holographicColorMode?: 'rainbow' | 'blue-purple' | 'gold-green' | 'custom';
  holographicCustomColors?: string[];
  holographicSparklesEnabled?: boolean;
  holographicBorderWidth?: number;
  holographicMicrotext?: string;
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
  type: 'metal' | 'canvas' | 'glossy' | 'matte' | 'embossed' | 'refractor' | 'holographic';
  baseColor?: string;
  textureUrl?: string;
  normalMapUrl?: string;
  roughness?: number;
  metalness?: number;
  reflectivity?: number;
  refractorProperties?: {
    intensity: number;
    speed: number;
    colors: string[];
    angle?: number;
  };
  holographicProperties?: {
    intensity: number;
    pattern: 'linear' | 'circular' | 'angular' | 'geometric';
    colorMode: 'rainbow' | 'blue-purple' | 'gold-green' | 'custom';
    customColors?: string[];
    sparklesEnabled: boolean;
    borderWidth: number;
    microtext?: string;
  };
}
