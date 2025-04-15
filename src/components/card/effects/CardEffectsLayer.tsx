
import React from 'react';
import { cn } from '@/lib/utils';

interface CardEffectsLayerProps {
  children: React.ReactNode;
  activeEffects: string[];
  intensity?: number;
  className?: string;
}

const CardEffectsLayer: React.FC<CardEffectsLayerProps> = ({
  children,
  activeEffects,
  intensity = 1,
  className
}) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        activeEffects.includes('holographic') && "card-holographic",
        activeEffects.includes('refractor') && "card-refractor",
        activeEffects.includes('chrome') && "card-chrome",
        activeEffects.includes('vintage') && "card-vintage",
        className
      )}
      style={{
        '--effect-intensity': intensity
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default CardEffectsLayer;
