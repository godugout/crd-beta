
import { RefObject, useEffect } from 'react';
import { useRotation } from './card-interactions/useRotation';
import { useZoom } from './card-interactions/useZoom';
import { useAutoRotate } from './card-interactions/useAutoRotate';

interface UseCardInteractionProps {
  containerRef: RefObject<HTMLDivElement>;
  cardRef: RefObject<HTMLDivElement>;
}

export function useCardInteraction({ containerRef, cardRef }: UseCardInteractionProps) {
  const { position, isDragging, setIsDragging, handleKeyboardRotation, resetPosition } = useRotation({ containerRef, cardRef });
  const { zoom, handleZoomIn, handleZoomOut, handleKeyboardZoom, resetZoom } = useZoom();
  const { isAutoRotating, mousePosition, handleMouseMove, toggleAutoRotation } = useAutoRotate({ containerRef, cardRef });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyboardRotation(e);
      handleKeyboardZoom(e);
      
      if (e.key === 'r' || e.key === 'R') {
        resetPosition();
        resetZoom();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyboardRotation, handleKeyboardZoom, resetPosition, resetZoom]);

  return {
    position,
    zoom,
    isAutoRotating,
    isDragging,
    mousePosition,
    setIsDragging,
    handleMouseMove,
    handleKeyboardRotation,
    handleKeyboardZoom,
    handleZoomIn,
    handleZoomOut,
    toggleAutoRotation,
    resetPosition,
  };
}
