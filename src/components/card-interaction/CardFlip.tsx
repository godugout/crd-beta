
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { cn } from '@/lib/utils';

export interface CardFlipProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  isFlipped?: boolean;
  onFlip?: (isFlipped: boolean) => void;
  flipDirection?: 'horizontal' | 'vertical';
  flipDuration?: number;
  flipEasing?: string;
  enableSound?: boolean;
  disableFlip?: boolean;
}

export const CardFlip: React.FC<CardFlipProps> = ({
  front,
  back,
  className,
  isFlipped: controlledIsFlipped,
  onFlip,
  flipDirection = 'horizontal',
  flipDuration = 600,
  flipEasing = 'cubic-bezier(0.23, 1, 0.32, 1)', // Easing function for a more realistic flip
  enableSound = false,
  disableFlip = false
}) => {
  // Internal state for flip status (used if not controlled externally)
  const [internalIsFlipped, setInternalIsFlipped] = useState(false);
  
  // Use controlled or uncontrolled flip state
  const isFlipped = controlledIsFlipped !== undefined ? controlledIsFlipped : internalIsFlipped;
  
  // Audio for flip sound
  const flipSound = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (enableSound) {
      // Create audio element for flip sound
      flipSound.current = new Audio('/sounds/card-flip.mp3');
      flipSound.current.preload = 'auto';
      flipSound.current.volume = 0.5;
    }
    return () => {
      if (flipSound.current) {
        flipSound.current = null;
      }
    };
  }, [enableSound]);
  
  // Handle flip event
  const handleFlip = useCallback((event: React.MouseEvent) => {
    if (disableFlip) return;
    
    // Stop propagation to prevent unintended interactions
    event.stopPropagation();
    
    const newFlipState = !isFlipped;
    
    // Update internal state if uncontrolled
    if (controlledIsFlipped === undefined) {
      setInternalIsFlipped(newFlipState);
    }
    
    // Call parent's onFlip callback if provided
    onFlip?.(newFlipState);
    
    // Play flip sound if enabled
    if (enableSound && flipSound.current) {
      flipSound.current.currentTime = 0;
      flipSound.current.play().catch(err => console.warn('Error playing card flip sound:', err));
    }
  }, [isFlipped, controlledIsFlipped, onFlip, disableFlip, enableSound]);
  
  // Set up animation with react-spring
  const { transform, opacity } = useSpring({
    opacity: isFlipped ? 1 : 0,
    transform: `perspective(1500px) ${flipDirection === 'horizontal' ? 'rotateY' : 'rotateX'}(${isFlipped ? 180 : 0}deg)`,
    config: {
      mass: 5,
      tension: 450,
      friction: 80,
      duration: flipDuration,
    }
  });
  
  return (
    <div 
      className={cn(
        "card-flip-container relative w-full h-full",
        disableFlip ? "" : "cursor-pointer",
        className
      )}
      onClick={handleFlip}
    >
      {/* Front of the card */}
      <animated.div
        className="card-side card-front absolute w-full h-full backface-hidden"
        style={{
          opacity: opacity.to(o => 1 - o),
          transform,
          rotateY: '0deg',
          transformStyle: 'preserve-3d',
          zIndex: isFlipped ? 0 : 1
        }}
      >
        {front}
      </animated.div>
      
      {/* Back of the card */}
      <animated.div
        className="card-side card-back absolute w-full h-full backface-hidden"
        style={{
          opacity,
          transform: transform.to(t => `${t} ${flipDirection === 'horizontal' ? 'rotateY(180deg)' : 'rotateX(180deg)'}`),
          transformStyle: 'preserve-3d',
          zIndex: isFlipped ? 1 : 0
        }}
      >
        {back}
      </animated.div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}} />
    </div>
  );
};

export default CardFlip;
