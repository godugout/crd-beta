
import { useRef } from 'react';

interface CardInteractionsProps {
  onFlip?: () => void;
}

export const useCardInteractions = ({ onFlip }: CardInteractionsProps) => {
  const lastClickTime = useRef(0);

  // Handle double-click to flip
  const handleCardClick = (event: any) => {
    if (!onFlip) return;

    event.stopPropagation();
    
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime.current;
    
    // Double-click detection (within 300ms)
    if (timeDiff < 300) {
      onFlip();
    }
    
    lastClickTime.current = currentTime;
  };

  return { handleCardClick };
};
