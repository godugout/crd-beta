
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

  const handleKeyboardControls = (e: KeyboardEvent) => {
    handleKeyboardRotation(e);
    handleKeyboardZoom(e);
    
    if (e.key === 'r' || e.key === 'R') {
      handleCardReset();
      e.preventDefault();
    }
  };

  const handleCardReset = () => {
    resetPosition();
    resetZoom();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardControls);
    return () => {
      window.removeEventListener('keydown', handleKeyboardControls);
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
    handleCardReset,
    handleKeyboardControls
  };
}
