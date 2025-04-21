
import React, { useRef, useEffect } from 'react';
import { safeNumber } from '@/lib/utils/cardDefaults';

interface ShimmerEffectProps {
  intensity?: number;
  isActive: boolean;
  animationSpeed?: number;
}

const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  intensity = 1.0,
  isActive,
  animationSpeed = 1.0
}) => {
  const shimmerRef = useRef<HTMLDivElement>(null);
  
  // Apply shimmer effect when active
  useEffect(() => {
    if (!shimmerRef.current || !isActive) return;
    
    const element = shimmerRef.current;
    const safeIntensity = safeNumber(intensity, 0.7);
    const safeSpeed = safeNumber(animationSpeed, 1.0);
    
    // Update CSS variables
    element.style.setProperty('--shimmer-intensity', safeIntensity.toString());
    element.style.setProperty('--shimmer-speed', `${8 / safeSpeed}s`);
    
  }, [intensity, isActive, animationSpeed]);
  
  // Don't render if not active
  if (!isActive) return null;
  
  return (
    <div 
      ref={shimmerRef}
      className="shimmer-effect"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 4,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      <div 
        className="shimmer-shine" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
          animation: `shimmer var(--shimmer-speed, 8s) infinite linear`
        }}
      />
    </div>
  );
};

export default ShimmerEffect;
