
import { useCardEffectsContext } from '@/providers/CardEffectsProvider';
import { CardEffect, CardEffectsResult } from '@/lib/types';

export function useCardEffects(): CardEffectsResult {
  return useCardEffectsContext();
}

export default useCardEffects;
