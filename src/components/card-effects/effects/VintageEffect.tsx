
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { safeNumber } from '@/lib/utils/cardDefaults';

interface VintageEffectProps {
  intensity?: number;
  isActive: boolean;
  cardTexture?: THREE.Texture;
}

const VintageEffect: React.FC<VintageEffectProps> = ({
  intensity = 1.0,
  isActive,
  cardTexture
}) => {
  const vintageRef = useRef<HTMLDivElement>(null);
  
  // Apply vintage effect when active
  useEffect(() => {
    if (!vintageRef.current || !isActive) return;
    
    const element = vintageRef.current;
    const safeIntensity = safeNumber(intensity, 0.7);
    
    // Set CSS variables for effect strength
    element.style.setProperty('--vintage-intensity', safeIntensity.toString());
    element.style.setProperty('--vintage-sepia', (safeIntensity * 0.6).toFixed(2));
    element.style.setProperty('--vintage-contrast', (1 + safeIntensity * 0.1).toFixed(2));
    
    // If we have a texture, we could use it for grain pattern (advanced)
    if (cardTexture) {
      console.log("Vintage effect has card texture for advanced rendering");
    }
    
  }, [intensity, isActive, cardTexture]);
  
  // Don't render if not active
  if (!isActive) return null;
  
  return (
    <div 
      ref={vintageRef}
      className="vintage-effect"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
        filter: `sepia(var(--vintage-sepia, 0.5)) contrast(var(--vintage-contrast, 1.1))`,
        background: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
        opacity: safeNumber(intensity, 0.7) * 0.8
      }}
    />
  );
};

export default VintageEffect;
