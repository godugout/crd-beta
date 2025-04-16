
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/lib/types';
import { LightingSettings } from '@/hooks/useCardLighting';

interface CardDisplayProps {
  card: Card;
  rotation: { x: number; y: number };
  isFlipped: boolean;
  zoom: number;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  cardRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isAutoRotating: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  mousePosition: { x: number; y: number };
  touchImprintAreas: Array<{ id: string; active: boolean }>;
  showExplodedView: boolean;
  lightingSettings?: LightingSettings;
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
  effectIntensities,
  mousePosition,
  touchImprintAreas,
  showExplodedView,
  lightingSettings
}) => {
  const cardInnerRef = useRef<HTMLDivElement>(null);
  
  // Apply lighting settings to card element
  useEffect(() => {
    if (cardInnerRef.current && lightingSettings) {
      const environmentClass = `environment-${lightingSettings.environmentType}`;
      
      // Remove any existing environment classes
      Object.keys(LIGHTING_PRESETS).forEach(preset => {
        cardInnerRef.current?.classList.remove(`environment-${preset}`);
      });
      
      // Add current environment class
      cardInnerRef.current.classList.add(environmentClass);
    }
  }, [lightingSettings]);
  
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
  
  // Define exploded view layers and their offsets
  const layerBaseOffset = 20; // Base offset for exploded view layers
  const layers = [
    { name: 'base', offset: 0, zIndex: 1 },
    { name: 'mid', offset: layerBaseOffset, zIndex: 2 },
    { name: 'top', offset: layerBaseOffset * 2, zIndex: 3 },
  ];
  
  return (
    <div
      ref={cardRef}
      className="relative select-none"
      onMouseDown={handleDragStart}
      style={{
        transform: `scale(${zoom})`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <motion.div
        animate={{
          rotateY: rotation.y,
          rotateX: -rotation.x,
          scale: showExplodedView ? 0.9 : 1
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 100,
          duration: 0.3
        }}
        className="preserve-3d"
      >
        {/* Exploded view layers */}
        {showExplodedView ? (
          layers.map((layer) => (
            <div
              key={layer.name}
              className="absolute inset-0"
              style={{
                transform: `translateZ(${layer.offset}px)`,
                zIndex: layer.zIndex
              }}
            >
              <div
                ref={layer.name === 'base' ? cardInnerRef : undefined}
                className={`w-80 h-120 rounded-xl overflow-hidden shadow-xl card-with-lighting ${
                  activeEffects.map(effect => `effect-${effect.toLowerCase()}`).join(' ')
                }`}
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.6s',
                  backfaceVisibility: 'hidden'
                }}
              >
                <img
                  src={card.imageUrl || fallbackImage}
                  alt={card.title || 'Card'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                />
                
                {/* Layer-specific effects */}
                {layer.name === 'top' && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                      opacity: isDragging ? 0.8 : 0.4
                    }}
                  />
                )}
                
                {/* Effect overlays */}
                {activeEffects.map(effect => (
                  <div
                    key={`${layer.name}-${effect}`}
                    className={`absolute inset-0 effect-overlay-${effect.toLowerCase()}`}
                    style={{
                      opacity: effectIntensities[effect] || 0.5,
                    }}
                  />
                ))}

                {/* Dynamic lighting overlay */}
                <div className="absolute inset-0 lighting-overlay"></div>
              </div>
            </div>
          ))
        ) : (
          // Standard view
          <div
            ref={cardInnerRef}
            className={`w-80 h-120 rounded-xl overflow-hidden shadow-xl card-with-lighting ${
              activeEffects.map(effect => `effect-${effect.toLowerCase()}`).join(' ')
            }`}
            style={{
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s',
              backfaceVisibility: 'hidden'
            }}
          >
            <img
              src={card.imageUrl || fallbackImage}
              alt={card.title || 'Card'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />
            
            {/* Highlight effect for mouse interaction */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                opacity: isDragging ? 0.8 : 0.4
              }}
            />
            
            {/* Effect overlays */}
            {activeEffects.map(effect => (
              <div
                key={effect}
                className={`absolute inset-0 effect-overlay-${effect.toLowerCase()}`}
                style={{
                  opacity: effectIntensities[effect] || 0.5,
                }}
              />
            ))}

            {/* Dynamic lighting overlay */}
            <div className="absolute inset-0 lighting-overlay"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Needed to reference in the component
const LIGHTING_PRESETS = {
  display_case: 'display_case',
  natural: 'natural',
  dramatic: 'dramatic',
  studio: 'studio'
};

export default CardDisplay;
