
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
  // Debug mode to help troubleshoot rendering issues
  debug?: boolean;
}

const CardCanvas: React.FC<CardCanvasProps> = ({
  card,
  isFlipped,
  activeEffects,
  containerRef,
  cardRef,
  onMouseMove,
  onMouseLeave,
  effectSettings = {},
  debug = false
}) => {
  // Simplified component with better structure for effects
  return (
    <div
      ref={cardRef}
      className="dynamic-card"
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div 
        className="card-inner relative w-full h-full"
      >
        {/* Front face */}
        <div 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          <CardFront card={card} activeEffects={activeEffects} />
        </div>
        
        {/* Back face */}
        <div 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <CardBack card={card} />
        </div>

        {/* Debug overlay */}
        {debug && (
          <div style={{ 
            position: 'absolute', 
            top: '5px', 
            left: '5px', 
            zIndex: 1000,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            fontSize: '10px',
            borderRadius: '3px',
            pointerEvents: 'none'
          }}>
            Image: {card.imageUrl ? '✓' : '✗'}<br/>
            Effects: {activeEffects.join(', ') || 'None'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardCanvas;
