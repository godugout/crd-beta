
import React, { useRef, useState } from 'react';
import { CardData } from '@/types/card';

interface CardFrontProps {
  card: CardData;
  effectClasses: string;
}

const CardFront: React.FC<CardFrontProps> = ({ card, effectClasses }) => {
  return (
    <div className={`card-front absolute inset-0 w-full h-full ${effectClasses}`} style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
    }}>
      <img 
        src={card.imageUrl} 
        alt={card.title} 
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
        <h3 className="text-lg font-bold">{card.title}</h3>
        {card.description && <p className="text-sm opacity-80">{card.description}</p>}
      </div>
    </div>
  );
};

interface CardBackProps {
  card: CardData;
}

const CardBack: React.FC<CardBackProps> = ({ card }) => {
  return (
    <div className="card-back absolute inset-0 w-full h-full bg-gray-100 rounded-lg p-6" style={{
      backfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)',
      transformStyle: 'preserve-3d',
    }}>
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold mb-3">{card.title}</h3>
        <p className="mb-4 text-sm">{card.description || 'No description available'}</p>
        
        {card.player && (
          <div className="mb-2">
            <span className="font-medium">Player:</span> {card.player}
          </div>
        )}
        
        {card.team && (
          <div className="mb-2">
            <span className="font-medium">Team:</span> {card.team}
          </div>
        )}
        
        {card.year && (
          <div className="mb-2">
            <span className="font-medium">Year:</span> {card.year}
          </div>
        )}
        
        {card.tags && card.tags.length > 0 && (
          <div className="mt-auto pt-4">
            <div className="font-medium mb-2">Tags:</div>
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CardEdgesProps {
  color: string;
  thickness: string;
}

const CardEdges: React.FC<CardEdgesProps> = ({ color, thickness }) => {
  return (
    <div className="card-edges absolute" style={{
      left: `-${thickness}`,
      right: `-${thickness}`,
      top: `-${thickness}`,
      bottom: `-${thickness}`,
      background: color,
      borderRadius: 'calc(0.5rem + 2px)',
      zIndex: -1,
    }} />
  );
};

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
    // Brighter colors for better visibility
    let edgeColor = '#b09dff'; // Brighter purple
    
    if (activeEffects.includes('Refractor')) {
      edgeColor = '#25c4ff'; // Brighter blue
    } else if (activeEffects.includes('Holographic')) {
      edgeColor = '#ff5af7'; // Brighter pink
    } else if (activeEffects.includes('Gold Foil')) {
      edgeColor = '#ffd700'; // Gold
    }
    
    return edgeColor;
  };

  // Build effect classes
  const getEffectClasses = () => {
    let classes = [];
    
    if (activeEffects.includes('Refractor')) {
      classes.push('refractor-effect');
      if (effectSettings.animationEnabled) classes.push('refractor-animated');
    }
    
    if (activeEffects.includes('Holographic')) {
      classes.push('holographic-effect');
    }
    
    if (activeEffects.includes('Gold Foil')) {
      classes.push('gold-foil-effect');
    }
    
    return classes.join(' ');
  };

  const thickness = getCardThickness();
  const edgeColor = getEdgeColor();
  const effectClasses = getEffectClasses();

  return (
    <div 
      ref={cardRef}
      className="card-container relative mx-auto"
      style={{
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <CardFront card={card} effectClasses={effectClasses} />
      <CardBack card={card} />
      <CardEdges color={edgeColor} thickness={thickness} />
    </div>
  );
};

export default CardCanvas;
