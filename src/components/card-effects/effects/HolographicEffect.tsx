
import React, { useRef, useEffect } from 'react';
import { safeNumber } from '@/lib/utils/cardDefaults';

interface HolographicEffectProps {
  intensity?: number;
  isActive: boolean;
  mousePosition?: { x: number; y: number };
  pattern?: 'linear' | 'radial' | 'geometric';
  colorMode?: 'rainbow' | 'blue-purple' | 'gold-green';
}

const HolographicEffect: React.FC<HolographicEffectProps> = ({
  intensity = 1.0,
  isActive,
  mousePosition = { x: 0.5, y: 0.5 },
  pattern = 'linear',
  colorMode = 'rainbow'
}) => {
  const holographicRef = useRef<HTMLDivElement>(null);
  
  // Apply holographic effect when active
  useEffect(() => {
    if (!holographicRef.current || !isActive) return;
    
    const element = holographicRef.current;
    const safeIntensity = safeNumber(intensity, 1.0);
    
    // Apply safe mouse position values
    const safeX = safeNumber(mousePosition?.x, 0.5);
    const safeY = safeNumber(mousePosition?.y, 0.5);
    
    // Set CSS variables for dynamic effects
    element.style.setProperty('--holo-intensity', safeIntensity.toString());
    element.style.setProperty('--mouse-x', safeX.toString());
    element.style.setProperty('--mouse-y', safeY.toString());
    
    // Set pattern type
    element.dataset.pattern = pattern || 'linear';
    
    // Set color mode
    element.dataset.colorMode = colorMode || 'rainbow';
    
  }, [intensity, isActive, mousePosition, pattern, colorMode]);
  
  // Don't render if not active
  if (!isActive) return null;
  
  // Different gradient configurations based on color mode
  const gradientColors = {
    'rainbow': 'linear-gradient(135deg, rgba(255,0,0,0.5), rgba(255,255,0,0.5), rgba(0,255,0,0.5), rgba(0,255,255,0.5), rgba(0,0,255,0.5), rgba(255,0,255,0.5))',
    'blue-purple': 'linear-gradient(135deg, rgba(100,100,255,0.5), rgba(200,100,255,0.5), rgba(150,50,255,0.5))',
    'gold-green': 'linear-gradient(135deg, rgba(255,215,0,0.5), rgba(200,255,150,0.5), rgba(100,200,50,0.5))'
  };
  
  return (
    <div 
      ref={holographicRef}
      className="holographic-effect"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'none',
        background: gradientColors[colorMode as keyof typeof gradientColors],
        mixBlendMode: 'color-dodge',
        opacity: safeNumber(intensity, 1.0) * 0.5
      }}
    >
      <div className="holographic-sparkles" />
    </div>
  );
};

export default HolographicEffect;
