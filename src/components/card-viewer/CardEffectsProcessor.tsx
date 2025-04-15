
import React, { useRef, useEffect, useState } from 'react';

interface CardEffectsProcessorProps {
  effects: string[];
}

const CardEffectsProcessor: React.FC<CardEffectsProcessorProps> = ({ effects }) => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Track mouse movement across the whole document to affect effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to 0-1 range
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });
    };
    
    // For devices with touch screens
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX / window.innerWidth;
        const y = touch.clientY / window.innerHeight;
        setMousePos({ x, y });
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Update CSS variables based on mouse position
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    container.style.setProperty('--mouse-x', `${mousePos.x * 100}%`);
    container.style.setProperty('--mouse-y', `${mousePos.y * 100}%`);
    
    // Create dynamic values based on mouse position
    const hue = (mousePos.x * 360) % 360; // 0-360 degrees
    const saturation = 50 + (mousePos.y * 50); // 50-100%
    const lightness = 40 + (mousePos.y * 20); // 40-60%
    
    container.style.setProperty('--dynamic-hue', `${hue}`);
    container.style.setProperty('--dynamic-saturation', `${saturation}%`);
    container.style.setProperty('--dynamic-lightness', `${lightness}%`);
    
    // Set animation speed based on mouse movement speed
    container.style.setProperty('--effect-speed', `${2 + mousePos.y * 3}s`);
    
    // Set hologram intensity
    container.style.setProperty('--hologram-intensity', `${0.5 + mousePos.y * 0.5}`);
    container.style.setProperty('--shimmer-speed', `${3 + mousePos.x * 2}s`);
    container.style.setProperty('--chrome-intensity', `${0.7 + mousePos.x * 0.3}`);
    container.style.setProperty('--gold-intensity', `${0.6 + mousePos.y * 0.4}`);
  }, [mousePos]);
  
  // Determine which effect classes to apply
  const effectClasses = effects.map(effect => {
    switch (effect.toLowerCase()) {
      case 'holographic':
        return 'effect-holographic spectral-hologram';
      case 'shimmer':
        return 'effect-shimmer';
      case 'refractor':
        return 'effect-refractor';
      case 'gold':
        return 'card-gold-foil';
      case 'chrome':
        return 'card-chrome';
      case 'vintage':
        return 'effect-vintage';
      default:
        return '';
    }
  });

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-10 ${effectClasses.join(' ')}`}
      style={{
        // Base CSS variables for effects
        '--motion-speed': '1',
        '--pulse-intensity': '1',
      } as React.CSSProperties}
    >
      {/* Holographic spectral layer */}
      {effects.includes('holographic') && (
        <div className="spectral-hologram-layer"></div>
      )}
      
      {/* Parallax layers */}
      {effects.some(e => ['holographic', 'refractor'].includes(e)) && (
        <>
          <div className="parallax-layer parallax-layer-1"></div>
          <div className="parallax-layer parallax-layer-2"></div>
        </>
      )}
      
      {/* Microtext layer for security patterns */}
      {effects.includes('refractor') && (
        <div className="microtext-layer">
          {Array(20).fill(0).map((_, i) => (
            <div key={i} style={{ 
              position: 'absolute',
              top: `${i * 5}%`, 
              left: 0, 
              right: 0, 
              fontSize: '3px',
              opacity: 0.2,
              letterSpacing: '1px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              transform: `rotate(${(i % 2) * 180}deg)`,
            }}>
              {Array(30).fill('CARDSHOW AUTHENTIC').join(' ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardEffectsProcessor;
