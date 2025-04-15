
import React, { useEffect, useRef, useState } from 'react';
import './effects.css';

interface RefractorEffectProps {
  intensity?: number;
  speed?: number;
  colors?: string[];
  isActive: boolean;
  mousePosition: { x: number; y: number };
  animationEnabled?: boolean;
  angle?: number;
}

const RefractorEffect: React.FC<RefractorEffectProps> = ({
  intensity = 1.0,
  speed = 1.0,
  colors = ['rgba(255, 0, 128, 0.2)', 'rgba(0, 255, 255, 0.2)', 'rgba(255, 255, 0, 0.2)'],
  isActive,
  mousePosition,
  animationEnabled = true,
  angle
}) => {
  const refractorRef = useRef<HTMLDivElement>(null);
  const [colorPositions, setColorPositions] = useState<number[]>([0, 120, 240]);
  
  // Dynamic angle calculation based on mouse position or preset angle
  const calculateRefractorAngle = () => {
    if (angle !== undefined) return angle;
    return Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI);
  };
  
  // Apply refractor effect properties when active
  useEffect(() => {
    if (!refractorRef.current || !isActive) return;
    
    const refractorElement = refractorRef.current;
    
    // Apply intensity through CSS variables
    refractorElement.style.setProperty('--refractor-intensity', intensity.toString());
    refractorElement.style.setProperty('--refractor-speed', `${3 / speed}s`);
    
    // Set the refraction colors to simulate different light angles based on mouse position
    const hue1 = 120 + mousePosition.x * 60;
    const hue2 = 180 + mousePosition.y * 60;
    const hue3 = 240 + (mousePosition.x + mousePosition.y) * 30;
    
    // Apply custom colors if provided, otherwise generate dynamic colors
    if (colors && colors.length >= 3) {
      refractorElement.style.setProperty('--refractor-color-1', colors[0]);
      refractorElement.style.setProperty('--refractor-color-2', colors[1]);
      refractorElement.style.setProperty('--refractor-color-3', colors[2]);
    } else {
      refractorElement.style.setProperty(
        '--refractor-color-1', 
        `hsla(${hue1}, 100%, 50%, ${0.2 * intensity})`
      );
      refractorElement.style.setProperty(
        '--refractor-color-2', 
        `hsla(${hue2}, 100%, 50%, ${0.2 * intensity})`
      );
      refractorElement.style.setProperty(
        '--refractor-color-3', 
        `hsla(${hue3}, 100%, 50%, ${0.2 * intensity})`
      );
    }
    
    // Calculate refractor angle based on mouse position or preset angle
    const refractorAngle = calculateRefractorAngle();
    refractorElement.style.setProperty('--refractor-angle', `${refractorAngle}deg`);
    
    // Set animation status
    refractorElement.style.setProperty('--animation-enabled', animationEnabled ? '1' : '0');
    
    // RGB fringing effect (color separation)
    refractorElement.style.setProperty('--mouse-x', mousePosition.x.toString());
    refractorElement.style.setProperty('--mouse-y', mousePosition.y.toString());
    
  }, [intensity, isActive, mousePosition, speed, colors, animationEnabled, angle]);
  
  // Color shift animation
  useEffect(() => {
    if (!animationEnabled || !isActive) return;
    
    const intervalId = setInterval(() => {
      setColorPositions(prev => {
        return [
          (prev[0] + 1) % 360,
          (prev[1] + 1) % 360,
          (prev[2] + 1) % 360
        ];
      });
    }, 50);
    
    return () => clearInterval(intervalId);
  }, [animationEnabled, isActive]);
  
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
