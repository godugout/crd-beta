
import { useEffect } from 'react';

interface KeyboardControlsProps {
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onRotateUp?: () => void;
  onRotateDown?: () => void;
  onFlip?: () => void;
  onReset?: () => void;
}

export const useKeyboardControls = ({
  onRotateLeft,
  onRotateRight,
  onRotateUp,
  onRotateDown,
  onFlip,
  onReset,
}: KeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (onRotateLeft) {
            e.preventDefault();
            onRotateLeft();
          }
          break;
        case 'ArrowRight':
          if (onRotateRight) {
            e.preventDefault();
            onRotateRight();
          }
          break;
        case 'ArrowUp':
          if (onRotateUp) {
            e.preventDefault();
            onRotateUp();
          }
          break;
        case 'ArrowDown':
          if (onRotateDown) {
            e.preventDefault();
            onRotateDown();
          }
          break;
        case 'f':
        case 'F':
          if (onFlip) {
            e.preventDefault();
            onFlip();
          }
          break;
        case 'r':
        case 'R':
          if (onReset) {
            e.preventDefault();
            onReset();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRotateLeft, onRotateRight, onRotateUp, onRotateDown, onFlip, onReset]);
};

export default useKeyboardControls;
