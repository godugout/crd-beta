
import { useState, useEffect } from 'react';

export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsMobile(width < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return {
    isMobile,
    viewportWidth,
    reduceEffects: isMobile,
    lowPowerMode: isMobile,
    optimizedRendering: {
      resolution: isMobile ? 0.75 : 1,
      maxFPS: isMobile ? 30 : 60,
      useLowQualityTextures: isMobile,
      disablePostProcessing: isMobile,
      disableShadows: isMobile,
    }
  };
};
