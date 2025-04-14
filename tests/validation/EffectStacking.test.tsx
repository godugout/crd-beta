
import { renderHook, act } from '@testing-library/react-hooks';
import { useCardEffectsStack } from '@/components/card-creation/hooks/useCardEffectsStack';
import { CardEffect } from '@/components/card-creation/types/cardTypes';

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('Effect Stacking Module', () => {
  test('useCardEffectsStack should initialize with empty effects', () => {
    const { result } = renderHook(() => useCardEffectsStack());
    
    expect(result.current.activeEffects).toEqual([]);
    expect(result.current.effectStack).toEqual([]);
  });
  
  test('addEffect should add an effect to the stack', () => {
    const { result } = renderHook(() => useCardEffectsStack());
    
    act(() => {
      result.current.addEffect('Holographic');
    });
    
    expect(result.current.activeEffects).toContain('Holographic');
    expect(result.current.effectStack.length).toBe(1);
    expect(result.current.effectStack[0].name).toBe('Holographic');
  });
  
  test('removeEffect should remove an effect from the stack', () => {
    const { result } = renderHook(() => useCardEffectsStack(['Holographic']));
    
    // First, make sure the effect is added
    expect(result.current.activeEffects).toContain('Holographic');
    
    // Now add another effect so we can get its ID
    act(() => {
      result.current.addEffect('Refractor');
    });
    
    const effectId = result.current.effectStack[0].id;
    
    // Remove the effect
    act(() => {
      result.current.removeEffect(effectId);
    });
    
    // Check if the effect is removed
    expect(result.current.effectStack.find(e => e.id === effectId)).toBeUndefined();
  });
  
  test('updateEffectSettings should update the settings of an effect', () => {
    const { result } = renderHook(() => useCardEffectsStack());
    
    // Add an effect
    act(() => {
      result.current.addEffect('Holographic');
    });
    
    const effectId = result.current.effectStack[0].id;
    
    // Update settings
    act(() => {
      result.current.updateEffectSettings(effectId, { intensity: 0.8 });
    });
    
    // Check if settings were updated
    const updatedEffect = result.current.effectStack.find(e => e.id === effectId);
    expect(updatedEffect?.settings.intensity).toBe(0.8);
  });
});
