import React, { useRef, useState } from 'react';
import { CardData } from '@/types/card';
import CardFront from './card-elements/CardFront';
import CardBack from './card-elements/CardBack';
import CardEdges from './card-elements/CardEdges';

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
  // Calculate card thickness based on the active effects
  const getCardThickness = () => {
    const baseThickness = '12px'; // Start with a thicker card
    
    // Add more thickness for premium effects
    if (activeEffects.includes('Refractor') || activeEffects.includes('Holographic')) {
      return '16px'; 
    }
    
    return baseThickness;
  };
  
  // Function to determine edge color
  const getEdgeColor = () => {
    // Base color for edges
    let edgeColor = '#9b87f5'; // Primary purple
    
    if (activeEffects.includes('Refractor')) {
      edgeColor = '#0EA5E9'; // Ocean blue
    } else if (activeEffects.includes('Holographic')) {
      edgeColor = '#D946EF'; // Magenta pink
    } else if (activeEffects.includes('Gold Foil')) {
      edgeColor = '#F97316'; // Bright orange
    }
    
    return edgeColor;
  };

  return (
    <div
      ref={cardRef}
      className="dynamic-card"
      style={{ 
        position: 'relative' as const,
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'visible',
        transformStyle: 'preserve-3d' as const,
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div 
        className="card-inner relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d' as const,
          transform: `translateZ(0)`
        }}
      >
        {/* Front face */}
        <div 
          style={{ 
            position: 'absolute' as const, 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden' as const,
            transform: 'rotateY(0deg) translateZ(0)',
            zIndex: 2
          }}
        >
          <CardFront card={card} activeEffects={activeEffects} />
        </div>
        
        {/* Back face */}
        <div 
          style={{ 
            position: 'absolute' as const, 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden' as const,
            transform: 'rotateY(180deg) translateZ(0)',
            zIndex: 2
          }}
        >
          <CardBack card={card} />
        </div>

        {/* Card edges */}
        <CardEdges 
          edgeColor={getEdgeColor()} 
          thickness={getCardThickness()} 
        />

        {/* Debug overlay */}
        {debug && (
          <div style={{ 
            position: 'absolute' as const, 
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
