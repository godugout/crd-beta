
import React, { useEffect, useRef } from 'react';
import { safeNumber, safeFixed } from '@/lib/utils/cardDefaults';
import '../effects.css';

interface RefractorEffectProps {
  intensity?: number;
  speed?: number;
  colors?: string[];
  isActive: boolean;
  mousePosition?: { x: number; y: number };
  animationEnabled?: boolean;
  angle?: number;
}

const RefractorEffect: React.FC<RefractorEffectProps> = ({
  intensity = 1.0,
  speed = 1.0,
  colors = ['rgba(255, 0, 128, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(255, 255, 0, 0.2)'],
  isActive,
  mousePosition = { x: 0.5, y: 0.5 },
  animationEnabled = true,
  angle
}) => {
  const refractorRef = useRef<HTMLDivElement>(null);
  
  // Dynamic angle calculation based on mouse position or preset angle
  const calculateRefractorAngle = () => {
    if (angle !== undefined) return safeNumber(angle, 0);
    
    // Safe mouse position values
    const safeX = safeNumber(mousePosition?.x, 0.5);
    const safeY = safeNumber(mousePosition?.y, 0.5);
    
    return Math.atan2(safeY - 0.5, safeX - 0.5) * (180 / Math.PI);
  };
  
  // Apply refractor effect properties when active
  useEffect(() => {
    if (!refractorRef.current || !isActive) return;
    
    const refractorElement = refractorRef.current;
    const safeIntensity = safeNumber(intensity, 1.0);
    const safeSpeed = safeNumber(speed, 1.0);
    
    // Apply intensity through CSS variables
    refractorElement.style.setProperty('--refractor-intensity', safeIntensity.toString());
    refractorElement.style.setProperty('--refractor-speed', `${3 / safeSpeed}s`);
    
    // Set the refraction colors to simulate different light angles based on mouse position
    const safeX = safeNumber(mousePosition?.x, 0.5);
    const safeY = safeNumber(mousePosition?.y, 0.5);
    
    const hue1 = 120 + safeX * 60;
    const hue2 = 180 + safeY * 60;
    const hue3 = 240 + (safeX + safeY) * 30;
    
    // Apply custom colors if provided, otherwise generate dynamic colors
    if (colors && colors.length >= 3) {
      refractorElement.style.setProperty('--refractor-color-1', colors[0]);
      refractorElement.style.setProperty('--refractor-color-2', colors[1]);
      refractorElement.style.setProperty('--refractor-color-3', colors[2]);
    } else {
      refractorElement.style.setProperty(
        '--refractor-color-1', 
        `hsla(${safeFixed(hue1, 0)}, 100%, 50%, ${0.2 * safeIntensity})`
      );
      refractorElement.style.setProperty(
        '--refractor-color-2', 
        `hsla(${safeFixed(hue2, 0)}, 100%, 50%, ${0.2 * safeIntensity})`
      );
      refractorElement.style.setProperty(
        '--refractor-color-3', 
        `hsla(${safeFixed(hue3, 0)}, 100%, 50%, ${0.2 * safeIntensity})`
      );
    }
    
    // Calculate refractor angle based on mouse position or preset angle
    const refractorAngle = calculateRefractorAngle();
    refractorElement.style.setProperty('--refractor-angle', `${refractorAngle}deg`);
    
    // Set animation status
    refractorElement.style.setProperty('--animation-enabled', animationEnabled ? '1' : '0');
    
    // RGB fringing effect (color separation)
    refractorElement.style.setProperty('--mouse-x', safeX.toString());
    refractorElement.style.setProperty('--mouse-y', safeY.toString());
    
  }, [intensity, isActive, mousePosition, speed, colors, animationEnabled, angle]);
  
  // Don't render anything if effect is not active
  if (!isActive) return null;
  
  return (
    <div 
      ref={refractorRef}
      className="refractor-effect"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
        mixBlendMode: 'color-dodge'
      }}
    >
      <div className="refractor-layer refractor-primary-layer"></div>
      <div className="refractor-layer refractor-secondary-layer"></div>
      <div className="refractor-layer refractor-rgb-fringe-layer"></div>
    </div>
  );
};

export default RefractorEffect;
