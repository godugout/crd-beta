
import { useState, useCallback, useRef } from 'react';

interface CardInteractionOptions {
  containerRef: React.RefObject<HTMLDivElement>;
  cardRef: React.RefObject<HTMLDivElement>;
  initialPosition?: { x: number; y: number; z: number };
  initialZoom?: number;
  sensitivity?: {
    rotate: number;
    zoom: number;
  };
}

export const useCardInteraction = (options: CardInteractionOptions) => {
  const {
    containerRef,
    cardRef,
    initialPosition = { x: 0, y: 0, z: 0 },
    initialZoom = 1,
    sensitivity = {
      rotate: 1,
      zoom: 0.1
    }
  } = options;

  // State for card rotation and position
  const [position, setPosition] = useState(initialPosition);
  const [zoom, setZoom] = useState(initialZoom);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Reference for tracking drag start position
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef(initialPosition);
  const autoRotationFrameRef = useRef<number | null>(null);

  // Handle mouse movement for rotation
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });

    if (!isDragging) return;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate the distance from center and direction
      const deltaX = (clientX - rect.left - centerX) / centerX;
      const deltaY = (clientY - rect.top - centerY) / centerY;
      
      // Update the position based on mouse movement
      setPosition({
        x: -deltaY * 25 * sensitivity.rotate,
        y: deltaX * 25 * sensitivity.rotate,
        z: 0
      });
    }
  }, [containerRef, isDragging, sensitivity.rotate]);

  // Handle mouse down to start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastPositionRef.current = position;
    
    // Stop auto-rotation when user interacts
    if (isAutoRotating) {
      setIsAutoRotating(false);
      if (autoRotationFrameRef.current) {
        cancelAnimationFrame(autoRotationFrameRef.current);
        autoRotationFrameRef.current = null;
      }
    }
  }, [containerRef, position, isAutoRotating]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle zooming with mouse wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    setZoom(prevZoom => {
      // Calculate new zoom level with boundaries
      const newZoom = prevZoom + delta * sensitivity.zoom;
      return Math.min(Math.max(newZoom, 0.5), 3); // Keep zoom between 0.5x and 3x
    });
  }, [sensitivity.zoom]);

  // Set up wheel event listener
  const setupWheelListener = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef, handleWheel]);

  // Handle keyboard controls
  const handleKeyboardControls = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        setPosition(prev => ({ ...prev, x: prev.x + 5 }));
        break;
      case 'ArrowDown':
        setPosition(prev => ({ ...prev, x: prev.x - 5 }));
        break;
      case 'ArrowLeft':
        setPosition(prev => ({ ...prev, y: prev.y - 5 }));
        break;
      case 'ArrowRight':
        setPosition(prev => ({ ...prev, y: prev.y + 5 }));
        break;
      case '+':
      case '=':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case 'r':
        handleCardReset();
        break;
      case ' ':
        toggleAutoRotation();
        break;
      default:
        break;
    }
  }, []);

  // Handle zooming in
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + sensitivity.zoom, 3));
  }, [sensitivity.zoom]);

  // Handle zooming out
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - sensitivity.zoom, 0.5));
  }, [sensitivity.zoom]);

  // Reset card position and zoom
  const handleCardReset = useCallback(() => {
    setPosition({ x: 0, y: 0, z: 0 });
    setZoom(1);
    
    // Stop auto-rotation if active
    if (isAutoRotating) {
      setIsAutoRotating(false);
      if (autoRotationFrameRef.current) {
        cancelAnimationFrame(autoRotationFrameRef.current);
        autoRotationFrameRef.current = null;
      }
    }
  }, [isAutoRotating]);

  // Toggle auto rotation
  const toggleAutoRotation = useCallback(() => {
    setIsAutoRotating(prev => {
      const newState = !prev;
      
      if (newState) {
        // Start auto rotation animation
        let angle = 0;
        const animate = () => {
          angle += 0.005;
          setPosition({
            x: Math.sin(angle) * 10,
            y: Math.cos(angle) * 20,
            z: 0
          });
          autoRotationFrameRef.current = requestAnimationFrame(animate);
        };
        autoRotationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Stop auto rotation
        if (autoRotationFrameRef.current) {
          cancelAnimationFrame(autoRotationFrameRef.current);
          autoRotationFrameRef.current = null;
        }
      }
      
      return newState;
    });
  }, []);

  return {
    position,
    zoom,
    isAutoRotating,
    isDragging,
    mousePosition,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleCardReset,
    handleKeyboardControls,
    handleZoomIn,
    handleZoomOut,
    toggleAutoRotation,
    setIsDragging,
    setPosition,
    setZoom,
    setupWheelListener
  };
};
