
import { useState, useCallback, RefObject } from 'react';
import { toast } from 'sonner';

interface CardInteractionState {
  position: { x: number; y: number; rotation: number };
  zoom: number;
  isAutoRotating: boolean;
  isDragging: boolean;
}

interface UseCardInteractionProps {
  containerRef: RefObject<HTMLDivElement>;
  cardRef: RefObject<HTMLDivElement>;
}

export function useCardInteraction({ containerRef, cardRef }: UseCardInteractionProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, rotation: 0 });
  const [zoom, setZoom] = useState(1);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
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
        scale(${zoom})
      `;
    }
  }, [zoom, isAutoRotating, containerRef, cardRef]);

  const handleCardReset = useCallback(() => {
    setPosition({ x: 0, y: 0, rotation: 0 });
    setZoom(1);
    toast.info('Card position reset');
  }, []);

  const handleKeyboardControls = useCallback((e: KeyboardEvent) => {
    const moveStep = 10;
    const rotationStep = 5;
    const zoomStep = 0.1;
    const maxZoom = 3.0;
    const minZoom = 0.5;

    switch (e.key) {
      case 'ArrowUp':
        setPosition(prev => ({ ...prev, y: prev.y - moveStep }));
        e.preventDefault();
        break;
      case 'ArrowDown':
        setPosition(prev => ({ ...prev, y: prev.y + moveStep }));
        e.preventDefault();
        break;
      case 'ArrowLeft':
        setPosition(prev => ({ ...prev, x: prev.x - moveStep }));
        e.preventDefault();
        break;
      case 'ArrowRight':
        setPosition(prev => ({ ...prev, x: prev.x + moveStep }));
        e.preventDefault();
        break;
      case '[':
        setPosition(prev => ({ ...prev, rotation: prev.rotation - rotationStep }));
        e.preventDefault();
        break;
      case ']':
        setPosition(prev => ({ ...prev, rotation: prev.rotation + rotationStep }));
        e.preventDefault();
        break;
      case '+':
      case '=':
        setZoom(prev => Math.min(maxZoom, prev + zoomStep));
        e.preventDefault();
        break;
      case '-':
      case '_':
        setZoom(prev => Math.max(minZoom, prev - zoomStep));
        e.preventDefault();
        break;
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(3.0, prev + 0.1));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(0.5, prev - 0.1));
  }, []);

  const toggleAutoRotation = useCallback(() => {
    setIsAutoRotating(prev => !prev);
    toast.info(isAutoRotating ? 'Auto movement disabled' : 'Auto movement enabled');
  }, [isAutoRotating]);

  return {
    position,
    zoom,
    isAutoRotating,
    isDragging,
    mousePosition,
    setIsDragging,
    handleMouseMove,
    handleCardReset,
    handleKeyboardControls,
    handleZoomIn,
    handleZoomOut,
    toggleAutoRotation
  };
}
