
import { useCardEffectsContext } from '@/providers/CardEffectsProvider';
import { CardEffectsResult } from '@/lib/types';

export function useCardEffects(): CardEffectsResult {
  try {
    return useCardEffectsContext();
  } catch (error) {
    console.warn('useCardEffects used outside of CardEffectsProvider, using mock effects context');
    // Return a mock card effects result for when used outside of provider
    return {
      cardEffects: {},
      isLoading: false,
      addEffect: () => {},
      removeEffect: () => {},
      toggleEffect: () => {},
      clearEffects: () => {},
      setCardEffects: () => {},
      setActiveEffects: () => {},
    };
  }
}

export default useCardEffects;
