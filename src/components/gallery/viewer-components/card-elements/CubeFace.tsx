
import React from 'react';

interface CubeFaceProps {
  position: 'front' | 'right' | 'top' | 'back' | 'bottom' | 'left';
  size: number;
  className?: string;
  children: React.ReactNode;
}

export const CubeFace: React.FC<CubeFaceProps> = ({ position, size, className = '', children }) => {
  const getTransform = () => {
    switch (position) {
      case 'front':
        return `translateZ(${size / 2}px)`;
      case 'back':
        return `rotateY(180deg) translateZ(${size / 2}px)`;
      case 'right':
        return `rotateY(90deg) translateZ(${size / 2}px)`;
      case 'left':
        return `rotateY(-90deg) translateZ(${size / 2}px)`;
      case 'top':
        return `rotateX(90deg) translateZ(${size / 2}px)`;
      case 'bottom':
        return `rotateX(-90deg) translateZ(${size / 2}px)`;
    }
  };

  return (
    <div
      className={`absolute backface-hidden ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: getTransform(),
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      {children}
    </div>
  );
};
