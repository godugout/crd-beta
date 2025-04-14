
import { useCardEffectsContext } from '@/providers/CardEffectsProvider';
import { CardEffectsResult } from '@/lib/types';

export function useCardEffects(): CardEffectsResult {
  return useCardEffectsContext();
}

export default useCardEffects;
