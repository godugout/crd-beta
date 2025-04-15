
import { useState, useCallback, RefObject } from 'react';
import { toast } from 'sonner';

export interface RotationState {
  x: number;
  y: number;
  rotation: number;
}

interface UseRotationProps {
  containerRef: RefObject<HTMLDivElement>;
  cardRef: RefObject<HTMLDivElement>;
}

export function useRotation({ containerRef, cardRef }: UseRotationProps) {
  const [position, setPosition] = useState<RotationState>({ x: 0, y: 0, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleKeyboardRotation = useCallback((e: KeyboardEvent) => {
    const moveStep = 10;
    const rotationStep = 5;

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
    }
  }, []);

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0, rotation: 0 });
    toast.info('Card position reset');
  }, []);

  return {
    position,
    isDragging,
    setIsDragging,
    handleKeyboardRotation,
    resetPosition,
  };
}
