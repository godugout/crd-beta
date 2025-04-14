
import { renderHook } from '@testing-library/react-hooks';
import useCardEffects from '@/hooks/card-effects/useCardEffects';
import { useCardEffectsStack } from '@/components/card-creation/hooks/useCardEffectsStack';
import useLayers from '@/components/card-creation/hooks/useLayers';

describe('Hook Validation Tests', () => {
  test('useCardEffects should return the correct shape', () => {
    const { result } = renderHook(() => useCardEffects());
    
    expect(result.current).toHaveProperty('cardEffects');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('addEffect');
    expect(result.current).toHaveProperty('removeEffect');
    expect(result.current).toHaveProperty('toggleEffect');
    expect(result.current).toHaveProperty('clearEffects');
    expect(result.current).toHaveProperty('setCardEffects');
    expect(result.current).toHaveProperty('setActiveEffects');
    
    expect(typeof result.current.addEffect).toBe('function');
    expect(typeof result.current.removeEffect).toBe('function');
    expect(typeof result.current.toggleEffect).toBe('function');
    expect(typeof result.current.clearEffects).toBe('function');
    expect(typeof result.current.setCardEffects).toBe('function');
    expect(typeof result.current.setActiveEffects).toBe('function');
  });
  
  test('useCardEffectsStack should return the correct shape', () => {
    const { result } = renderHook(() => useCardEffectsStack());
    
    expect(result.current).toHaveProperty('activeEffects');
    expect(result.current).toHaveProperty('setActiveEffects');
    expect(result.current).toHaveProperty('addEffect');
    expect(result.current).toHaveProperty('removeEffect');
    expect(result.current).toHaveProperty('toggleEffect');
    expect(result.current).toHaveProperty('updateEffectSettings');
    expect(result.current).toHaveProperty('getEffectSettings');
    expect(result.current).toHaveProperty('effectStack');
    expect(result.current).toHaveProperty('getEffectClasses');
    
    expect(typeof result.current.addEffect).toBe('function');
    expect(typeof result.current.removeEffect).toBe('function');
    expect(typeof result.current.toggleEffect).toBe('function');
    expect(typeof result.current.updateEffectSettings).toBe('function');
    expect(typeof result.current.getEffectSettings).toBe('function');
    expect(typeof result.current.getEffectClasses).toBe('function');
    expect(Array.isArray(result.current.effectStack)).toBeTruthy();
  });
  
  test('useLayers should return the correct shape', () => {
    const { result } = renderHook(() => useLayers());
    
    expect(result.current).toHaveProperty('layers');
    expect(result.current).toHaveProperty('activeLayerId');
    expect(result.current).toHaveProperty('setActiveLayer');
    expect(result.current).toHaveProperty('addLayer');
    expect(result.current).toHaveProperty('updateLayer');
    expect(result.current).toHaveProperty('deleteLayer');
    expect(result.current).toHaveProperty('moveLayerUp');
    expect(result.current).toHaveProperty('moveLayerDown');
    expect(result.current).toHaveProperty('setLayers');
    
    expect(typeof result.current.setActiveLayer).toBe('function');
    expect(typeof result.current.addLayer).toBe('function');
    expect(typeof result.current.updateLayer).toBe('function');
    expect(typeof result.current.deleteLayer).toBe('function');
    expect(typeof result.current.moveLayerUp).toBe('function');
    expect(typeof result.current.moveLayerDown).toBe('function');
    expect(typeof result.current.setLayers).toBe('function');
    expect(Array.isArray(result.current.layers)).toBeTruthy();
  });
});
