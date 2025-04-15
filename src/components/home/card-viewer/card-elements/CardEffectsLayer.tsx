
import React, { CSSProperties, useEffect, useRef } from 'react';

interface CardEffectsLayerProps {
  activeEffects: string[];
  isFlipped: boolean;
}

// Changed from component to hook (note the "use" prefix)
export const useCardEffects = ({ 
  activeEffects,
  isFlipped 
}: CardEffectsLayerProps) => {
  const getCardClasses = () => {
    const classes = [
      'w-64 h-96 relative transition-all duration-300 rounded-lg shadow-xl overflow-hidden',
      isFlipped ? 'scale-x-[-1]' : '',
    ];
    
    // Apply all active effects to the card
    if (activeEffects.includes('Holographic')) {
      classes.push('card-holographic');
    }
    
    if (activeEffects.includes('Refractor')) {
      classes.push('card-refractor');
    }
    
    if (activeEffects.includes('Prismatic')) {
      classes.push('card-prismatic');
    }
    
    if (activeEffects.includes('Electric')) {
      classes.push('card-electric');
    }
    
    if (activeEffects.includes('Gold Foil')) {
      classes.push('card-gold-foil');
    }
    
    if (activeEffects.includes('Chrome')) {
      classes.push('card-chrome');
    }
    
    if (activeEffects.includes('Vintage')) {
      classes.push('card-vintage');
    }
    
    if (activeEffects.includes('Spectral')) {
      classes.push('card-spectral');
    }
    
    // Join all classes
    return classes.join(' ');
  };
  
  const getFilterStyle = (): CSSProperties => {
    const style: CSSProperties = {};
    
    // Apply filter styles based on active effects
    if (activeEffects.includes('Vintage')) {
      style.filter = 'sepia(0.5) contrast(1.1)';
    }
    
    if (activeEffects.includes('Chrome')) {
      style.filter = (style.filter || '') + ' brightness(1.2) contrast(1.2)';
    }
    
    return style;
  };
  
  return {
    getCardClasses,
    getFilterStyle
  };
};

export default useCardEffects;
