
import React, { useRef, useState } from 'react';
import { CardData } from '@/types/card';
import CardFront from './card-elements/CardFront';
import CardBack from './card-elements/CardBack';

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
  const cardElementRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [animationActive, setAnimationActive] = useState(true);
  
  // Check if effects are active
  const hasRefractorEffect = activeEffects.includes('Refractor');
  const hasHolographicEffect = activeEffects.includes('Holographic');
  const hasSpectralEffect = activeEffects.includes('Spectral');
  
  return (
    <div
      ref={cardRef}
      className={`dynamic-card ${animationActive ? 'animation-active' : 'animation-slowing'}`}
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div 
        ref={cardElementRef}
        className="card-inner relative w-full h-full"
      >
        {/* Ensure card faces are at the top of the stacking context */}
        <div style={{ position: 'relative', zIndex: 20, width: '100%', height: '100%' }}>
          {/* Front face of the card */}
          {!isFlipped && <CardFront card={card} activeEffects={activeEffects} />}
          
          {/* Back face of the card */}
          {isFlipped && <CardBack card={card} />}
        </div>

        {/* Debug overlay to confirm card image is loading - this is temporary and can be removed later */}
        <div style={{ 
          position: 'absolute', 
          top: '5px', 
          left: '5px', 
          zIndex: 100,
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '2px 5px',
          fontSize: '10px',
          borderRadius: '3px',
          display: 'none' // Set to 'block' to show debug info
        }}>
          Image: {card.imageUrl ? '✓' : '✗'}
        </div>
      </div>
    </div>
  );
};

export default CardCanvas;
