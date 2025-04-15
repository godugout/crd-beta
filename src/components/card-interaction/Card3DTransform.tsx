
import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { cn } from '@/lib/utils';

export interface Card3DTransformProps {
  children: React.ReactNode;
  className?: string;
  initialRotation?: { x: number; y: number; z: number };
  perspective?: number;
  transformOrigin?: string;
  maxRotation?: number;
  springConfig?: {
    mass?: number;
    tension?: number;
    friction?: number;
  };
  shadow?: boolean;
  bendFactor?: number;
  disabled?: boolean;
}

export const Card3DTransform: React.FC<Card3DTransformProps> = ({
  children,
  className,
  initialRotation = { x: 0, y: 0, z: 0 },
  perspective = 1200,
  transformOrigin = 'center center',
  maxRotation = 18,
  springConfig = {
    mass: 1,
    tension: 170,
    friction: 26,
  },
  shadow = true,
  bendFactor = 0.05,
  disabled = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  
  const [{ rotateX, rotateY, rotateZ, scale, boxShadow }, api] = useSpring(() => ({
    rotateX: initialRotation.x,
    rotateY: initialRotation.y,
    rotateZ: initialRotation.z,
    scale: 1,
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    config: springConfig,
  }));

  // Handle mouse and touch interactions
  const bind = useDrag(
    ({ active, movement: [mx, my], xy: [x, y], event }) => {
      event.preventDefault();
      
      if (disabled) return;

      const card = cardRef.current;
      if (!card) return;
      
      setIsInteracting(active);
      
      // Calculate card center and bounds
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate relative position for rotation
      const relativeX = (x - centerX) / (rect.width / 2);
      const relativeY = (y - centerY) / (rect.height / 2);
      
      // Apply 3D transformations based on mouse/touch position
      const rotX = active ? -relativeY * maxRotation : initialRotation.x;
      const rotY = active ? relativeX * maxRotation : initialRotation.y;
      
      // Calculate the bend effect (subtle deformation)
      const bendX = active ? rotX * bendFactor : 0;
      const bendY = active ? rotY * bendFactor : 0;
      
      // Calculate shadow intensity based on rotation
      const shadowIntensity = active ? Math.max(Math.abs(rotX), Math.abs(rotY)) / maxRotation : 0.1;
      const shadowBlur = 5 + shadowIntensity * 25;
      const shadowOffset = shadowIntensity * 15;
      
      api.start({
        rotateX: rotX,
        rotateY: rotY,
        rotateZ: bendX * bendY * 2, // subtle twist effect
        scale: active ? 1.05 : 1,
        boxShadow: shadow 
          ? `${rotY * 0.7}px ${rotX * 0.7}px ${shadowBlur}px rgba(0, 0, 0, ${0.1 + shadowIntensity * 0.2})` 
          : '0 0 15px rgba(0, 0, 0, 0.1)',
        config: {
          ...springConfig,
          friction: active ? springConfig.friction - 5 : springConfig.friction, // reduce friction during interaction
        },
      });
    },
    { filterTaps: true }
  );

  // Return to initial position when not interacting
  useEffect(() => {
    if (!isInteracting && !disabled) {
      api.start({
        rotateX: initialRotation.x,
        rotateY: initialRotation.y,
        rotateZ: initialRotation.z,
        scale: 1,
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
        config: {
          ...springConfig,
          friction: springConfig.friction + 10, // increase friction for return animation
        },
      });
    }
  }, [isInteracting, api, initialRotation, disabled, springConfig]);

  return (
    <animated.div
      ref={cardRef}
      className={cn(
        "card-3d-transform relative transition-all",
        shadow && "shadow-xl",
        isInteracting ? "z-10" : "z-0",
        !disabled && "cursor-grab active:cursor-grabbing",
        className
      )}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        transformOrigin,
        transform: 'perspective(1200px)',
        rotateX,
        rotateY,
        rotateZ,
        scale,
        boxShadow,
      }}
      {...(disabled ? {} : bind())}
    >
      {children}
    </animated.div>
  );
};

export default Card3DTransform;
