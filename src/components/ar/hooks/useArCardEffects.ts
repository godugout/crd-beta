
import { useState, useEffect, useRef } from 'react';

export const useArCardEffects = (
  index: number, 
  isSelected: boolean,
  cardRef: React.RefObject<HTMLDivElement>
) => {
  const [effectClass, setEffectClass] = useState('');
  
  // Apply different effects to each card to create variety
  useEffect(() => {
    const effects = [
      'card-refractor-effect',
      'card-chrome-effect', 
      'card-gold-effect',
      'card-prism-effect',
      'card-vintage-effect'
    ];
    
    // Use the index to pick an effect, distributing them among cards
    const effect = effects[index % effects.length];
    setEffectClass(effect);
  }, [index]);
  
  const handleDoubleTap = () => {
    if (!cardRef.current) return;
    
    // Add a quick animation class for double tap
    cardRef.current.classList.add('animate-scaleIn');
    
    // Remove the animation class after it completes
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.classList.remove('animate-scaleIn');
      }
    }, 500);
  };
  
  return { effectClass, handleDoubleTap };
};
