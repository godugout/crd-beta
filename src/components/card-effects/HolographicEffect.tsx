
import React, { useEffect, useRef, useState } from 'react';
import './effects.css';

interface HolographicEffectProps {
  intensity?: number;
  pattern?: 'linear' | 'circular' | 'angular' | 'geometric';
  colorScheme?: 'rainbow' | 'blue-purple' | 'gold-green' | 'custom';
  customColors?: string[];
  isActive: boolean;
  mousePosition: { x: number; y: number };
  animationEnabled?: boolean;
  sparklesEnabled?: boolean;
  sparkleCount?: number;
  borderWidth?: number;
}

const HolographicEffect: React.FC<HolographicEffectProps> = ({
  intensity = 1.0,
  pattern = 'linear',
  colorScheme = 'rainbow',
  customColors,
  isActive,
  mousePosition,
  animationEnabled = true,
  sparklesEnabled = true,
  sparkleCount = 25,
  borderWidth = 1
}) => {
  const holographicRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([]);
  
  // Generate color gradient based on selected scheme
  const getColorGradient = () => {
    switch (colorScheme) {
      case 'rainbow':
        return 'linear-gradient(var(--holo-angle), rgba(255, 0, 0, 0.7), rgba(255, 255, 0, 0.7), rgba(0, 255, 0, 0.7), rgba(0, 255, 255, 0.7), rgba(0, 0, 255, 0.7), rgba(255, 0, 255, 0.7), rgba(255, 0, 0, 0.7))';
      case 'blue-purple':
        return 'linear-gradient(var(--holo-angle), rgba(100, 100, 255, 0.7), rgba(180, 100, 255, 0.7), rgba(100, 200, 255, 0.7), rgba(150, 100, 255, 0.7))';
      case 'gold-green':
        return 'linear-gradient(var(--holo-angle), rgba(255, 215, 0, 0.7), rgba(200, 255, 100, 0.7), rgba(255, 180, 0, 0.7), rgba(150, 255, 150, 0.7))';
      case 'custom':
        if (customColors && customColors.length >= 2) {
          const colorStops = customColors.map((color, index) => {
            const percent = (index / (customColors.length - 1)) * 100;
            return `${color} ${percent}%`;
          }).join(', ');
          return `linear-gradient(var(--holo-angle), ${colorStops})`;
        }
        // Fallback to rainbow if custom colors are invalid
        return 'linear-gradient(var(--holo-angle), rgba(255, 0, 0, 0.7), rgba(255, 255, 0, 0.7), rgba(0, 255, 0, 0.7), rgba(0, 255, 255, 0.7), rgba(0, 0, 255, 0.7), rgba(255, 0, 255, 0.7), rgba(255, 0, 0, 0.7))';
      default:
        return 'linear-gradient(var(--holo-angle), rgba(255, 0, 0, 0.7), rgba(255, 255, 0, 0.7), rgba(0, 255, 0, 0.7), rgba(0, 255, 255, 0.7), rgba(0, 0, 255, 0.7), rgba(255, 0, 255, 0.7), rgba(255, 0, 0, 0.7))';
    }
  };
  
  // Apply holographic effect properties when active
  useEffect(() => {
    if (!holographicRef.current || !isActive) return;
    
    const holographicElement = holographicRef.current;
    
    // Apply intensity through CSS variables
    holographicElement.style.setProperty('--holo-intensity', intensity.toString());
    
    // Set pattern type
    holographicElement.style.setProperty('--holo-pattern', pattern);
    
    // Calculate angle based on mouse position
    const angle = Math.atan2(mousePosition.y - 0.5, mousePosition.x - 0.5) * (180 / Math.PI);
    holographicElement.style.setProperty('--holo-angle', `${angle}deg`);
    
    // Set animation status
    holographicElement.style.setProperty('--animation-enabled', animationEnabled ? '1' : '0');
    
    // Apply border width
    holographicElement.style.setProperty('--holo-border-width', `${borderWidth}px`);
    
    // Set background gradient
    holographicElement.style.background = getColorGradient();
    holographicElement.style.backgroundSize = '400% 400%';
    
    // Apply pattern-specific styles
    switch (pattern) {
      case 'circular':
        holographicElement.style.background = `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 255, 255, 0.9) 0%, ${getColorGradient().replace('linear-gradient(var(--holo-angle),', '').slice(0, -1)} 60%, rgba(255, 255, 255, 0.2) 100%)`;
        holographicElement.style.backgroundSize = '200% 200%';
        break;
      case 'angular':
        holographicElement.style.background = `conic-gradient(from ${angle}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 0, 0, 0.7), rgba(255, 255, 0, 0.7), rgba(0, 255, 0, 0.7), rgba(0, 255, 255, 0.7), rgba(0, 0, 255, 0.7), rgba(255, 0, 255, 0.7), rgba(255, 0, 0, 0.7))`;
        holographicElement.style.backgroundSize = '100% 100%';
        break;
      case 'geometric':
        holographicElement.style.backgroundImage = getColorGradient();
        holographicElement.style.backgroundSize = '100px 100px';
        holographicElement.style.backgroundPosition = `${mousePosition.x * 30}px ${mousePosition.y * 30}px`;
        holographicElement.classList.add('geometric-pattern');
        break;
      default:
        // Linear pattern (default)
        holographicElement.classList.remove('geometric-pattern');
        holographicElement.style.backgroundImage = getColorGradient();
        holographicElement.style.backgroundSize = '400% 400%';
    }
    
  }, [intensity, isActive, mousePosition, pattern, colorScheme, customColors, animationEnabled, borderWidth]);
  
  // Generate sparkles
  useEffect(() => {
    if (!sparklesEnabled || !isActive) {
      setSparkles([]);
      return;
    }
    
    // Generate random sparkles
    const newSparkles = Array.from({ length: sparkleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    
    setSparkles(newSparkles);
    
    // Regenerate sparkles periodically if animation is enabled
    if (animationEnabled) {
      const intervalId = setInterval(() => {
        setSparkles(prev => {
          return prev.map(sparkle => ({
            ...sparkle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 0.5 + Math.random() * 4,
            delay: Math.random() * 5,
          }));
        });
      }, 5000);
      
      return () => clearInterval(intervalId);
    }
  }, [sparklesEnabled, isActive, sparkleCount, animationEnabled]);
  
  // Don't render anything if effect is not active
  if (!isActive) return null;
  
  return (
    <>
      <div 
        ref={holographicRef}
        className="holographic-effect"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          mixBlendMode: 'color-dodge',
          opacity: intensity * 0.8,
          borderRadius: 'inherit',
        }}
      >
        <div className="holographic-overlay"></div>
        <div className="holographic-border" style={{ borderWidth }}></div>
      </div>
      
      {sparklesEnabled && (
        <div 
          ref={sparklesRef}
          className="holographic-sparkles"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 11,
            pointerEvents: 'none',
            overflow: 'hidden',
            borderRadius: 'inherit',
          }}
        >
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="sparkle"
              style={{
                position: 'absolute',
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`,
                backgroundColor: 'white',
                borderRadius: '50%',
                opacity: 0,
                boxShadow: '0 0 4px 2px rgba(255, 255, 255, 0.8)',
                animation: `sparkle-appear 3s ease-in-out ${sparkle.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default HolographicEffect;
