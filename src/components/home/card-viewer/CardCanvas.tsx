
import React, { useRef, useEffect, useState } from 'react';
import { CardData } from '@/types/card';
import CardFront from './card-elements/CardFront';
import CardBack from './card-elements/CardBack';
import CardEffectsLayer, { useCardEffects } from './card-elements/CardEffectsLayer';
import RefractorEffect from '../card-effects/RefractorEffect';
import HolographicEngine from '../card-effects/HolographicEngine';

interface CardCanvasProps {
  card: CardData;
  isFlipped: boolean;
  activeEffects: string[];
  containerRef: React.RefObject<HTMLDivElement>;
  cardRef: React.RefObject<HTMLDivElement>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({
  card,
  isFlipped,
  activeEffects,
  containerRef,
  cardRef,
  onMouseMove,
  onMouseLeave
}) => {
  // Use the hook directly instead of trying to access methods on a React component
  const effectsLayer = useCardEffects({ activeEffects, isFlipped });
  const cardElementRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });
  
  // Set CSS variables for mouse position to use in the refractor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardElementRef.current) return;
      
      const rect = cardElementRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      cardElementRef.current.style.setProperty('--mouse-x', `${x}%`);
      cardElementRef.current.style.setProperty('--mouse-y', `${y}%`);
      
      setMousePos({ x: `${x}%`, y: `${y}%` });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Check if effects are active
  const hasRefractorEffect = activeEffects.includes('Refractor');
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
      className={`dynamic-card ${effectsLayer.getCardClasses()} ${hasSpectralEffect ? 'spectral-hologram' : ''}`}
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
              '--mouse-x': mousePos.x, 
              '--mouse-y': mousePos.y 
            } as React.CSSProperties}
          ></div>
        )}
        
        {/* Refractor WebGL effect overlay */}
        <RefractorEffect 
          active={hasRefractorEffect} 
          intensity={1.0}
          animated={true}
        />
        
        {/* Advanced Holographic Engine */}
        <HolographicEngine 
          active={hasSpectralEffect}
          intensity={0.7}
          colorMode="rainbow"
          animated={true}
          microtext={`CARD-${card.id} AUTHENTIC HOLOGRAM `}
          particleCount={hasSpectralEffect ? 50 : 0}
        />
      </div>
    </div>
  );
};

export default CardCanvas;
