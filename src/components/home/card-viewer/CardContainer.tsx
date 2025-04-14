
import React, { CSSProperties, useEffect, useRef } from 'react';

interface CardContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  isMoving: boolean;
  effectSettings: {
    motionSpeed: number;
    pulseIntensity: number;
    shimmerSpeed: number;
    goldIntensity: number;
    chromeIntensity: number;
    vintageIntensity: number;
    refractorIntensity: number;
    spectralIntensity: number;
  };
  activeEffects: string[];
  children: React.ReactNode;
}

const CardContainer: React.FC<CardContainerProps> = ({
  containerRef,
  onMouseMove,
  isMoving,
  effectSettings,
  activeEffects,
  children
}) => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  // Handle spotlight movement to enhance visual effects
  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = spotlight.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate relative mouse position
      const relativeX = ((e.clientX - centerX) / rect.width) * 2;
      const relativeY = ((e.clientY - centerY) / rect.height) * 2;
      
      // Limit movement range to maintain visibility
      const moveX = relativeX * 30;
      const moveY = relativeY * 30;
      
      // Apply smooth movement to spotlight
      spotlight.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Generate CSS variables for effect intensities
  const containerStyle: CSSProperties = {
    '--motion-speed': `${effectSettings.motionSpeed}`,
    '--pulse-intensity': `${effectSettings.pulseIntensity}`,
    '--shimmer-speed': `${effectSettings.shimmerSpeed}s`,
    '--gold-intensity': `${effectSettings.goldIntensity}`,
    '--chrome-intensity': `${effectSettings.chromeIntensity}`,
    '--vintage-intensity': `${effectSettings.vintageIntensity}`,
    '--refractor-intensity': `${effectSettings.refractorIntensity}`,
    '--hologram-intensity': `${effectSettings.spectralIntensity}`,
    position: 'relative',
  } as CSSProperties;
  
  // Add glimmer and reflection effects for special effects
  const hasRefractor = activeEffects.includes('Refractor');
  const hasHolographic = activeEffects.includes('Holographic');
  const hasShimmer = activeEffects.includes('Shimmer');
  const hasGoldFoil = activeEffects.includes('Gold Foil');
  
  // Determine container class based on active effects
  const getContainerClass = () => {
    const baseClass = 'card-3d-container relative w-80 h-[450px] flex items-center justify-center transition-transform duration-500';
    const animationClass = isMoving ? 'mouse-move' : 'dynamic-card floating-card';
    const effectClass = hasRefractor || hasHolographic 
      ? 'has-premium-effects' 
      : hasShimmer || hasGoldFoil 
        ? 'has-special-effects' 
        : 'standard-card';
        
    return `${baseClass} ${animationClass} ${effectClass}`;
  };

  return (
    <div 
      ref={containerRef}
      className={getContainerClass()}
      onMouseMove={onMouseMove}
      style={containerStyle}
    >
      {/* Enhanced lighting effects */}
      <div ref={spotlightRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary spotlight for dynamic lighting */}
        <div 
          className="absolute w-[200%] h-[200%] left-[-50%] top-[-50%] opacity-50"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 20%, transparent 60%)',
            transform: 'scale(0.5)',
            transition: 'transform 0.5s ease-out',
          }}
        ></div>
        
        {/* Secondary accent lights for effect enhancement */}
        {(hasRefractor || hasHolographic) && (
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full blur-2xl opacity-20"
              style={{
                background: hasRefractor 
                  ? 'radial-gradient(circle at center, rgba(0,150,255,0.8) 0%, rgba(0,100,255,0.4) 50%, transparent 75%)' 
                  : 'radial-gradient(circle at center, rgba(255,100,255,0.8) 0%, rgba(100,0,255,0.4) 50%, transparent 75%)'
              }}
            ></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-2xl opacity-20"
              style={{
                background: hasRefractor 
                  ? 'radial-gradient(circle at center, rgba(0,200,255,0.8) 0%, rgba(0,100,200,0.4) 50%, transparent 75%)' 
                  : 'radial-gradient(circle at center, rgba(255,200,100,0.8) 0%, rgba(200,100,0,0.4) 50%, transparent 75%)'
              }}
            ></div>
          </div>
        )}
        
        {/* Gold accent lighting */}
        {hasGoldFoil && (
          <div className="absolute inset-0">
            <div className="absolute top-[-10%] left-[20%] w-[30%] h-[30%] rounded-full blur-xl opacity-30"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,215,0,0.8) 0%, rgba(255,180,0,0.4) 50%, transparent 75%)'
              }}
            ></div>
          </div>
        )}
      </div>
      
      {/* Add subtle shadow for more depth and natural look */}
      <div className="absolute inset-0 rounded-2xl opacity-40 blur-xl bg-gradient-to-br from-black/30 via-transparent to-black/30 -z-10"></div>
      
      {/* Natural card reflection */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-[90%] bg-gradient-to-t from-black/15 to-transparent blur-2xl opacity-30 rounded-[50%] -z-10"></div>
      
      {children}
      
      {/* Interactive particle effects for premium cards */}
      {(hasRefractor || hasHolographic) && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="card-particles"></div>
        </div>
      )}
    </div>
  );
};

export default CardContainer;
