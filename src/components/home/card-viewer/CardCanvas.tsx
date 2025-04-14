
import React, { useRef, useEffect, useState } from 'react';
import { CardData } from '@/types/card';
import CardFront from './card-elements/CardFront';
import CardBack from './card-elements/CardBack';
import CardEffectsLayer, { useCardEffects } from './card-elements/CardEffectsLayer';
import RefractorEffect from '@/components/card-effects/RefractorEffect';
import HolographicEffect from '@/components/card-effects/HolographicEffect';
import HolographicEngine from '../card-effects/HolographicEngine';

interface CardCanvasProps {
  card: CardData;
  isFlipped: boolean;
  activeEffects: string[];
  containerRef: React.RefObject<HTMLDivElement>;
  cardRef: React.RefObject<HTMLDivElement>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  effectSettings?: {
    refractorIntensity?: number;
    refractorColors?: string[];
    animationEnabled?: boolean;
    refractorSpeed?: number;
    refractorAngle?: number;
    holographicIntensity?: number;
    holographicPattern?: 'linear' | 'circular' | 'angular' | 'geometric';
    holographicColorMode?: 'rainbow' | 'blue-purple' | 'gold-green' | 'custom';
    holographicCustomColors?: string[];
    holographicSparklesEnabled?: boolean;
    holographicBorderWidth?: number;
  };
}

const CardCanvas: React.FC<CardCanvasProps> = ({
  card,
  isFlipped,
  activeEffects,
  containerRef,
  cardRef,
  onMouseMove,
  onMouseLeave,
  effectSettings = {}
}) => {
  // Use the hook directly instead of trying to access methods on a React component
  const effectsLayer = useCardEffects({ activeEffects, isFlipped });
  const cardElementRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [animationActive, setAnimationActive] = useState(true);
  
  // Extract refractor settings with defaults
  const {
    refractorIntensity = 1.0,
    refractorColors,
    animationEnabled = true,
    refractorSpeed = 1.0,
    refractorAngle,
    holographicIntensity = 0.8,
    holographicPattern = 'linear',
    holographicColorMode = 'rainbow',
    holographicCustomColors,
    holographicSparklesEnabled = true,
    holographicBorderWidth = 1
  } = effectSettings;
  
  // Set CSS variables for mouse position to use in the refractor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardElementRef.current) return;
      
      // Set animation to active when mouse moves
      setAnimationActive(true);
      
      const rect = cardElementRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      cardElementRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
      cardElementRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
      
      setMousePos({ x, y });
    };
    
    // Mouse leave handler to gradually slow down animation
    const handleMouseLeave = () => {
      // Start fading out animation
      setAnimationActive(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Add mouse leave event listener to the card element
    if (cardElementRef.current) {
      cardElementRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (cardElementRef.current) {
        cardElementRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  // Handle touch events for mobile devices
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!cardElementRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const rect = cardElementRef.current.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      
      cardElementRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
      cardElementRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
      
      setMousePos({ x, y });
      setAnimationActive(true);
    };
    
    const handleTouchEnd = () => {
      setAnimationActive(false);
    };
    
    if (cardElementRef.current) {
      cardElementRef.current.addEventListener('touchmove', handleTouchMove);
      cardElementRef.current.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      if (cardElementRef.current) {
        cardElementRef.current.removeEventListener('touchmove', handleTouchMove);
        cardElementRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);
  
  // Check if effects are active
  const hasRefractorEffect = activeEffects.includes('Refractor');
  const hasHolographicEffect = activeEffects.includes('Holographic');
  const hasSpectralEffect = activeEffects.includes('Spectral');
  
  // Create parallax layers for 3D effect
  const renderParallaxLayers = () => {
    if (!hasSpectralEffect) return null;
    
    return (
      <>
        <div className="parallax-layer parallax-layer-1"></div>
        <div className="parallax-layer parallax-layer-2"></div>
        {/* Microtext layer - only on desktop for performance */}
        <div className="microtext-layer hidden md:block">
          {Array(20).fill(0).map((_, i) => (
            <div key={i} style={{ 
              position: 'absolute', 
              top: `${i * 5}%`, 
              left: 0, 
              width: '100%',
              transform: `rotate(${i % 2 === 0 ? 0 : 180}deg)`,
              opacity: 0.1
            }}>
              {Array(100).fill(`card-${card.id}-spectral-`).join(' ')}
            </div>
          ))}
        </div>
      </>
    );
  };
  
  return (
    <div
      ref={cardRef}
      className={`dynamic-card ${effectsLayer.getCardClasses()} ${hasSpectralEffect ? 'spectral-hologram' : ''} ${animationActive ? 'animation-active' : 'animation-slowing'}`}
      style={effectsLayer.getFilterStyle()}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div 
        ref={cardElementRef}
        className="card-inner relative w-full h-full"
      >
        {/* Front face of the card */}
        {!isFlipped && <CardFront card={card} />}
        
        {/* Back face of the card */}
        {isFlipped && <CardBack card={card} />}
        
        {/* Parallax layers for spectral effect */}
        {renderParallaxLayers()}
        
        {/* Dynamic light reflection layer */}
        {hasSpectralEffect && (
          <div 
            className="spectral-hologram-layer" 
            style={{ 
              '--mouse-x': `${mousePos.x * 100}%`, 
              '--mouse-y': `${mousePos.y * 100}%` 
            } as React.CSSProperties}
          ></div>
        )}
        
        {/* Enhanced Refractor WebGL effect overlay */}
        <RefractorEffect 
          isActive={hasRefractorEffect} 
          intensity={refractorIntensity}
          speed={refractorSpeed}
          colors={refractorColors}
          mousePosition={mousePos}
          animationEnabled={animationEnabled}
          angle={refractorAngle}
        />
        
        {/* Holographic effect overlay */}
        <HolographicEffect 
          isActive={hasHolographicEffect}
          intensity={holographicIntensity}
          pattern={holographicPattern}
          colorScheme={holographicColorMode as 'rainbow' | 'blue-purple' | 'gold-green' | 'custom'}
          customColors={holographicCustomColors}
          mousePosition={mousePos}
          animationEnabled={animationEnabled}
          sparklesEnabled={holographicSparklesEnabled}
          borderWidth={holographicBorderWidth}
        />
        
        {/* Advanced Holographic Engine */}
        <HolographicEngine 
          active={hasHolographicEffect}
          intensity={holographicIntensity}
          pattern={holographicPattern as 'linear' | 'circular' | 'angular' | 'geometric'}
          colorMode={holographicColorMode as 'rainbow' | 'blue-purple' | 'gold-green' | 'custom'}
          customColors={holographicCustomColors}
          animated={animationActive}
          microtext={`CARD-${card.id} AUTHENTIC HOLOGRAM `}
          particleCount={hasHolographicEffect ? 25 : 0}
          borderWidth={holographicBorderWidth}
        />
      </div>
    </div>
  );
};

export default CardCanvas;
