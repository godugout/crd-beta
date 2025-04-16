
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import './effects.css';

interface CardTransitionEffectsProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const CardTransitionEffects: React.FC<CardTransitionEffectsProps> = ({
  isActive,
  onComplete
}) => {
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowEffect(true);
      const timer = setTimeout(() => {
        setShowEffect(false);
        onComplete?.();
      }, 1000); // Duration of effect
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <div className={cn(
      "absolute inset-0 pointer-events-none z-50 transition-opacity duration-300",
      "bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20",
      showEffect ? "opacity-100" : "opacity-0"
    )}>
      <div className="absolute inset-0 glitch-overlay" />
      <div className="absolute inset-0 light-rays" />
    </div>
  );
};
