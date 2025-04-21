
import React from 'react';

interface SelectionIndicatorProps {
  pulseIntensity?: number;
}

const SelectionIndicator: React.FC<SelectionIndicatorProps> = ({
  pulseIntensity = 0.5
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Inner glow */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          boxShadow: `inset 0 0 20px rgba(0, 100, 255, ${pulseIntensity})`,
          borderRadius: 'inherit'
        }}
      />
      
      {/* Corner indicators */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500 rounded-tl-md" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-tr-md" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500 rounded-bl-md" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500 rounded-br-md" />
      
      {/* Pulse overlay */}
      <div 
        className="absolute inset-0 animate-pulse opacity-50"
        style={{
          background: `linear-gradient(135deg, transparent 0%, rgba(0, 100, 255, ${pulseIntensity * 0.2}) 50%, transparent 100%)`,
          borderRadius: 'inherit'
        }}
      />
    </div>
  );
};

export default SelectionIndicator;
