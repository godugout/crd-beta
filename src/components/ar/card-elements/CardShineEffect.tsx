
import React from 'react';

interface CardShineEffectProps {
  intensity: number;
}

const CardShineEffect: React.FC<CardShineEffectProps> = ({ intensity = 0.7 }) => {
  return (
    <div 
      className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent pointer-events-none z-20"
      style={{ 
        opacity: intensity,
        mixBlendMode: 'overlay',
        borderRadius: 'inherit'
      }}
    />
  );
};

export default CardShineEffect;
