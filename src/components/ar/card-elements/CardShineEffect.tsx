
import React, { useRef, useEffect, useState } from 'react';

interface CardShineEffectProps {
  intensity?: number;
}

const CardShineEffect: React.FC<CardShineEffectProps> = ({ intensity = 0.5 }) => {
  const shineRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const shine = shineRef.current;
    if (!shine) return;
    
    const parent = shine.parentElement;
    if (!parent) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      shine.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${intensity}) 0%, transparent 80%)`;
      
      if (!isActive) {
        setIsActive(true);
        shine.style.opacity = '1';
      }
    };
    
    const handleMouseLeave = () => {
      setIsActive(false);
      shine.style.opacity = '0';
    };
    
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, isActive]);
  
  return (
    <div 
      ref={shineRef}
      className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
      style={{ 
        opacity: 0,
        mixBlendMode: 'soft-light'
      }}
    />
  );
};

export default CardShineEffect;
