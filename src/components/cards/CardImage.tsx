
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
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  
  // Use our physics engine for smooth movement
  const physics = useCardPhysics({
    dampingFactor: 0.96,
    rotationDampingFactor: 0.94,
    sensitivity: 0.12,
    autoRotate,
    weightlessness: 0.7 // Increase weightlessness for more fluid movement
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
  
  // Track mouse position for lighting effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
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
      transition: isFlipped ? 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
      '--mouse-x': `${mousePosition.x * 100}%`,
      '--mouse-y': `${mousePosition.y * 100}%`
    } as React.CSSProperties;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "card-container relative aspect-[2.5/3.5] overflow-visible interactive-card",
        className
      )}
      onPointerDown={physics.handlePointerDown}
      onPointerMove={physics.handlePointerMove}
      onPointerUp={physics.handlePointerUp}
      onPointerLeave={physics.handlePointerUp}
      onMouseMove={handleMouseMove}
    >
      <div
        className="card-inner relative w-full h-full rounded-lg overflow-hidden shadow-lg"
        style={getCardStyle()}
        onClick={handleCardClick}
      >
        {/* Front face of the card */}
        <div className="card-face card-front absolute inset-0 backface-hidden z-2">
          <img 
            src={card.imageUrl} 
            alt={card.title || "Card"} 
            className="w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Enhanced dynamic lighting effect overlay with increased opacity and color contrast */}
          <div 
            className="card-shine-effect absolute inset-0 z-10"
            style={{
              backgroundPosition: `${50 + physics.rotation.y * 2}% ${50 - physics.rotation.x * 2}%`,
              opacity: 0.7,
              transition: 'background-position 0.2s ease-out, opacity 0.3s ease'
            }}
          ></div>
          
          {/* Add subtle edge highlighting for depth */}
          <div className="absolute inset-0 border-2 border-white/10 rounded-lg pointer-events-none z-5"></div>
          
          {/* Add a hint that the card is clickable */}
          {flippable && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity z-20">
              <div className="bg-black/40 text-white text-xs px-2 py-1 rounded-full">
                Click to flip
              </div>
            </div>
          )}
          
          {/* Effect layer on top of card */}
          <div className="effect-layer absolute inset-0 z-15 pointer-events-none">
            <div className="holographic-overlay absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-30 mix-blend-mode-screen"></div>
          </div>
        </div>
        
        {/* Back face of the card */}
        <div className="card-face card-back absolute inset-0 backface-hidden z-2"
          style={{
            transform: 'rotateY(180deg)',
            backgroundColor: '#2a3042',
            backgroundSize: 'cover'
          }}
        >
          {/* Card back content with improved styling */}
          <div className="absolute inset-0 flex flex-col p-4 text-white z-5">
            <h3 className="text-lg font-medium mb-2 text-white/90">{card.title}</h3>
            
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
                    <span key={idx} className="text-xs bg-white/15 px-2 py-0.5 rounded-full hover:bg-white/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced lighting effect for the back with more noticeable gradients */}
          <div 
            className="card-shine-effect absolute inset-0 z-10"
            style={{
              backgroundPosition: `${50 + physics.rotation.y * 2}% ${50 - physics.rotation.x * 2}%`,
              opacity: 0.5,
              transition: 'background-position 0.2s ease-out'
            }}
          ></div>
          
          {/* Add subtle edge highlighting for depth */}
          <div className="absolute inset-0 border-2 border-white/10 rounded-lg pointer-events-none z-5"></div>
          
          {/* Effect layer on top of back face */}
          <div className="effect-layer absolute inset-0 z-15 pointer-events-none">
            <div className="holographic-overlay absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent opacity-30 mix-blend-mode-screen"></div>
          </div>
        </div>
      </div>
      
      {/* Card glow effect when active */}
      <div 
        className="card-glow-effect"
        style={{
          opacity: physics.isMoving ? 0.6 : 0,
        }}
      ></div>
      
      {/* Enhanced shadow below the card that moves with the card */}
      <div 
        className="absolute -bottom-8 left-1/2 w-[80%] h-[20%] rounded-full bg-black/20 blur-md -z-10 transform -translate-x-1/2"
        style={{
          transform: `translateX(calc(-50% + ${physics.position.x * 0.5}px)) scale(${1 - Math.abs(physics.rotation.x) / 100}, ${1 - Math.abs(physics.rotation.y) / 100})`,
          opacity: 0.7 - (Math.abs(physics.rotation.x) + Math.abs(physics.rotation.y)) / 120,
          transition: 'transform 0.1s ease-out, opacity 0.2s ease-out'
        }}
      ></div>
      
      {/* Add CSS for backface visibility with enhanced transitions and animations */}
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
        
        .card-inner {
          transition: box-shadow 0.3s ease;
        }
        
        .card-inner:hover {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }
        
        .card-shine-effect {
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0) 60%
          );
          mix-blend-mode: soft-light;
          pointer-events: none;
        }
        
        .mix-blend-mode-screen {
          mix-blend-mode: screen;
        }
        
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
        }
      `}</style>
    </div>
  );
};
