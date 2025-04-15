
import { useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useCardRotation = () => {
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(0);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const now = Date.now();
    const timeDiff = now - lastScrollTime;
    
    if (timeDiff > 50) {
      const newSpeed = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.01, 0.5);
      setRotationSpeed(prev => prev + newSpeed);
      setLastScrollTime(now);
    }
  }, [lastScrollTime]);

  return {
    rotationSpeed,
    setRotationSpeed,
    handleWheel
  };
};
