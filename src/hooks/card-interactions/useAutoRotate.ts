
import { useState, useCallback, RefObject } from 'react';
import { toast } from 'sonner';

interface UseAutoRotateProps {
  containerRef: RefObject<HTMLDivElement>;
  cardRef: RefObject<HTMLDivElement>;
}

export function useAutoRotate({ containerRef, cardRef }: UseAutoRotateProps) {
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || !isAutoRotating) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    if (cardRef.current) {
      const rotationX = (y - 0.5) * -10;
      const rotationY = (x - 0.5) * 10;
      
      cardRef.current.style.transform = `
        perspective(1000px) 
        rotateX(${rotationX}deg) 
        rotateY(${rotationY}deg)
      `;
    }
  }, [isAutoRotating]);

  const toggleAutoRotation = useCallback(() => {
    setIsAutoRotating(prev => !prev);
    toast.info(isAutoRotating ? 'Auto movement disabled' : 'Auto movement enabled');
  }, [isAutoRotating]);

  return {
    isAutoRotating,
    mousePosition,
    handleMouseMove,
    toggleAutoRotation,
  };
}
