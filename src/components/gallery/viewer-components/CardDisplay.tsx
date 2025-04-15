import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { useCardKeyboardNavigation } from '@/hooks/card-interactions/useCardKeyboardNavigation';
import '../../../styles/card-interactions.css';
import '../../../styles/card-effects.css';

interface CardDisplayProps {
  card: Card;
  rotation: { x: number; y: number; rotation?: number };
  isFlipped: boolean;
  zoom: number;
  isDragging?: boolean;
  setIsDragging?: React.Dispatch<React.SetStateAction<boolean>>;
  cardRef?: React.RefObject<HTMLDivElement>;
  containerRef?: React.RefObject<HTMLDivElement>;
  isAutoRotating?: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
  mousePosition: { x: number; y: number };
  touchImprintAreas?: Array<{ id: string; active: boolean }>;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  rotation,
  isFlipped,
  zoom,
  isDragging,
  setIsDragging,
  cardRef,
  containerRef,
  isAutoRotating,
  activeEffects,
  effectIntensities = {},
  mousePosition,
  touchImprintAreas = []
}) => {
  const [flipProgress, setFlipProgress] = useState(0);
  
  // Update flip progress when isFlipped changes for smooth animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipProgress(isFlipped ? 100 : 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [isFlipped]);

  // Generate effect classes based on active effects
  const effectClasses = activeEffects
    .map(effect => `effect-${effect.toLowerCase()}`)
    .join(' ');
  
  // Generate CSS variables for effect intensities
  const generateEffectStyles = () => {
    const style: React.CSSProperties = {
      '--mouse-x': `${mousePosition.x * 100}%`,
      '--mouse-y': `${mousePosition.y * 100}%`,
    } as React.CSSProperties;
    
    Object.entries(effectIntensities).forEach(([effect, intensity]) => {
      if (activeEffects.includes(effect)) {
        style[`--${effect.toLowerCase()}-intensity`] = intensity.toString();
      } else {
        style[`--${effect.toLowerCase()}-intensity`] = "0";
      }
    });
    
    return style;
  };

  const { handleKeyDown } = useCardKeyboardNavigation({
    onFlip: () => setFlipProgress(isFlipped ? 0 : 100),
    onReset: () => {
      // Reset card position
    },
    onZoomIn: () => {
      // Zoom in logic
    },
    onZoomOut: () => {
      // Zoom out logic
    },
    onRotateLeft: () => {
      // Rotate left logic
    },
    onRotateRight: () => {
      // Rotate right logic
    },
    onRotateUp: () => {
      // Rotate up logic
    },
    onRotateDown: () => {
      // Rotate down logic
    },
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Card dimensions and stack settings
  const CARD_THICKNESS = 8; // 8px thickness for each card
  const STACK_GAP = 8; // 8px gap between cards
  const edgeColor = 'var(--edge-color, #e4e4e4)';
  const edgeShadow = 'var(--edge-shadow, rgba(0,0,0,0.2))';

  const renderCard = (zOffset: number, opacity: number = 1) => (
    <div 
      className={`absolute inset-0 transition-all duration-700 transform-gpu card-effect preserve-3d ${effectClasses}`}
      style={{
        transform: `translateZ(${zOffset}px)`,
        opacity
      }}
    >
      {/* Front face */}
      <div 
        className={`absolute inset-0 backface-hidden ${!isFlipped ? 'z-10' : 'z-0'}`}
        aria-hidden={isFlipped}
        style={{ 
          transform: `translateZ(${CARD_THICKNESS / 2}px) rotateY(0deg)`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <img 
            src={card.imageUrl} 
            alt={card.title || 'Card'} 
            className="w-full h-full object-cover"
          />
          
          {/* Card info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h2 className="font-bold text-xl mb-1">{card.title}</h2>
            {card.player && <p className="text-sm opacity-90">{card.player}</p>}
            {card.team && <p className="text-xs opacity-80">{card.team}</p>}
          </div>
        </div>
      </div>

      {/* Back face */}
      <div 
        className={`absolute inset-0 backface-hidden ${isFlipped ? 'z-10' : 'z-0'}`}
        aria-hidden={!isFlipped}
        style={{ 
          transform: `translateZ(${CARD_THICKNESS / 2}px) rotateY(180deg)`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <div className="absolute inset-0 p-6 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            {card.title}
          </h3>
          
          {card.description && (
            <p className="text-sm mb-4 opacity-90">{card.description}</p>
          )}
          
          {/* Card stats */}
          <div className="grid grid-cols-2 gap-3 my-4">
            {card.year && (
              <div className="bg-white/10 backdrop-blur-sm rounded p-2 text-center">
                <span className="text-xs text-blue-300 block">Year</span>
                <span className="text-md font-semibold">{card.year}</span>
              </div>
            )}
            
            {card.designMetadata?.cardMetadata?.cardNumber && (
              <div className="bg-white/10 backdrop-blur-sm rounded p-2 text-center">
                <span className="text-xs text-blue-300 block">Card #</span>
                <span className="text-md font-semibold">
                  {String(card.designMetadata.cardMetadata.cardNumber)}
                </span>
              </div>
            )}
          </div>
          
          {/* Card tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="my-4">
              <p className="text-xs text-blue-300 mb-1">Tags</p>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, index) => (
                  <span key={index} className="bg-white/10 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card edges */}
      <div
        className="absolute w-full"
        aria-hidden="true"
        style={{
          height: `${CARD_THICKNESS}px`,
          transform: `rotateX(90deg) translateZ(${175 - CARD_THICKNESS / 2}px)`,
          backgroundColor: edgeColor,
          boxShadow: `inset 0 1px 2px ${edgeShadow}`
        }}
      />
      <div
        className="absolute w-full"
        aria-hidden="true"
        style={{
          height: `${CARD_THICKNESS}px`,
          transform: `rotateX(-90deg) translateZ(${CARD_THICKNESS / 2}px)`,
          backgroundColor: edgeColor,
          boxShadow: `inset 0 -1px 2px ${edgeShadow}`
        }}
      />
      <div
        className="absolute h-full"
        aria-hidden="true"
        style={{
          width: `${CARD_THICKNESS}px`,
          transform: `rotateY(-90deg) translateZ(${CARD_THICKNESS / 2}px)`,
          backgroundColor: edgeColor,
          boxShadow: `inset 1px 0 2px ${edgeShadow}`
        }}
      />
      <div
        className="absolute h-full"
        aria-hidden="true"
        style={{
          width: `${CARD_THICKNESS}px`,
          transform: `rotateY(90deg) translateZ(${125 - CARD_THICKNESS / 2}px)`,
          backgroundColor: edgeColor,
          boxShadow: `inset -1px 0 2px ${edgeShadow}`
        }}
      />
    </div>
  );

  return (
    <div 
      className="flex items-center justify-center gap-8 px-8"
      style={{ perspective: '2000px' }}
    >
      <div 
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`${card.title} trading card. Press F to flip, arrow keys to rotate, plus and minus to zoom.`}
        aria-pressed={isFlipped}
        className="relative transition-all duration-700 transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg) 
            scale(${zoom})
          `,
          ...generateEffectStyles()
        }}
      >
        {/* Bottom card (slightly darker) */}
        {renderCard(-STACK_GAP, 0.95)}
        
        {/* Top card */}
        {renderCard(0)}
      </div>

      {/* Accessibility description */}
      <div className="sr-only">
        <p>Use keyboard controls to interact with the card:</p>
        <ul>
          <li>Press F to flip the card</li>
          <li>Use arrow keys to rotate</li>
          <li>Press + to zoom in</li>
          <li>Press - to zoom out</li>
          <li>Press R to reset position</li>
        </ul>
      </div>
    </div>
  );
};

export default CardDisplay;
