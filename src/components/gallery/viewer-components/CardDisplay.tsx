
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

  // Cube dimensions
  const CUBE_SIZE = 250; // Base size of cube in px

  return (
    <div 
      className="flex items-center justify-center gap-8 px-8"
      style={{ perspective: '2000px' }}
    >
      <div 
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={`${card.title} trading card cube. Press F to flip, arrow keys to rotate, plus and minus to zoom.`}
        className="relative transition-all duration-700 transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg) 
            scale(${zoom})
          `,
          width: `${CUBE_SIZE}px`, 
          height: `${CUBE_SIZE}px`,
          ...generateEffectStyles()
        }}
      >
        {/* Front face */}
        <div 
          className={`absolute backface-hidden ${effectClasses}`}
          style={{ 
            width: `${CUBE_SIZE}px`, 
            height: `${CUBE_SIZE}px`,
            transform: `translateZ(${CUBE_SIZE / 2}px)`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <div className="relative w-full h-full overflow-hidden">
            <img 
              src={card.imageUrl} 
              alt={card.title || 'Card front'} 
              className="w-full h-full object-cover"
            />
            
            {/* Card info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
              <h2 className="font-bold text-xl mb-1">{card.title}</h2>
              {card.player && <p className="text-sm opacity-90">{card.player}</p>}
            </div>
          </div>
        </div>

        {/* Right face */}
        <div 
          className={`absolute backface-hidden ${effectClasses}`}
          style={{ 
            width: `${CUBE_SIZE}px`, 
            height: `${CUBE_SIZE}px`,
            transform: `rotateY(90deg) translateZ(${CUBE_SIZE / 2}px)`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <div className="relative w-full h-full overflow-hidden bg-gray-800">
            <img 
              src={card.thumbnailUrl || card.imageUrl} 
              alt={card.title || 'Card side'} 
              className="w-full h-full object-cover opacity-70"
              style={{ filter: 'grayscale(50%)' }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="text-white text-xl font-bold">{card.team || 'Side View'}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Top face */}
        <div 
          className={`absolute backface-hidden ${effectClasses}`}
          style={{ 
            width: `${CUBE_SIZE}px`, 
            height: `${CUBE_SIZE}px`,
            transform: `rotateX(90deg) translateZ(${CUBE_SIZE / 2}px)`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <div className="relative w-full h-full overflow-hidden bg-gray-900">
            <img 
              src={card.imageUrl} 
              alt={card.title || 'Card top'} 
              className="w-full h-full object-cover opacity-60"
              style={{ filter: 'hue-rotate(45deg) contrast(1.2)' }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg">
                <h3 className="text-white text-xl font-bold">{card.year || 'Top View'}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Back face (solid color) */}
        <div 
          className="absolute backface-hidden bg-gray-700"
          style={{ 
            width: `${CUBE_SIZE}px`, 
            height: `${CUBE_SIZE}px`,
            transform: `rotateY(180deg) translateZ(${CUBE_SIZE / 2}px)`,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-xl">Back</div>
          </div>
        </div>

        {/* Bottom face (solid color) */}
        <div 
          className="absolute backface-hidden bg-gray-800"
          style={{ 
            width: `${CUBE_SIZE}px`, 
            height: `${CUBE_SIZE}px`,
            transform: `rotateX(-90deg) translateZ(${CUBE_SIZE / 2}px)`,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-xl">Bottom</div>
          </div>
        </div>

        {/* Left face (solid color) */}
        <div 
          className="absolute backface-hidden bg-gray-900"
          style={{ 
            width: `${CUBE_SIZE}px`, 
            height: `${CUBE_SIZE}px`,
            transform: `rotateY(-90deg) translateZ(${CUBE_SIZE / 2}px)`,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-xl">Left</div>
          </div>
        </div>
      </div>

      {/* Accessibility description */}
      <div className="sr-only">
        <p>Use keyboard controls to interact with the cube:</p>
        <ul>
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
