
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
  // Calculate card thickness based on the active effects
  const getCardThickness = () => {
    const baseThickness = '12px'; // Start with a thicker card
    
    // Add more thickness for premium effects
    if (activeEffects.includes('Refractor') || activeEffects.includes('Holographic')) {
      return '16px'; 
    }
    
    return baseThickness;
  };
  
  // Function to generate edge styles
  const getEdgeStyles = () => {
    // Base color for edges
    let edgeColor = '#9b87f5'; // Primary purple
    
    if (activeEffects.includes('Refractor')) {
      edgeColor = '#0EA5E9'; // Ocean blue
    } else if (activeEffects.includes('Holographic')) {
      edgeColor = '#D946EF'; // Magenta pink
    } else if (activeEffects.includes('Gold Foil')) {
      edgeColor = '#F97316'; // Bright orange
    }
    
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      borderStyle: 'solid',
      borderWidth: '0px',
      borderColor: edgeColor,
      borderRadius: '12px',
      transformStyle: 'preserve-3d',
      boxShadow: `0 0 8px ${edgeColor}33` // Add a subtle glow
    };
  };
  
  // Structure for a 3D card with visible edges
  return (
    <div
      ref={cardRef}
      className="dynamic-card"
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'visible', // Changed from hidden to visible for edges
        transformStyle: 'preserve-3d',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Card with thickness */}
      <div 
        className="card-inner relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateZ(0)`
        }}
      >
        {/* Front face */}
        <div 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg) translateZ(0)',
            zIndex: 2
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
            transform: 'rotateY(180deg) translateZ(0)',
            zIndex: 2
          }}
        >
          <CardBack card={card} />
        </div>

        {/* Card edges - these create the visible thickness */}
        <div className="card-edges" style={getEdgeStyles()}>
          {/* Top edge */}
          <div 
            style={{ 
              position: 'absolute', 
              width: '100%', 
              height: getCardThickness(),
              transform: `rotateX(90deg) translateZ(calc(-${getCardThickness()}/2))`,
              top: `-${getCardThickness()}/2`,
              backgroundColor: getEdgeStyles().borderColor,
              opacity: 0.95
            }}
          />
          
          {/* Bottom edge */}
          <div 
            style={{ 
              position: 'absolute', 
              width: '100%', 
              height: getCardThickness(),
              transform: `rotateX(90deg) translateZ(calc(100% - ${getCardThickness()}/2))`,
              bottom: `-${getCardThickness()}/2`,
              backgroundColor: getEdgeStyles().borderColor,
              opacity: 0.95
            }}
          />
          
          {/* Left edge */}
          <div 
            style={{ 
              position: 'absolute', 
              width: getCardThickness(),
              height: '100%',
              transform: `rotateY(90deg) translateZ(calc(-${getCardThickness()}/2))`,
              left: `-${getCardThickness()}/2`,
              backgroundColor: getEdgeStyles().borderColor,
              opacity: 0.95
            }}
          />
          
          {/* Right edge */}
          <div 
            style={{ 
              position: 'absolute', 
              width: getCardThickness(),
              height: '100%',
              transform: `rotateY(90deg) translateZ(calc(100% - ${getCardThickness()}/2))`,
              right: `-${getCardThickness()}/2`,
              backgroundColor: getEdgeStyles().borderColor,
              opacity: 0.95
            }}
          />
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
