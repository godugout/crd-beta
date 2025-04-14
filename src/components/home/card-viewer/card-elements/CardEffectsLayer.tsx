
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
    
    if (activeEffects.includes('Spectral')) {
      classes.push('spectral-hologram');
    }
    
    return classes.join(' ');
  };

  const getFilterStyle = () => {
    let filterStyle: CSSProperties = {
      position: 'relative', // Ensure the card has position context
      zIndex: 1, // Base z-index for the card
    };
    
    // Apply filters based on active effects
    if (activeEffects.includes('Classic Holographic')) {
      filterStyle = {
        ...filterStyle,
        filter: 'contrast(1.1) brightness(1.1) saturate(1.3)',
      };
    }
    
    // Add filter modifications for refractor effect
    if (activeEffects.includes('Refractor')) {
      filterStyle = {
        ...filterStyle,
        filter: `${filterStyle.filter || ''} contrast(1.15) brightness(1.05) saturate(1.2)`.trim(),
      };
    }
    
    // Add filter modifications for spectral effect
    if (activeEffects.includes('Spectral')) {
      filterStyle = {
        ...filterStyle,
        filter: `${filterStyle.filter || ''} contrast(1.2) brightness(1.1) saturate(1.4)`.trim(),
        '--hologram-intensity': '0.7'
      } as CSSProperties;
    }
    
    // Add filter modifications for new effects
    if (activeEffects.includes('Vintage')) {
      filterStyle = {
        ...filterStyle,
        filter: `${filterStyle.filter || ''} sepia(0.3) contrast(0.95) brightness(0.9)`.trim(),
      };
    }
    
    if (activeEffects.includes('Refractor') || activeEffects.includes('Gold Foil') || 
        activeEffects.includes('Chrome') || activeEffects.includes('Prismatic') ||
        activeEffects.includes('Spectral')) {
      filterStyle = {
        ...filterStyle,
        borderRadius: '12px',
      };
    }
    
    return filterStyle;
  };

  return { getCardClasses, getFilterStyle };
};

// Keep the original component for backward compatibility but use the hook internally
const CardEffectsLayer: React.FC<CardEffectsLayerProps> = (props) => {
  // This component doesn't render anything visible
  // It just provides the effect utilities via the hook
  return null;
};

export default CardEffectsLayer;
