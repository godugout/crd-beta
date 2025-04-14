
import React from 'react';

interface SelectionIndicatorProps {
  pulseIntensity?: number;
}

const SelectionIndicator: React.FC<SelectionIndicatorProps> = ({ pulseIntensity = 0.8 }) => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-30"
      style={{ 
        boxShadow: `0 0 0 2px rgba(59, 130, 246, ${pulseIntensity})`, 
        borderRadius: 'inherit',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}
    />
  );
};

export default SelectionIndicator;
