
import { CardEffectSettings } from '@/components/card-creation/types/cardTypes';

// Card effect result interface
export interface CardEffectsResult {
  cardEffects: Record<string, string[]>;
  isLoading: boolean;
  addEffect: (cardId: string, effect: string) => void;
  removeEffect: (cardId: string, effect: string) => void;
  toggleEffect: (cardId: string, effect: string) => void;
  clearEffects: (cardId: string) => void;
  setCardEffects: (cardId: string, effects: string[]) => void;
  setActiveEffects?: (effects: string[]) => void;  // Add optional method for ImmersiveCardViewer
  activeEffects?: string[];  // Add active effects array
}

// Define CardEffect here
export interface CardEffect {
  id: string;
  name: string;
  enabled: boolean;
  settings: CardEffectSettings;
  className?: string;
}

// Effect settings type alias for backward compatibility
export type EffectSettings = CardEffectSettings;
