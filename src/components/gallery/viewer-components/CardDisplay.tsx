
import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/lib/types/card';
import { motion, AnimatePresence } from 'framer-motion';

interface CardDisplayProps {
  card: Card;
  rotation: { x: number; y: number };
  isFlipped: boolean;
  zoom: number;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  cardRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isAutoRotating: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  mousePosition: { x: number; y: number };
  touchImprintAreas: { id: string; active: boolean }[];
  showExplodedView?: boolean;
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
  showExplodedView = false
}) => {
  const [flipping, setFlipping] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStartPosition = useRef({ x: 0, y: 0 });
  const [autoRotateTimer, setAutoRotateTimer] = useState(0);
  const [cardLayers, setCardLayers] = useState<string[]>([]);

  useEffect(() => {
    // Generate card layers based on active effects
    const baseLayers = ['base', 'image', 'text', 'border'];
    
    // Add special effect layers
    const effectLayers: string[] = [];
    
    if (activeEffects.includes('Holographic')) {
      effectLayers.push('holographic-overlay');
    }
    
    if (activeEffects.includes('Refractor')) {
      effectLayers.push('refractor-pattern');
    }
    
    if (activeEffects.includes('Chrome')) {
      effectLayers.push('chrome-finish');
    }
    
    if (activeEffects.includes('Vintage')) {
      effectLayers.push('vintage-texture');
    }
    
    setCardLayers([...baseLayers, ...effectLayers]);
  }, [activeEffects]);

  useEffect(() => {
    let timer: number | null = null;
    if (isAutoRotating) {
      timer = window.setInterval(() => {
        setAutoRotateTimer(prev => (prev + 1) % 360);
      }, 50);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoRotating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setIsDragging(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      dragStartPosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Calculate positions for exploded view
  const getExplodedPosition = (layerIndex: number, totalLayers: number) => {
    if (!showExplodedView) return { x: 0, y: 0, z: 0, opacity: 1 };
    
    const baseOffset = 30; // Base offset for each layer
    const rotationFactor = 5; // Degrees of rotation per layer
    
    // Calculate offset based on layer position
    const middleLayer = Math.floor(totalLayers / 2);
    const distanceFromMiddle = layerIndex - middleLayer;
    
    // Different positioning for different layer types
    const isBorder = layerIndex === 3; // border is index 3
    const isEffect = layerIndex >= 4; // effects start at index 4
    
    let x = 0;
    let y = 0;
    let z = distanceFromMiddle * baseOffset;
    let scale = 1;
    
    if (isBorder) {
      scale = 1.05;
    } else if (isEffect) {
      // Special effects have more dramatic positioning
      scale = 1.1 + (layerIndex - 4) * 0.05;
      const angle = ((layerIndex - 4) * 60) % 360; // distribute around a circle
      x += Math.cos(angle * Math.PI / 180) * 20;
      y += Math.sin(angle * Math.PI / 180) * 20;
    }
    
    return {
      x: x,
      y: y,
      z: z,
      opacity: 1,
      scale: scale,
      rotateX: distanceFromMiddle * rotationFactor,
      rotateY: distanceFromMiddle * rotationFactor,
    };
  };

  // Colors for different layers in exploded view
  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'base': return '#2F2F2F';
      case 'image': return '#FFFFFF';
      case 'text': return '#F0F0F0';
      case 'border': return '#4F4F4F';
      case 'holographic-overlay': return 'linear-gradient(135deg, #83f7ff, #7745FF, #FF45E2)';
      case 'refractor-pattern': return 'linear-gradient(45deg, #3D5AFE, #00B0FF)';
      case 'chrome-finish': return 'linear-gradient(to bottom, #DEDEDE, #8C8C8C)';
      case 'vintage-texture': return '#D4C19C';
      default: return '#FFFFFF';
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`card-display relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      style={{
        transform: isAutoRotating 
          ? `rotateY(${autoRotateTimer}deg) perspective(1000px)` 
          : `rotateX(${rotation.y}deg) rotateY(${rotation.x}deg) scale(${zoom}) perspective(1000px)`,
        transformStyle: 'preserve-3d',
        transition: isDragging || isAutoRotating ? 'none' : 'transform 0.3s ease'
      }}
    >
      {/* Exploded View Animation */}
      <AnimatePresence>
        {showExplodedView ? (
          cardLayers.map((layer, index) => (
            <motion.div
              key={layer}
              className="absolute inset-0 rounded-xl shadow-xl"
              initial={{ x: 0, y: 0, z: 0, opacity: 0, scale: 0.8 }}
              animate={getExplodedPosition(index, cardLayers.length)}
              exit={{ x: 0, y: 0, z: 0, opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: index * 0.1
              }}
              style={{
                width: '300px',
                height: '420px',
                background: getLayerColor(layer),
                transformStyle: 'preserve-3d',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                zIndex: 10 + index,
                willChange: 'transform',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div className="text-white text-xs uppercase tracking-wider font-semibold">
                {layer.replace('-', ' ')}
              </div>
            </motion.div>
          ))
        ) : null}
      </AnimatePresence>

      {/* Original Card */}
      <div 
        className={`card-container ${flipping ? 'flipping' : ''} ${isFlipped ? 'flipped' : ''}`}
        style={{
          width: '300px',
          height: '420px',
          perspective: '1000px',
          visibility: showExplodedView ? 'hidden' : 'visible'
        }}
      >
        <div 
          className="card-inner" 
          style={{ 
            position: 'relative',
            width: '100%', 
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Card Front */}
          <div 
            className={`absolute inset-0 rounded-xl overflow-hidden backface-hidden flex items-center justify-center bg-gradient-to-br from-gray-800 to-black`}
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)'
            }}
          >
            {/* Card Image */}
            <div 
              className="relative w-full h-full rounded-xl overflow-hidden"
              style={{
                filter: activeEffects.includes('Vintage') 
                  ? `sepia(${effectIntensities.Vintage || 0.5}) contrast(1.1)` 
                  : 'none'
              }}
            >
              <img 
                src={card.imageUrl || '/images/card-placeholder.png'} 
                alt={card.title || 'Card'} 
                className="w-full h-full object-cover"
                style={{
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                }}
              />
              
              {/* Effect Overlays */}
              {activeEffects.includes('Holographic') && (
                <div 
                  className="absolute inset-0 holo-effect"
                  style={{
                    background: `linear-gradient(${mousePosition.x * 360}deg, rgba(255,255,255,0.2), rgba(120,70,255,0.4), rgba(70,195,255,0.2))`,
                    opacity: effectIntensities.Holographic || 0.7,
                    mixBlendMode: 'overlay',
                  }}
                />
              )}
              
              {activeEffects.includes('Refractor') && (
                <div 
                  className="absolute inset-0 refractor-effect" 
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.9), transparent 70%)`,
                    opacity: effectIntensities.Refractor || 0.8,
                    mixBlendMode: 'soft-light',
                  }}
                />
              )}
              
              {activeEffects.includes('Chrome') && (
                <div 
                  className="absolute inset-0 chrome-effect" 
                  style={{
                    background: `linear-gradient(${135 + mousePosition.x * 90}deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.3) 60%, rgba(255,255,255,0.4) 100%)`,
                    opacity: effectIntensities.Chrome || 0.6,
                    mixBlendMode: 'overlay',
                  }}
                />
              )}
              
              {/* Card Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                <h3 className="font-bold text-lg">{card.title || 'Card Title'}</h3>
                <p className="text-sm opacity-80">{card.team || card.set || 'Card Details'}</p>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div 
            className={`absolute inset-0 rounded-xl overflow-hidden backface-hidden bg-gradient-to-br from-gray-800 to-gray-900`}
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <img 
              src="/images/card-back-placeholder.png"
              alt="Card Back" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
