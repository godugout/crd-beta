
import React, { useRef, useState, useEffect } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { cn } from '@/lib/utils';

export interface CardInteractionProps {
  children: React.ReactNode;
  className?: string;
  damping?: number;
  mass?: number;
  tension?: number;
  friction?: number;
  onFlip?: () => void;
  disabled?: boolean;
  maxRotation?: number;
  initialRotation?: [number, number]; // [x, y] rotation in degrees
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export const CardInteraction: React.FC<CardInteractionProps> = ({
  children,
  className,
  damping = 0.85,
  mass = 1,
  tension = 400,
  friction = 30,
  onFlip,
  disabled = false,
  maxRotation = 20,
  initialRotation = [0, 0],
  onInteractionStart,
  onInteractionEnd
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const isFlickDetected = useRef(false);
  const velocity = useRef<[number, number]>([0, 0]);
  
  // Set up the spring animation for the card
  const [{ rotateX, rotateY, scale, zIndex }, api] = useSprings(() => ({
    rotateX: initialRotation[0],
    rotateY: initialRotation[1],
    scale: 1,
    zIndex: 0,
    config: { mass, tension, friction }
  }));
  
  // Track whether we're on a touch device
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  
  // Set up drag gesture for both mouse and touch
  const bind = useDrag(
    ({ active, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], event }) => {
      event.stopPropagation();
      
      // Store velocity for flick detection
      velocity.current = [vx, vy];
      
      // Calculate card center and bounds
      const card = containerRef.current;
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse/touch position relative to card center
      // Type guard to ensure we have the correct event type with clientX/Y properties
      const clientX = 'touches' in event 
        ? event.touches[0].clientX 
        : 'clientX' in event 
          ? event.clientX 
          : centerX;
          
      const clientY = 'touches' in event 
        ? event.touches[0].clientY 
        : 'clientY' in event 
          ? event.clientY 
          : centerY;
      
      const relativeX = (clientX - centerX) / (rect.width / 2);
      const relativeY = (clientY - centerY) / (rect.height / 2);
      
      // Detect flick gesture (for flipping)
      const flickThreshold = 0.7;
      const isHorizontalFlick = Math.abs(vx) > flickThreshold && Math.abs(vx) > Math.abs(vy);
      const isVerticalFlick = Math.abs(vy) > flickThreshold && Math.abs(vy) > Math.abs(vx);
      
      if (!isFlickDetected.current && (isHorizontalFlick || isVerticalFlick)) {
        isFlickDetected.current = true;
        onFlip?.();
      }
      
      // Update interaction state
      if (active !== isInteracting) {
        setIsInteracting(active);
        if (active) {
          onInteractionStart?.();
        } else {
          onInteractionEnd?.();
          // Reset flick detection when interaction ends
          isFlickDetected.current = false;
        }
      }
      
      // Apply 3D transformations based on mouse/touch position
      if (!disabled) {
        // Calculate rotation based on pointer position relative to card center
        // Invert Y axis for natural feeling (move mouse up, card tilts back)
        const rotX = active ? -relativeY * maxRotation : initialRotation[0];
        const rotY = active ? relativeX * maxRotation : initialRotation[1];
        
        api.start({
          rotateX: rotX,
          rotateY: rotY,
          scale: active ? 1.05 : 1,
          zIndex: active ? 10 : 0,
          immediate: false
        });
      }
    },
    { filterTaps: true }
  );
  
  // Apply physics simulation for a more realistic feel
  useEffect(() => {
    if (!isInteracting && !disabled) {
      // Apply damping to gradually return to rest position
      const dampingInterval = setInterval(() => {
        api.start({
          rotateX: initialRotation[0],
          rotateY: initialRotation[1],
          scale: 1,
          config: { duration: 800 }
        });
      }, 16);
      
      return () => clearInterval(dampingInterval);
    }
  }, [isInteracting, api, damping, initialRotation, disabled]);
  
  return (
    <animated.div
      ref={containerRef}
      className={cn(
        "card-interaction relative select-none touch-none",
        isInteracting && "z-10",
        !disabled && "cursor-grab active:cursor-grabbing",
        isTouchDevice ? "hover:transform-none" : "hover:scale-[1.02] transition-transform",
        className
      )}
      style={{
        transform: 'perspective(1000px)',
        rotateX,
        rotateY,
        scale,
        zIndex,
        transformStyle: 'preserve-3d',
        userSelect: 'none'
      }}
      {...(disabled ? {} : bind())}
    >
      {children}
    </animated.div>
  );
};

export default CardInteraction;
