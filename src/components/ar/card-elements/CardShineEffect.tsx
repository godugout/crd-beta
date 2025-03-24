
import React from 'react';

const CardShineEffect: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{
        backgroundSize: '200% 200%',
        backgroundPosition: 'var(--mouse-x, 0) var(--mouse-y, 0)',
      }}
    />
  );
};

export default CardShineEffect;
