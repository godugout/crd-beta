
import React from 'react';

interface ColorSwatchProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  color,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };
  
  return (
    <div 
      className={`rounded-full ${sizeClasses[size]} ${className}`} 
      style={{ backgroundColor: color }}
      title={color}
    />
  );
};

export default ColorSwatch;
