
import React from 'react';
import { cn } from '@/lib/utils';

export interface CardFrameProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: 'thin' | 'medium' | 'thick';
  cornerRadius?: 'none' | 'small' | 'medium' | 'large';
  teamColor?: string;
  hasFoil?: boolean;
}

const CardFrame: React.FC<CardFrameProps> = ({
  children,
  className,
  borderWidth = 'medium',
  cornerRadius = 'medium',
  teamColor,
  hasFoil = false
}) => {
  const borderStyles = {
    thin: '1px',
    medium: '2px',
    thick: '4px'
  };

  const radiusStyles = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px'
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        hasFoil && "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer",
        className
      )}
      style={{
        borderWidth: borderStyles[borderWidth],
        borderStyle: 'solid',
        borderColor: teamColor || 'transparent',
        borderRadius: radiusStyles[cornerRadius],
      }}
    >
      {children}
    </div>
  );
};

export default CardFrame;
