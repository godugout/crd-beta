
import { useState, useCallback } from 'react';
import { Effect, EffectType } from '@/components/card-creation/modern/effects/EffectComposer';

export interface CardEffectsResult {
  effects: Effect[];
  addEffect: (type: EffectType) => void;
  removeEffect: (id: string) => void;
  updateEffect: (id: string, updates: Partial<Effect>) => void;
  reorderEffects: (newEffects: Effect[]) => void;
  clearEffects: () => void;
  exportEffectsData: () => any;
}

const generateId = () => `effect-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createDefaultEffect = (type: EffectType): Effect => {
  const baseEffect = {
    id: generateId(),
    type,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    blendMode: 'normal' as const,
    enabled: true,
  };

  const typeSpecificParams = {
    holographic: {
      parameters: { intensity: 0.8, scale: 1.0, speed: 1.0 }
    },
    refractor: {
      parameters: { intensity: 0.7, pattern: 'prism', scale: 1.2 }
    },
    foil: {
      parameters: { intensity: 0.9, color: '#C0C0C0', scale: 1.0 }
    },
    chrome: {
      parameters: { intensity: 1.0, scale: 1.0 }
    },
    matte: {
      parameters: { intensity: 0.6, pattern: 'paper' }
    },
    gloss: {
      parameters: { intensity: 0.8, scale: 1.1 }
    },
    textured: {
      parameters: { intensity: 0.5, pattern: 'canvas', scale: 1.0 }
    },
    animated: {
      parameters: { intensity: 0.7, speed: 1.0, pattern: 'shimmer' }
    }
  };

  return {
    ...baseEffect,
    ...typeSpecificParams[type]
  };
};

export const useCardEffects = (initialEffects: Effect[] = []): CardEffectsResult => {
  const [effects, setEffects] = useState<Effect[]>(initialEffects);

  const addEffect = useCallback((type: EffectType) => {
    const newEffect = createDefaultEffect(type);
    setEffects(prev => [...prev, newEffect]);
  }, []);

  const removeEffect = useCallback((id: string) => {
    setEffects(prev => prev.filter(effect => effect.id !== id));
  }, []);

  const updateEffect = useCallback((id: string, updates: Partial<Effect>) => {
    setEffects(prev => prev.map(effect => 
      effect.id === id ? { ...effect, ...updates } : effect
    ));
  }, []);

  const reorderEffects = useCallback((newEffects: Effect[]) => {
    setEffects(newEffects);
  }, []);

  const clearEffects = useCallback(() => {
    setEffects([]);
  }, []);

  const exportEffectsData = useCallback(() => {
    return {
      effects: effects.map(effect => ({
        type: effect.type,
        parameters: effect.parameters,
        blendMode: effect.blendMode,
        enabled: effect.enabled
      })),
      timestamp: new Date().toISOString()
    };
  }, [effects]);

  return {
    effects,
    addEffect,
    removeEffect,
    updateEffect,
    reorderEffects,
    clearEffects,
    exportEffectsData
  };
};

export default useCardEffects;
