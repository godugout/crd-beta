
import { useState, useEffect, useRef } from 'react';

export const useArCardEffects = (
  index: number, 
  isSelected: boolean,
  cardRef: React.RefObject<HTMLDivElement>
) => {
  const [effectIndex, setEffectIndex] = useState(index % 4);
  
  // Available effects
  const effects = [
    'card-holographic',
    'card-refractor',
    'spectral-hologram',
    'card-gold-foil'
  ];

  // Double tap to change effect
  const handleDoubleTap = (e: React.MouseEvent) => {
    if (isSelected) {
      setEffectIndex((effectIndex + 1) % effects.length);
      e.stopPropagation();
    }
  };

  // Apply floating animation when selected
  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.style.animation = 'float 6s ease-in-out infinite';
      
      // Add shimmer effect
      document.documentElement.style.setProperty('--shimmer-speed', '3s');
      document.documentElement.style.setProperty('--hologram-intensity', '0.8');
    }
  }, [isSelected, cardRef]);

  return {
    effectClass: effects[effectIndex],
    handleDoubleTap
  };
};
