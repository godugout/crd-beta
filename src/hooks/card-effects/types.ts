
import { Card } from '@/lib/types';

export interface CardEffectsOptions {
  /**
   * Whether to optimize effects for performance
   * @default false
   */
  optimizeForPerformance?: boolean;
  
  /**
   * Initial effects to apply
   * @default {}
   */
  initialEffects?: Record<string, string[]>;
}

export interface CardEffectsResult {
  /**
   * Map of card IDs to active effects
   */
  cardEffects: Record<string, string[]>;
  
  /**
   * Whether effects are loading
   */
  isLoading: boolean;
  
  /**
   * Add an effect to a card
   */
  addEffect: (cardId: string, effect: string) => void;
  
  /**
   * Remove an effect from a card
   */
  removeEffect: (cardId: string, effect: string) => void;
  
  /**
   * Toggle an effect on a card
   */
  toggleEffect: (cardId: string, effect: string) => void;
  
  /**
   * Clear all effects from a card
   */
  clearEffects: (cardId: string) => void;
  
  /**
   * Set all effects for a card
   */
  setCardEffects: (cardId: string, effects: string[]) => void;
}
