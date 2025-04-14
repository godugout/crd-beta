
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
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
  touchImprintAreas = [],
}: CardDisplayProps) => {
  const [flipProgress, setFlipProgress] = useState(0);
  
  // Update flip progress when isFlipped changes for smooth animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipProgress(isFlipped ? 100 : 0);
    }, 50); // Small delay to ensure CSS transition works
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
    
    // Add intensity variables for each effect
    Object.entries(effectIntensities).forEach(([effect, intensity]) => {
      style[`--${effect.toLowerCase()}-intensity`] = intensity.toString();
    });
    
    return style;
  };

  console.log('Active effects in CardDisplay:', activeEffects);
  console.log('Effect classes:', effectClasses);

  return (
    <div 
      className="flex items-center justify-center gap-8 px-8"
      style={{ perspective: '2000px' }}
    >
      <div 
        ref={cardRef}
        className={`relative transition-all duration-700 transform-gpu card-effect preserve-3d`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg) 
            scale(${zoom})
          `,
        }}
      >
        <div className="relative w-72 sm:w-80 md:w-96 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl preserve-3d">
          {/* Front face */}
          <div 
            className={`absolute inset-0 backface-hidden ${!isFlipped ? 'z-10' : 'z-0'}`}
            style={{ transform: 'rotateY(0deg)' }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img 
                src={card.imageUrl} 
                alt={card.title || 'Card'} 
                className="w-full h-full object-cover"
              />
              
              {/* Touch imprint indicators */}
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-3xl ${touchImprintAreas.find(a => a.id === 'flip-corner')?.active ? 'bg-white/30' : 'bg-transparent'}`}>
                <span className="absolute top-3 right-3 text-2xl text-white/80 transform -rotate-45">↺</span>
              </div>
              
              <div className={`absolute left-1/2 top-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full ${touchImprintAreas.find(a => a.id === 'zoom-center')?.active ? 'bg-white/20' : 'bg-transparent'}`}>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-white/80">+</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="font-bold text-xl mb-1">{card.title}</h2>
                {card.player && <p className="text-sm opacity-90">{card.player}</p>}
                {card.team && <p className="text-xs opacity-80">{card.team}</p>}
              </div>
              
              {/* Apply visual effects to front face */}
              {activeEffects.length > 0 && (
                <div 
                  className={`absolute inset-0 pointer-events-none z-10 ${effectClasses}`} 
                  style={generateEffectStyles()}
                ></div>
              )}
            </div>
          </div>

          {/* Back face */}
          <div 
            className={`absolute inset-0 backface-hidden ${isFlipped ? 'z-10' : 'z-0'}`}
            style={{ transform: 'rotateY(180deg)' }}
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
                </div>
              )}
              
              {/* Apply visual effects to back face - slightly different effect */}
              {activeEffects.length > 0 && (
                <div 
                  className={`absolute inset-0 pointer-events-none ${effectClasses.replace('holographic', 'chrome')}`}
                  style={generateEffectStyles()}
                >
                  {/* Holographic elements specific to card back */}
                  {activeEffects.includes('Holographic') && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 mix-blend-overlay"></div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card effects layer - shared by both sides */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Auto-rotation indicator */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent transition-opacity duration-300"
            style={{
              opacity: isAutoRotating ? 0.5 : 0,
              transform: `rotate(${rotation.y}deg)`,
            }}
          />
          
          {/* Light reflection effect that follows mouse */}
          <div 
            className="card-highlight absolute inset-0 pointer-events-none"
            style={{
              '--mouse-x': `${mousePosition.x * 100}%`, 
              '--mouse-y': `${mousePosition.y * 100}%`
            } as React.CSSProperties}
          />
          
          {/* Edge glow effect for when card is being flipped */}
          <div 
            className="flip-indicator absolute inset-0 pointer-events-none"
            style={{ opacity: flipProgress > 0 && flipProgress < 100 ? 0.7 : 0 }}
          />
        </div>
      </div>

      {/* Side view card (desktop only) - shows card back for preview when in back view mode */}
      <div className="relative w-72 sm:w-80 md:w-96 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl hidden md:block scale-75">
        {!isFlipped ? (
          <img 
            src={card.imageUrl} 
            alt={card.title || 'Card Side View'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 p-6 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              {card.title} - Preview
            </h3>
            {card.description && (
              <p className="text-sm mb-4 opacity-90">{card.description}</p>
            )}
            <p className="text-sm opacity-80">Tap to apply changes</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default CardDisplay;
