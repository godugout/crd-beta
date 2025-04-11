
import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { CardDesignState, CardLayer } from './CardCreator';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardPreviewCanvasProps {
  cardData: CardDesignState;
  layers: CardLayer[];
  activeLayerId?: string;
  effectClasses: string;
  onLayerSelect: (id: string) => void;
  onLayerUpdate: (id: string, layer: Partial<CardLayer>) => void;
}

const CardPreviewCanvas = forwardRef<HTMLDivElement, CardPreviewCanvasProps>(
  ({ cardData, layers, activeLayerId, effectClasses, onLayerSelect, onLayerUpdate }, ref) => {
    const [isMoving, setIsMoving] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 3D effect movement - from existing useCardEffects hook
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !containerRef.current) return;
      
      setIsMoving(true);
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const relativeX = (e.clientX - centerX) / (rect.width / 2);
      const relativeY = (e.clientY - centerY) / (rect.height / 2);
      
      setMousePosition({ x: relativeX, y: relativeY });
      
      // Apply 3D rotation effect
      const rotateY = relativeX * 15 * 0.7;
      const rotateX = -relativeY * 15 * 0.7;
      
      cardRef.current.style.transform = 
        `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      
      if (cardRef.current) {
        const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
        const mouseY = ((e.clientY - rect.top) / rect.height) * 100;
        
        cardRef.current.style.setProperty('--mouse-x', `${mouseX}%`);
        cardRef.current.style.setProperty('--mouse-y', `${mouseY}%`);
      }
    };

    const handleMouseLeave = () => {
      if (cardRef.current) {
        setIsMoving(false);
        cardRef.current.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        cardRef.current.style.transform = '';
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transition = '';
          }
        }, 800);
      }
    };
    
    // Function to render a single layer
    const renderLayer = (layer: CardLayer) => {
      if (!layer.visible) return null;
      
      const isActive = layer.id === activeLayerId;
      const layerStyle = {
        position: 'absolute',
        left: `${layer.position.x}%`,
        top: `${layer.position.y}%`,
        zIndex: layer.position.z,
        width: `${layer.size.width}%`,
        height: `${layer.size.height}%`,
        transform: `rotate(${layer.rotation}deg)`,
        opacity: layer.opacity,
      } as React.CSSProperties;
      
      // Render different layer types
      switch (layer.type) {
        case 'image':
          return (
            <motion.div
              className={cn(
                "absolute cursor-move rounded overflow-hidden border-2",
                isActive ? "border-blue-500" : "border-transparent"
              )}
              key={layer.id}
              style={layerStyle}
              drag
              dragMomentum={false}
              onDragStart={() => onLayerSelect(layer.id)}
              onDragEnd={(e, info) => {
                // Calculate new position as percentage of container
                if (containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  const newX = layer.position.x + (info.offset.x / rect.width * 100);
                  const newY = layer.position.y + (info.offset.y / rect.height * 100);
                  onLayerUpdate(layer.id, {
                    position: { ...layer.position, x: newX, y: newY }
                  });
                }
              }}
            >
              <img 
                src={layer.content as string} 
                alt="Layer" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
          
        case 'text':
          return (
            <motion.div
              className={cn(
                "absolute cursor-move",
                isActive ? "border-2 border-blue-500" : ""
              )}
              key={layer.id}
              style={layerStyle}
              drag
              dragMomentum={false}
              onDragStart={() => onLayerSelect(layer.id)}
              onDragEnd={(e, info) => {
                // Calculate new position as percentage of container
                if (containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  const newX = layer.position.x + (info.offset.x / rect.width * 100);
                  const newY = layer.position.y + (info.offset.y / rect.height * 100);
                  onLayerUpdate(layer.id, {
                    position: { ...layer.position, x: newX, y: newY }
                  });
                }
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {layer.content}
              </div>
            </motion.div>
          );
          
        case 'shape':
        case 'decoration':
          return (
            <motion.div
              className={cn(
                "absolute cursor-move",
                isActive ? "border-2 border-blue-500" : ""
              )}
              key={layer.id}
              style={layerStyle}
              drag
              dragMomentum={false}
              onDragStart={() => onLayerSelect(layer.id)}
              onDragEnd={(e, info) => {
                // Calculate new position as percentage of container
                if (containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  const newX = layer.position.x + (info.offset.x / rect.width * 100);
                  const newY = layer.position.y + (info.offset.y / rect.height * 100);
                  onLayerUpdate(layer.id, {
                    position: { ...layer.position, x: newX, y: newY }
                  });
                }
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {layer.content}
              </div>
            </motion.div>
          );
          
        case 'effect':
          return (
            <div
              className="absolute pointer-events-none"
              key={layer.id}
              style={layerStyle}
            >
              <div className="w-full h-full">
                {layer.content}
              </div>
            </div>
          );
            
        default:
          return null;
      }
    };
    
    return (
      <div 
        ref={ref}
        className="w-full h-full flex items-center justify-center"
      >
        <div
          ref={containerRef}
          className="card-3d-container w-80 h-[30rem]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={cardRef}
            className={cn(
              "relative w-full h-full transition-all duration-300 shadow-xl rounded-lg overflow-hidden",
              isMoving ? "mouse-move" : "animation-active",
              effectClasses
            )}
            style={{
              borderRadius: cardData.borderRadius,
              backgroundColor: cardData.backgroundColor
            }}
          >
            {/* Base Card Styling */}
            <div className="absolute inset-0 border-2 rounded-lg" style={{ borderColor: cardData.borderColor }}></div>
            
            {/* Render all layers */}
            {layers.map(renderLayer)}
          </div>
        </div>
      </div>
    );
  }
);

CardPreviewCanvas.displayName = 'CardPreviewCanvas';

export default CardPreviewCanvas;
