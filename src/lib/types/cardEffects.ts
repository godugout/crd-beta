
export interface CardEffect {
  id: string;
  name: string;
  intensity: number;
  type: 'holographic' | 'refractor' | 'shimmer' | 'foil' | 'vintage' | 'chrome' | 'standard';
  enabled: boolean;
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
}
