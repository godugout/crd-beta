
import React, { CSSProperties } from 'react';

interface CardEffectsLayerProps {
  activeEffects: string[];
  isFlipped: boolean;
}

const CardEffectsLayer = ({ 
  activeEffects,
  isFlipped 
}: CardEffectsLayerProps) => {
  const getCardClasses = () => {
    const classes = [
      'w-64 h-96 relative transition-all duration-300 rounded-lg shadow-xl overflow-hidden',
      isFlipped ? 'scale-x-[-1]' : '',
    ];
    
    // Apply all active effects to the card
    if (activeEffects.includes('Classic Holographic')) {
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
    
    return classes.join(' ');
  };

  const getFilterStyle = () => {
    let filterStyle: CSSProperties = {};
    
    // Apply filters based on active effects
    if (activeEffects.includes('Classic Holographic')) {
      filterStyle = {
        ...filterStyle,
        filter: 'contrast(1.1) brightness(1.1) saturate(1.3)',
      };
    }
    
    // Add filter modifications for new effects
    if (activeEffects.includes('Vintage')) {
      filterStyle = {
        ...filterStyle,
        filter: `${filterStyle.filter || ''} sepia(0.3) contrast(0.95) brightness(0.9)`.trim(),
      };
    }
    
    if (activeEffects.includes('Refractor') || activeEffects.includes('Gold Foil') || 
        activeEffects.includes('Chrome') || activeEffects.includes('Prismatic')) {
      filterStyle = {
        ...filterStyle,
        borderRadius: '12px',
      };
    }
    
    return filterStyle;
  };

  return { getCardClasses, getFilterStyle };
};

export default CardEffectsLayer;
