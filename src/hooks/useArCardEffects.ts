
import { useState, useEffect, useRef } from 'react';

export const useArCardEffects = (
  index: number, 
  isSelected: boolean,
  cardRef: React.RefObject<HTMLDivElement>
) => {
  const [effectClass, setEffectClass] = useState('');
  const animationFrameRef = useRef<number | null>(null);
  const isGrabbedRef = useRef(false);
  
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
    
    // Add more dynamic effects if the card is selected
    if (isSelected && cardRef.current) {
      const updateCardEffect = () => {
        if (!cardRef.current || !isSelected) return;
        
        // Calculate a sine wave based on time for subtle movement
        const now = Date.now() / 1000;
        const sineValue = Math.sin(now * 2) * 0.5;
        
        // Apply subtle floating animation when selected
        cardRef.current.style.transform = `translateY(${sineValue * 3}px) rotate(${sineValue * 0.5}deg)`;
        
        animationFrameRef.current = requestAnimationFrame(updateCardEffect);
      };
      
      updateCardEffect();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [index, isSelected]);
  
  const handleDoubleTap = () => {
    if (!cardRef.current) return;
    
    // Add a quick animation class for double tap
    cardRef.current.classList.add('animate-scaleIn');
    
    // Make the card look "grabbed"
    isGrabbedRef.current = true;
    cardRef.current.style.transform = 'scale(1.2) rotate(2deg)';
    cardRef.current.style.filter = 'brightness(1.2) contrast(1.1)';
    cardRef.current.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
    
    // Remove the grabbed look after a short delay
    setTimeout(() => {
      if (cardRef.current) {
        isGrabbedRef.current = false;
        cardRef.current.classList.remove('animate-scaleIn');
        cardRef.current.style.transform = '';
        cardRef.current.style.filter = '';
        cardRef.current.style.boxShadow = '';
      }
    }, 800);
  };
  
  return { effectClass, handleDoubleTap, isGrabbed: isGrabbedRef.current };
};
