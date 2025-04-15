
import { useCallback } from 'react';

interface UseCardKeyboardNavigationProps {
  onFlip: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onRotateUp: () => void;
  onRotateDown: () => void;
}

export const useCardKeyboardNavigation = ({
  onFlip,
  onReset,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onRotateUp,
  onRotateDown,
}: UseCardKeyboardNavigationProps) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'f':
      case 'F':
        onFlip();
        break;
      case 'r':
      case 'R':
        onReset();
        break;
      case '+':
        onZoomIn();
        break;
      case '-':
        onZoomOut();
        break;
      case 'ArrowLeft':
        onRotateLeft();
        break;
      case 'ArrowRight':
        onRotateRight();
        break;
      case 'ArrowUp':
        onRotateUp();
        break;
      case 'ArrowDown':
        onRotateDown();
        break;
    }
  }, [onFlip, onReset, onZoomIn, onZoomOut, onRotateLeft, onRotateRight, onRotateUp, onRotateDown]);

  return { handleKeyDown };
};
