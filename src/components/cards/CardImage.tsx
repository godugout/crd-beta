
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useCardPhysics } from '@/hooks/useCardPhysics';

interface CardImageProps {
  /**
   * Card data to display
   */
  card: Card;
  
  /**
   * Optional className for styling
   */
  className?: string;
  
  /**
   * Whether this card should be flippable
   * @default true
   */
  flippable?: boolean;
  
  /**
   * Whether to enable 3D effects
   * @default true
   */
  enable3D?: boolean;
  
  /**
   * Whether to automatically rotate the card
   * @default false
   */
  autoRotate?: boolean;
  
  /**
   * Callback when card is flipped
   */
  onFlip?: (isFlipped: boolean) => void;
}

export const CardImage: React.FC<CardImageProps> = ({
  card,
  className,
  flippable = true,
  enable3D = true,
  autoRotate = false,
  onFlip
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  
  // Use our physics engine for smooth movement
  const physics = useCardPhysics({
    dampingFactor: 0.96,
    rotationDampingFactor: 0.94,
    sensitivity: 0.12,
    autoRotate
  });

  // Measure container size for proper 3D perspective
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width, height });
    };
    
    updateDimensions();
    
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  // Handle card flip
  const handleCardClick = (e: React.MouseEvent) => {
    if (!flippable) return;
    
    // Don't flip if the card is moving too fast
    const isMovingTooFast = 
      Math.abs(physics.velocity.x) > 3 || 
      Math.abs(physics.velocity.y) > 3;
    
    if (isMovingTooFast) return;
    
    setIsFlipped(prev => {
      const newFlipped = !prev;
      if (onFlip) onFlip(newFlipped);
      return newFlipped;
    });
    
    // Add a small bounce effect on flip
    physics.applyImpulse(0, 0, isFlipped ? -0.5 : 0.5);
  };

  // Calculate 3D transforms for the card
  const getCardStyle = (): React.CSSProperties => {
    const { rotation, position } = physics;
    
    // For non-3D mode, use simpler styling
    if (!enable3D) {
      return {
        backgroundImage: `url(${card.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // Full 3D transform incorporating both position and rotation
    return {
      transform: `
        perspective(1200px)
        translate3d(${position.x}px, ${position.y}px, 0)
        rotateX(${rotation.x}deg)
        rotateY(${rotation.y}deg)
        rotateZ(${rotation.z}deg)
        ${isFlipped ? 'rotateY(180deg)' : ''}
      `,
      transformStyle: 'preserve-3d',
      transition: isFlipped ? 'transform 0.6s' : 'none'
    };
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "card-container relative aspect-[2.5/3.5] overflow-visible",
        className
      )}
      onPointerDown={physics.handlePointerDown}
      onPointerMove={physics.handlePointerMove}
      onPointerUp={physics.handlePointerUp}
      onPointerLeave={physics.handlePointerUp}
    >
      <div
        className="card-inner relative w-full h-full rounded-lg overflow-hidden shadow-lg"
        style={getCardStyle()}
        onClick={handleCardClick}
      >
        {/* Front face of the card */}
        <div className="card-face card-front absolute inset-0 backface-hidden">
          <img 
            src={card.imageUrl} 
            alt={card.title || "Card"} 
            className="w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Dynamic lighting effect overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 opacity-50 pointer-events-none"
            style={{
              backgroundPosition: `${50 + physics.rotation.y * 2}% ${50 - physics.rotation.x * 2}%`
            }}
          ></div>
        </div>
        
        {/* Back face of the card */}
        <div className="card-face card-back absolute inset-0 backface-hidden"
          style={{
            transform: 'rotateY(180deg)',
            backgroundColor: '#2a3042',
            backgroundSize: 'cover'
          }}
        >
          {/* Card back content */}
          <div className="absolute inset-0 flex flex-col p-4 text-white">
            <h3 className="text-lg font-medium mb-2">{card.title}</h3>
            
            {card.description && (
              <p className="text-sm mb-4 line-clamp-4 text-white/80">{card.description}</p>
            )}
            
            {card.player && (
              <div className="mt-auto text-sm">
                <span className="text-white/60">Player: </span>
                <span className="font-medium">{card.player}</span>
              </div>
            )}
            
            {card.team && (
              <div className="text-sm">
                <span className="text-white/60">Team: </span>
                <span className="font-medium">{card.team}</span>
              </div>
            )}
            
            {card.year && (
              <div className="text-sm">
                <span className="text-white/60">Year: </span>
                <span className="font-medium">{card.year}</span>
              </div>
            )}
            
            {card.tags && card.tags.length > 0 && (
              <div className="mt-auto pt-2">
                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Similar lighting effect for the back */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-50 pointer-events-none"
            style={{
              backgroundPosition: `${50 + physics.rotation.y * 2}% ${50 - physics.rotation.x * 2}%`
            }}
          ></div>
        </div>
      </div>
      
      {/* Add a subtle shadow below the card that moves with the card */}
      <div 
        className="absolute -bottom-8 left-1/2 w-[80%] h-[20%] rounded-full bg-black/20 blur-md -z-10 transform -translate-x-1/2"
        style={{
          transform: `translateX(calc(-50% + ${physics.position.x * 0.5}px)) scale(${1 - Math.abs(physics.rotation.x) / 100}, ${1 - Math.abs(physics.rotation.y) / 100})`,
          opacity: 0.6 - (Math.abs(physics.rotation.x) + Math.abs(physics.rotation.y)) / 120
        }}
      ></div>
      
      {/* Add CSS for backface visibility - Fixed the TypeScript error by removing 'jsx: true' */}
      <style>{`
        .card-container {
          perspective: 1200px;
          cursor: grab;
          touch-action: none;
        }
        
        .card-container:active {
          cursor: grabbing;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};
