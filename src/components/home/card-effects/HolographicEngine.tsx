
import React, { useRef, useEffect, useState } from 'react';
import './HolographicEffects.css';

interface HolographicEngineProps {
  active: boolean;
  intensity?: number;
  pattern?: 'linear' | 'circular' | 'angular' | 'geometric';
  colorMode?: 'rainbow' | 'blue-purple' | 'gold-green' | 'custom';
  customColors?: string[];
  animated?: boolean;
  microtext?: string;
  particleCount?: number;
  borderWidth?: number;
}

const HolographicEngine: React.FC<HolographicEngineProps> = ({
  active,
  intensity = 0.8,
  pattern = 'linear',
  colorMode = 'rainbow',
  customColors,
  animated = true,
  microtext = '',
  particleCount = 20,
  borderWidth = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number, delay: number}>>([]);
  const [initialized, setInitialized] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  
  // Set up holographic effect and event listeners
  useEffect(() => {
    if (!active || !containerRef.current) return;
    
    // Initialize particles
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 5
    }));
    
    setParticles(newParticles);
    setInitialized(true);
    
    // Mouse move handler for desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
      updateHolographicEffect(x, y);
    };
    
    // Device orientation handler for mobile
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null && e.gamma !== null) {
        setDeviceOrientation({
          alpha: e.alpha, // 0 to 360 - rotation around z-axis
          beta: e.beta,   // -180 to 180 - front to back motion
          gamma: e.gamma  // -90 to 90 - left to right tilt
        });
        
        // Convert orientation to normalized positions
        const x = (e.gamma || 0) / 90 * 0.5 + 0.5; // -90 to 90 -> 0 to 1
        const y = (e.beta || 0) / 180 * 0.5 + 0.5; // -180 to 180 -> 0 to 1
        
        updateHolographicEffect(x, y);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation as EventListener);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation as EventListener);
    };
  }, [active, particleCount]);
  
  // Function to update the holographic effect based on position
  const updateHolographicEffect = (x: number, y: number) => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    
    // Calculate angle based on position
    const angleRad = Math.atan2(y - 0.5, x - 0.5);
    const angleDeg = angleRad * (180 / Math.PI);
    
    // Apply holographic effect CSS variables
    element.style.setProperty('--hologram-position-x', `${x * 100}%`);
    element.style.setProperty('--hologram-position-y', `${y * 100}%`);
    element.style.setProperty('--hologram-angle', `${angleDeg}deg`);
    element.style.setProperty('--hologram-intensity', intensity.toString());
    
    // Update pattern type
    element.className = `holographic-engine ${pattern}-pattern ${colorMode}-color ${animated ? 'animated' : 'static'}`;
    
    // Apply custom colors if provided
    if (colorMode === 'custom' && customColors && customColors.length > 1) {
      const gradient = customColors.map((color, i) => {
        const percent = (i / (customColors.length - 1)) * 100;
        return `${color} ${percent}%`;
      }).join(', ');
      
      element.style.setProperty('--hologram-colors', gradient);
    }
  };
  
  // Regenerate particles periodically for animation
  useEffect(() => {
    if (!active || !animated) return;
    
    const intervalId = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          delay: Math.random() * 5
        }))
      );
    }, 7000);
    
    return () => clearInterval(intervalId);
  }, [active, animated]);
  
  // Early return if not active
  if (!active) return null;
  
  return (
    <div 
      ref={containerRef}
      className={`holographic-engine ${pattern}-pattern ${colorMode}-color ${animated ? 'animated' : 'static'}`}
      style={{ 
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
        borderRadius: 'inherit',
        overflow: 'hidden',
        '--hologram-intensity': intensity.toString(),
        '--hologram-border-width': `${borderWidth}px`
      } as React.CSSProperties}
    >
      {/* Holographic rainbow layer */}
      <div className="hologram-rainbow-layer"></div>
      
      {/* Holographic border */}
      <div className="hologram-border"></div>
      
      {/* Holographic light reflection */}
      <div className="hologram-light-reflection"></div>
      
      {/* Hologram particles/sparkles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="hologram-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`
          }}
        ></div>
      ))}
      
      {/* Microtext security feature (hidden on small devices) */}
      {microtext && (
        <div className="hologram-microtext hidden md:block">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="microtext-line" style={{
              top: `${i * 10}%`,
              transform: `rotate(${i % 2 === 0 ? 0 : 180}deg)`
            }}>
              {microtext.repeat(50)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HolographicEngine;
