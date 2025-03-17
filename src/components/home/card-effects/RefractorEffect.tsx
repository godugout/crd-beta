
import React, { useEffect, useRef } from 'react';
import './RefractorEffects.css';

interface RefractorEffectProps {
  intensity?: number;
  isActive: boolean;
  mousePosition: { x: number; y: number };
}

const RefractorEffect: React.FC<RefractorEffectProps> = ({
  intensity = 1.0,
  isActive,
  mousePosition
}) => {
  const refractorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!refractorRef.current || !isActive) return;
    
    const refractorElement = refractorRef.current;
    
    // Apply intensity through CSS variables
    refractorElement.style.setProperty('--refractor-intensity', intensity.toString());
    
    // Set the refraction colors to simulate different light angles based on mouse position
    const hue1 = 120 + mousePosition.x * 60;
    const hue2 = 180 + mousePosition.y * 60;
    const hue3 = 240 + (mousePosition.x + mousePosition.y) * 30;
    
    refractorElement.style.setProperty(
      '--refractor-color-1', 
      `hsla(${hue1}, 100%, 50%, ${0.1 * intensity})`
    );
    refractorElement.style.setProperty(
      '--refractor-color-2', 
      `hsla(${hue2}, 100%, 50%, ${0.1 * intensity})`
    );
    refractorElement.style.setProperty(
      '--refractor-color-3', 
      `hsla(${hue3}, 100%, 50%, ${0.1 * intensity})`
    );
    
    // Calculate refractor angle based on mouse position
    const angle = Math.atan2(mousePosition.y, mousePosition.x) * (180 / Math.PI);
    refractorElement.style.setProperty('--refractor-angle', `${angle}deg`);
    
  }, [intensity, isActive, mousePosition]);
  
  if (!isActive) return null;
  
  return (
    <div 
      ref={refractorRef}
      className="refractor-effect"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none'
      }}
    />
  );
};

export default RefractorEffect;
