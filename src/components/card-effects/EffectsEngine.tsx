
import React, { useState, useEffect, useRef } from 'react';
import { PremiumCardEffect, CardEffectSettings } from '@/hooks/card-effects/types';

interface EffectsEngineProps {
  effects: string[];
  intensity?: number;
  className?: string;
  isInteractive?: boolean;
  disableAnimations?: boolean;
  size?: 'sm' | 'md' | 'lg';
  performanceMode?: 'high' | 'balanced' | 'low';
  onMouseMove?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

const EffectsEngine: React.FC<EffectsEngineProps> = ({
  effects = [],
  intensity = 1,
  className = '',
  isInteractive = true,
  disableAnimations = false,
  size = 'md',
  performanceMode = 'balanced',
  onMouseMove,
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isActive, setIsActive] = useState(false);
  
  // Set CSS variables for effects
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    // Set base variables
    element.style.setProperty('--effect-intensity', intensity.toString());
    
    // Set specific effect variables
    effects.forEach(effect => {
      const normalizedEffect = effect.toLowerCase().replace(/\s+/g, '-');
      element.style.setProperty(`--${normalizedEffect}-active`, '1');
      
      // Set effect-specific intensity if needed
      if (normalizedEffect === 'holographic' || normalizedEffect === 'refractor') {
        element.style.setProperty(`--${normalizedEffect}-intensity`, (intensity * 0.8).toString());
      }
      
      // Enable animations only if not disabled
      if (!disableAnimations && (normalizedEffect === 'pulsar' || normalizedEffect === 'spectral')) {
        element.style.setProperty(`--${normalizedEffect}-animation`, '1');
      } else {
        element.style.setProperty(`--${normalizedEffect}-animation`, '0');
      }
    });
    
    // Remove variables for inactive effects
    ['holographic', 'refractor', 'gold-foil', 'silver-foil', 'chrome',
     'prizm', 'vintage', 'spectral', 'superfractor', 'cracked-ice', 'mojo',
     'pulsar', 'scope'].forEach(effectName => {
      if (!effects.some(e => e.toLowerCase().replace(/\s+/g, '-') === effectName)) {
        element.style.setProperty(`--${effectName}-active`, '0');
      }
    });
  }, [effects, intensity, disableAnimations]);
  
  // Handle mouse movement for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isInteractive || !containerRef.current) return;
    
    // Calculate relative position
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Update CSS variables
    containerRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
    containerRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
    
    setMousePosition({ x, y });
    setIsActive(true);
    
    // Call external handler if provided
    if (onMouseMove) onMouseMove(e);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsActive(false);
    
    // Reset interactive elements with smooth transition
    if (containerRef.current) {
      containerRef.current.classList.add('effect-transition');
      
      // Remove transition class after animation completes
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.classList.remove('effect-transition');
        }
      }, 300);
    }
  };
  
  // Generate CSS classes based on active effects
  const getEffectClasses = () => {
    const baseClasses = [
      'effects-container',
      `size-${size}`,
      `perf-${performanceMode}`,
      isActive ? 'effects-active' : '',
      isInteractive ? 'interactive' : ''
    ];
    
    // Add effect-specific classes
    const effectClasses = effects.map(effect => 
      `effect-${effect.toLowerCase().replace(/\s+/g, '-')}`
    );
    
    return [...baseClasses, ...effectClasses, className].filter(Boolean).join(' ');
  };
  
  return (
    <div
      ref={containerRef}
      className={getEffectClasses()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--mouse-position-x': `${mousePosition.x * 100}%`,
        '--mouse-position-y': `${mousePosition.y * 100}%`,
        ...style
      } as React.CSSProperties}
    >
      {/* Holographic layer */}
      {effects.includes('Holographic') && (
        <div className="effect-layer holographic-layer" />
      )}
      
      {/* Refractor layers */}
      {(effects.includes('Refractor') || effects.includes('Prizm')) && (
        <div className="effect-layer refractor-layer" />
      )}
      
      {/* Premium refractor effects */}
      {effects.includes('Superfractor') && (
        <div className="effect-layer superfractor-layer" />
      )}
      
      {effects.includes('Cracked Ice') && (
        <div className="effect-layer cracked-ice-layer" />
      )}
      
      {effects.includes('Mojo') && (
        <div className="effect-layer mojo-layer" />
      )}
      
      {/* Metallic effects */}
      {effects.includes('Chrome') && (
        <div className="effect-layer chrome-layer" />
      )}
      
      {effects.includes('Gold Foil') && (
        <div className="effect-layer gold-foil-layer" />
      )}
      
      {/* Special effects */}
      {effects.includes('Pulsar') && !disableAnimations && (
        <div className="effect-layer pulsar-layer" />
      )}
      
      {effects.includes('Spectral') && (
        <div className="effect-layer spectral-layer" />
      )}
      
      {/* Texture effects */}
      {effects.includes('Vintage') && (
        <div className="effect-layer vintage-layer" />
      )}
      
      {/* Light reflection overlay */}
      {isInteractive && (
        <div className="light-reflection-layer" />
      )}
    </div>
  );
};

export default EffectsEngine;
