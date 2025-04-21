
import { useRef, useState, useCallback } from 'react';

interface ArCardEffectsResult {
  effectClass: string;
  handleDoubleTap: () => void;
}

export const useArCardEffects = (
  index: number,
  isSelected: boolean,
  cardRef: React.RefObject<HTMLDivElement>
): ArCardEffectsResult => {
  // Calculate a unique effect based on the card index
  const effectClass = useRef<string>(getEffectClassForIndex(index)).current;
  const [lastTap, setLastTap] = useState<number>(0);

  // Double tap handler for toggling effects
  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    
    if (now - lastTap < 300) {
      // It's a double tap, cycle through effects
      if (cardRef.current) {
        cycleCardEffects(cardRef.current);
      }
    }
    
    setLastTap(now);
  }, [lastTap, cardRef]);

  return {
    effectClass,
    handleDoubleTap
  };
};

// Helper function to get effect class based on index
function getEffectClassForIndex(index: number): string {
  // Distribute effects evenly across cards
  const effects = [
    'effect-holographic',
    'effect-shimmer',
    'effect-refractor',
    'effect-chrome',
    'effect-gold-foil',
    'effect-vintage'
  ];
  
  // Ensure we always get a valid index
  const safeIndex = Math.abs(index) % effects.length;
  return effects[safeIndex];
}

// Helper function to cycle through card effects on double tap
function cycleCardEffects(element: HTMLDivElement): void {
  const effects = [
    'effect-holographic',
    'effect-shimmer',
    'effect-refractor',
    'effect-chrome',
    'effect-gold-foil',
    'effect-vintage',
    '' // No effect
  ];
  
  // Find current effect
  const currentEffectIndex = effects.findIndex(effect => 
    effect && element.classList.contains(effect)
  );
  
  // Remove all effects
  effects.forEach(effect => {
    if (effect) element.classList.remove(effect);
  });
  
  // Add next effect
  const nextIndex = (currentEffectIndex + 1) % effects.length;
  if (effects[nextIndex]) {
    element.classList.add(effects[nextIndex]);
  }
}

export default useArCardEffects;
