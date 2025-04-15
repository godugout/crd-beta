
import { BaseEntity } from './index';

export interface Reaction extends BaseEntity {
  userId: string;
  type: 'like' | 'heart' | 'wow' | 'fire' | 'clap' | string;
  targetType: 'card' | 'comment' | string;
  targetId: string;
}

export interface Comment extends BaseEntity {
  userId: string;
  content: string;
  targetType: 'card' | 'collection' | string;
  targetId: string;
  parentId?: string;
  reactions?: Reaction[];
}

export interface CardEffectsResult {
  cardEffects: Record<string, string[]>;
  isLoading: boolean;
  addEffect: (cardId: string, effect: string) => void;
  removeEffect: (cardId: string, effect: string) => void;
  toggleEffect: (cardId: string, effect: string) => void;
  clearEffects: (cardId: string) => void;
  setCardEffects: (cardId: string, effects: string[]) => void;
  setActiveEffects?: (effects: string[]) => void;
}

export interface EffectSettings {
  intensity?: number;
  color?: string;
  speed?: number;
  pattern?: string;
  opacity?: number;
}

export interface CardEffect {
  name: string;
  enabled: boolean;
  settings: EffectSettings;
}
