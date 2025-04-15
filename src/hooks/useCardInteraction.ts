import { useState, useRef, useCallback, RefObject } from 'react';

interface UseCardInteractionProps {
  containerRef: RefObject<HTMLDivElement>;
  cardRef: RefObject<HTMLDivElement>;
}

export const useCardInteraction = ({ containerRef, cardRef }: UseCardInteractionProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  
  const dragStartPos = useRef({ x: 0, y: 0 });
  const cardStartRotation = useRef({ x: 0, y: 0 });

  // Auto rotation
  const autoRotationRef = useRef<number | null>(null);
  
  const startAutoRotation = useCallback(() => {
    if (autoRotationRef.current !== null) return;
    
    let angle = 0;
    autoRotationRef.current = window.setInterval(() => {
      angle += 0.5;
      setPosition(prev => ({ ...prev, y: 5 * Math.sin(angle / 20) }));
    }, 16);
    
    setIsAutoRotating(true);
  }, []);
  
  const stopAutoRotation = useCallback(() => {
    if (autoRotationRef.current !== null) {
      clearInterval(autoRotationRef.current);
      autoRotationRef.current = null;
    }
    
    setIsAutoRotating(false);
  }, []);
  
  const toggleAutoRotation = useCallback(() => {
    if (isAutoRotating) {
      stopAutoRotation();
    } else {
      startAutoRotation();
    }
  }, [isAutoRotating, startAutoRotation, stopAutoRotation]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    cardStartRotation.current = { ...position };
    
    // Stop auto rotation when user interacts with card
    stopAutoRotation();
    
    // Prevent text selection during dragging
    e.preventDefault();
  }, [position, containerRef, stopAutoRotation]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    // Update mouse position for effects
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    if (isDragging) {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      
      const rotationSpeed = 0.5;
      setPosition({
        x: cardStartRotation.current.x + (deltaY * rotationSpeed),
        y: cardStartRotation.current.y - (deltaX * rotationSpeed),
      });
    }
  }, [containerRef, isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // New scroll wheel handler
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (e.shiftKey) {
      // Shift + scroll for zoom
      const zoomDelta = e.deltaY * -0.001;
      setZoom(prev => Math.min(Math.max(0.5, prev + zoomDelta), 2.0));
    } else {
      // Regular scroll for rotation
      const rotationDelta = e.deltaY * 0.5;
      setPosition(prev => ({
        ...prev,
        y: prev.y + rotationDelta * 0.1
      }));
    }
  }, []);

  // Add and remove wheel event listener
  const setupWheelListener = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleCardReset = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
    stopAutoRotation();
  }, [stopAutoRotation]);

  return {
    position,
    setPosition,
    zoom,
    isAutoRotating,
    isDragging,
    mousePosition,
    setIsDragging,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleCardReset,
    handleWheel,
    setupWheelListener,
    toggleAutoRotation,
    startAutoRotation,
    stopAutoRotation
  };
};
