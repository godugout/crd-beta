
import { useState, useRef, RefObject, useCallback } from 'react';

interface AnimationSpeed {
  motion: number;
  pulse: number;
  shimmer: number;
}

interface UseCardEffectsReturn {
  cardRef: RefObject<HTMLDivElement>;
  containerRef: RefObject<HTMLDivElement>;
  canvasRef: RefObject<HTMLDivElement>;
  isMoving: boolean;
  mousePosition: { x: number; y: number };
  handleCanvasMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
  setAnimationSpeed: (speeds: AnimationSpeed) => void;
}

export const useCardEffects = (): UseCardEffectsReturn => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>({
    motion: 1.0,
    pulse: 1.0,
    shimmer: 3.0
  });

  // Handle mouse movement for canvas area (floating effect)
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate relative position (-1 to 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    setMousePosition({ x: relativeX, y: relativeY });
    
    if (containerRef.current) {
      // Move container slightly based on mouse position, adjusted by motion speed
      const moveX = relativeX * 15 * animationSpeed.motion; // Max 15px movement, adjusted by speed
      const moveY = relativeY * 15 * animationSpeed.motion;
      containerRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  }, [animationSpeed.motion]);

  // Handle mouse movement for 3D effect on card
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !containerRef.current) return;
    
    setIsMoving(true);
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to center (values between -1 and 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    // Apply rotation based on mouse position (max 20 degrees), adjusted by motion speed
    const rotateY = relativeX * 20 * animationSpeed.motion;
    const rotateX = -relativeY * 20 * animationSpeed.motion;
    
    cardRef.current.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    
    // Adjust holographic effect based on angle
    if (cardRef.current) {
      const shine = cardRef.current.querySelector('.card-holographic::before') as HTMLElement;
      if (shine) {
        const shinePositionX = 50 + relativeX * 50;
        shine.style.backgroundPosition = `${shinePositionX}% 0`;
      }
    }
  }, [animationSpeed.motion]);

  // Reset card position when mouse leaves
  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      setIsMoving(false);
      cardRef.current.style.transform = '';
    }
    
    if (containerRef.current) {
      containerRef.current.style.transform = '';
    }
  }, []);

  return {
    cardRef,
    containerRef,
    canvasRef,
    isMoving,
    mousePosition,
    handleCanvasMouseMove,
    handleMouseMove,
    handleMouseLeave,
    setAnimationSpeed
  };
};
