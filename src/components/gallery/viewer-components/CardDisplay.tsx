
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import '../../card-effects/effects.css';
import '../../../styles/card-interactions.css';

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
}

const CardDisplay = ({
  card,
  rotation,
  isFlipped,
  zoom,
  isDragging,
  setIsDragging,
  cardRef,
  containerRef,
  isAutoRotating,
}: CardDisplayProps) => {
  const [activeEffects, setActiveEffects] = useState<string[]>(['Refractor', 'Holographic']);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [flipProgress, setFlipProgress] = useState(0);
  
  // Update flip progress when isFlipped changes for smooth animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipProgress(isFlipped ? 100 : 0);
    }, 50); // Small delay to ensure CSS transition works
    return () => clearTimeout(timer);
  }, [isFlipped]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef?.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  // Generate effect classes based on active effects
  const effectClasses = activeEffects
    .map(effect => `effect-${effect.toLowerCase()}`)
    .join(' ');
  
  return (
    <div 
      className="flex items-center justify-center gap-8 px-8"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div 
        ref={cardRef}
        className="relative transition-all duration-700 transform-gpu card-effect preserve-3d"
        style={{
          transformStyle: 'preserve-3d',
          transform: `
            perspective(1000px) 
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y + (isFlipped ? 180 : 0)}deg) 
            scale(${zoom})
          `,
        }}
      >
        <div className="relative w-72 sm:w-80 md:w-96 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl preserve-3d">
          {/* Front face */}
          <div 
            className="absolute inset-0 backface-hidden"
            style={{ transform: 'rotateY(0deg)' }}
          >
            <img 
              src={card.imageUrl} 
              alt={card.title || 'Card'} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h2 className="font-bold text-xl mb-1">{card.title}</h2>
              {card.player && <p className="text-sm opacity-90">{card.player}</p>}
              {card.team && <p className="text-xs opacity-80">{card.team}</p>}
            </div>
            
            {/* Apply visual effects to front face */}
            <div className={`absolute inset-0 pointer-events-none ${effectClasses}`}
                 style={{
                   '--mouse-x': `${mousePosition.x * 100}%`,
                   '--mouse-y': `${mousePosition.y * 100}%`,
                   '--holographic-intensity': '0.8',
                   '--refractor-intensity': '1.0'
                 } as React.CSSProperties}>
            </div>
          </div>

          {/* Back face */}
          <div 
            className="absolute inset-0 backface-hidden bg-gray-900"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="absolute inset-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-4">{card.title}</h3>
              {card.description && (
                <p className="text-sm mb-4 opacity-90">{card.description}</p>
              )}
              <div className="mt-auto">
                {card.year && (
                  <p className="text-sm opacity-80">Year: {card.year}</p>
                )}
                {/* Fix the cardNumber access by ensuring it's properly converted to string */}
                {card.designMetadata?.cardMetadata?.cardNumber && (
                  <p className="text-sm opacity-80">
                    Card #: {String(card.designMetadata.cardMetadata.cardNumber)}
                  </p>
                )}
              </div>
            </div>
            
            {/* Apply visual effects to back face - slightly different effect */}
            <div className={`absolute inset-0 pointer-events-none ${effectClasses.replace('holographic', 'chrome')}`}
                 style={{
                   '--mouse-x': `${mousePosition.x * 100}%`,
                   '--mouse-y': `${mousePosition.y * 100}%`,
                   '--refractor-intensity': '0.7',
                   '--chrome-intensity': '0.9'
                 } as React.CSSProperties}>
            </div>
          </div>
        </div>

        {/* Card effects layer - shared by both sides */}
        <div className="absolute inset-0 pointer-events-none">
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

      {/* Side view card (desktop only) */}
      <div className="relative w-72 sm:w-80 md:w-96 aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-2xl hidden md:block">
        <img 
          src={card.imageUrl} 
          alt={card.title || 'Card Side View'} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default CardDisplay;
