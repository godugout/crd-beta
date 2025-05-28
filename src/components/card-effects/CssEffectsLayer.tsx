
import React from 'react';
import './effects.css';

interface CssEffectsLayerProps {
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
  isFlipped: boolean;
  mousePosition?: {x: number, y: number};
}

/**
 * CSS-based effects layer to replace expensive 3D shaders when possible
 * This improves performance significantly
 */
const CssEffectsLayer: React.FC<CssEffectsLayerProps> = ({
  activeEffects,
  effectIntensities = {},
  isFlipped,
  mousePosition = {x: 0.5, y: 0.5}
}) => {
  // Calculate CSS variables based on effects and mouse position
  const cssVariables = {
    '--mouse-x': `${mousePosition.x * 100}%`,
    '--mouse-y': `${mousePosition.y * 100}%`,
  } as React.CSSProperties;
  
  // Add intensity variables for each active effect
  activeEffects.forEach(effect => {
    const intensity = effectIntensities[effect] || 1;
    const normalizedEffect = effect.toLowerCase().replace(/\s+/g, '-');
    cssVariables[`--${normalizedEffect}-intensity`] = intensity.toString();
  });

  // Generate CSS class names based on active effects
  const effectClasses = activeEffects.map(effect => 
    `effect-${effect.toLowerCase().replace(/\s+/g, '-')}`
  ).join(' ');

  return (
    <div 
      className={`effects-layer ${effectClasses} ${isFlipped ? 'flipped' : ''}`}
      style={cssVariables}
    >
      {/* Holographic layer */}
      {activeEffects.includes('Holographic') && (
        <div className="holographic-overlay" />
      )}
      
      {/* Refractor layer */}
      {activeEffects.includes('Refractor') && (
        <div className="refractor-overlay" />
      )}
      
      {/* Shimmer layer */}
      {activeEffects.includes('Shimmer') && (
        <div className="shimmer-overlay" />
      )}
      
      {/* Vintage layer */}
      {activeEffects.includes('Vintage') && (
        <div className="vintage-overlay" />
      )}
      
      {/* Lighting effects */}
      <div className="lighting-overlay" />
    </div>
  );
};

export default CssEffectsLayer;
