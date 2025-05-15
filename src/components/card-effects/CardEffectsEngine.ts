
import { CardEffect, CardEffectsResult, EffectEngine as BaseEffectEngine } from '@/lib/types/cardEffects';
import { useRef } from 'react';

/**
 * Extended EffectEngine implementation for component usage
 */
export interface ExtendedEffectEngine extends BaseEffectEngine {
  // Additional properties used in CardEffectsDemo
  engine: any;
  activeEffects: string[];
  toggleEffect: (id: string) => void;
  updateEffectSettings: (id: string, settings: any) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cardRef: React.RefObject<HTMLDivElement>;
}

/**
 * Create a default implementation of the EffectEngine
 */
export const createDefaultEffectEngine = (): ExtendedEffectEngine => {
  const effects = new Map<string, CardEffect>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  return {
    engine: {},
    activeEffects: [],
    effects,
    toggleEffect: (id: string) => {
      // Implementation would go here
      console.log('Toggle effect', id);
    },
    updateEffectSettings: (id: string, settings: any) => {
      // Implementation would go here
      console.log('Update effect settings', id, settings);
    },
    canvasRef,
    cardRef,
    
    // Base EffectEngine implementation
    compositor: {
      compose: (effects: CardEffect[]): CardEffectsResult => ({ 
        cssClasses: '', 
        effectData: {} 
      }),
      layerEffects: (primary: CardEffect, secondary: CardEffect): CardEffect => primary,
      getHtmlElement: () => null
    },
    renderer: {
      initialize: (canvas: HTMLCanvasElement) => {},
      applyShader: (effect: CardEffect) => {},
      render: () => {},
      dispose: () => {}
    },
    preview: {
      generateThumbnail: async (effect: CardEffect, size: { width: number; height: number }) => '',
      generatePreview: (card: any, effects: CardEffect[]) => null
    },
    addEffect: (effect: CardEffect) => {
      effects.set(effect.id, effect);
    },
    removeEffect: (id: string) => {
      effects.delete(id);
    },
    applyEffects: (cardElement: HTMLElement, effects: CardEffect[]) => {},
    updateSettings: (id: string, settings: Partial<any>) => {},
    getEffectById: (id: string) => undefined,
    createPreset: (name: string, effects: CardEffect[]) => '',
    loadPreset: (presetId: string) => []
  };
};

// Export a hook that provides the engine
export const useCardEffectsEngine = (): ExtendedEffectEngine => {
  return createDefaultEffectEngine();
};
