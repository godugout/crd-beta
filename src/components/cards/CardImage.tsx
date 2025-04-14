
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useCardPhysics } from '@/hooks/useCardPhysics';
import '../../styles/card-interactions.css';

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
  const [isOutOfBounds, setIsOutOfBounds] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Use our physics engine for smooth movement
  const physics = useCardPhysics({
    dampingFactor: 0.96,
    rotationDampingFactor: 0.94,
    sensitivity: 0.12,
    autoRotate,
    boundaryConstraints: true
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

  // Check if card is far from center
  useEffect(() => {
    const threshold = 300; // Adjust as needed
    const distance = Math.sqrt(
      physics.position.x * physics.position.x + 
      physics.position.y * physics.position.y
    );
    
    setIsOutOfBounds(distance > threshold);
  }, [physics.position.x, physics.position.y]);

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
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple ripple-animation';
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      containerRef.current?.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    }
  };

  // Calculate 3D transforms for the card
  const getCardStyle = (): React.CSSProperties => {
    const { rotation, position } = physics;
    
    // For non-3D mode, use simpler styling
    if (!enable3D) {
      return {};
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

  // Get image URL with fallback to thumbnail
  const imageUrl = card.imageUrl || card.thumbnailUrl;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error(`Failed to load image for card: ${card.id}`);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "card-container relative aspect-[2.5/3.5] overflow-visible",
        isOutOfBounds && "boundary-warning",
        className
      )}
      onPointerDown={enable3D ? physics.handlePointerDown : undefined}
      onPointerMove={enable3D ? physics.handlePointerMove : undefined}
      onPointerUp={enable3D ? physics.handlePointerUp : undefined}
      onPointerLeave={enable3D ? physics.handlePointerUp : undefined}
      onDoubleClick={() => physics.resetCard()}
    >
      <div
        className="card-inner relative w-full h-full rounded-lg overflow-hidden shadow-lg"
        style={getCardStyle()}
        onClick={handleCardClick}
      >
        {/* Front face of the card */}
        <div className="card-face card-front absolute inset-0 backface-hidden">
          {/* Loading placeholder */}
          {!imageLoaded && imageUrl && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
              <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Image with proper error handling */}
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={card.title || "Card"} 
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              No Image
            </div>
          )}
          
          {/* Card Effects Layer - positioned on top of the card face */}
          <div className="card-effects-layer">
            {/* Lighting effect overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 opacity-50 pointer-events-none"
              style={{
                backgroundPosition: `${50 + physics.rotation.y * 2}% ${50 - physics.rotation.x * 2}%`,
                mixBlendMode: 'overlay'
              }}
            ></div>
            
            {/* Shine effect that follows pointer */}
            <div 
              className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent pointer-events-none"
              style={{ 
                opacity: Math.min(0.7, Math.abs(physics.rotation.x) / 20 + Math.abs(physics.rotation.y) / 20),
                mixBlendMode: 'overlay' 
              }}
            />
          </div>
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
          
          {/* Similar card effects layer for the back */}
          <div className="card-effects-layer">
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-50 pointer-events-none"
              style={{
                backgroundPosition: `${50 + physics.rotation.y * 2}% ${50 - physics.rotation.x * 2}%`,
                mixBlendMode: 'overlay'
              }}
            ></div>
          </div>
        </div>

        {/* Hover effects for desktop */}
        <div className="card-highlight hidden md:block"></div>
        
        {/* Flip indicator */}
        {flippable && <div className="flip-indicator hidden md:block"></div>}
      </div>
      
      {/* Add a subtle shadow below the card that moves with the card */}
      <div 
        className="absolute -bottom-8 left-1/2 w-[80%] h-[20%] rounded-full bg-black/20 blur-md -z-10 transform -translate-x-1/2"
        style={{
          transform: `translateX(calc(-50% + ${physics.position.x * 0.5}px)) scale(${1 - Math.abs(physics.rotation.x) / 100}, ${1 - Math.abs(physics.rotation.y) / 100})`,
          opacity: 0.6 - (Math.abs(physics.rotation.x) + Math.abs(physics.rotation.y)) / 120
        }}
      ></div>
      
      {/* Reset hint text for out-of-bounds cards */}
      {isOutOfBounds && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-white/70 text-xs px-2 py-1 bg-black/50 rounded whitespace-nowrap">
          Double-click to reset position
        </div>
      )}
    </div>
  );
};
