
export interface CardEffect {
  id: string;
  name: string;
  intensity: number;
  type: 'holographic' | 'refractor' | 'shimmer' | 'foil' | 'vintage' | 'chrome' | 'standard';
  enabled: boolean;
  settings?: Record<string, any>;
  className?: string; // Added className property
}

export interface EffectSettings {
  intensity: number;
  animation: boolean;
  quality: 'high' | 'medium' | 'low';
}

export interface CardEffectsResult {
  cardEffects: Record<string, string[]>;
  activeEffects: string[];
  addEffect: (cardId: string, effect: string) => void;
  removeEffect: (cardId: string, effect: string) => void;
  toggleEffect: (cardId: string, effect: string) => void;
  clearEffects: (cardId: string) => void;
  setCardEffects: (cardId: string, effects: string[]) => void;
  setActiveEffects: (effects: string[]) => void;
  effects?: CardEffect[]; 
  updateIntensity?: (effectId: string, intensity: number) => void;
}

// Add this export to fix imports in other files
export interface CardEffectWithClassName extends CardEffect {
  className?: string;
}
