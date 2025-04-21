
import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface OptimizedRenderingConfig {
  resolution: number;
  maxFPS: number;
  useLowQualityTextures: boolean;
  disablePostProcessing: boolean;
  disableShadows: boolean;
}

// Define the network connection interface
interface NetworkInformation {
  effectiveType: string;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsMobile(width < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check network conditions
    const checkNetworkCondition = () => {
      if ('connection' in navigator) {
        // Cast to our defined interface to handle the properties correctly
        const connection = (
          navigator as any
        ).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection as NetworkInformation | undefined;
        
        if (connection) {
          const type = connection.effectiveType;
          setConnectionType(type);
          
          // Consider 2G and slow 3G as low bandwidth
          setIsLowBandwidth(['slow-2g', '2g', 'slow-3g'].includes(type));
          
          if (connection.addEventListener) {
            connection.addEventListener('change', checkNetworkCondition);
          }
        }
      }
    };
    
    checkNetworkCondition();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if ('connection' in navigator) {
        const connection = (
          navigator as any
        ).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection as NetworkInformation | undefined;
        
        if (connection && connection.removeEventListener) {
          connection.removeEventListener('change', checkNetworkCondition);
        }
      }
    };
  }, []);
  
  // Calculate if animations should be optimized based on device and settings
  const shouldOptimizeAnimations = isMobile || isLowBandwidth;
  
  // Define if interactions should be optimized (haptics, etc)
  const optimizeInteractions = isMobile;
  
  // Determine if images should be lazy loaded
  const lazyLoadImages = isMobile || isLowBandwidth;
  
  // Determine image quality based on device and network
  const getImageQuality = () => {
    if (isLowBandwidth) return 60; // Lower quality for poor connections
    if (isMobile) return 80; // Good balance for mobile
    return 90; // High quality for desktop
  };
  
  const reduceEffects = isMobile;
  const lowPowerMode = isMobile;
  
  const optimizedRendering: OptimizedRenderingConfig = {
    resolution: isMobile ? 0.75 : 1,
    maxFPS: isMobile ? 30 : 60,
    useLowQualityTextures: isMobile,
    disablePostProcessing: isMobile,
    disableShadows: isMobile,
  };
  
  return {
    isMobile,
    viewportWidth,
    reduceEffects,
    lowPowerMode,
    optimizedRendering,
    // Add the new properties
    isLowBandwidth,
    connectionType,
    shouldOptimizeAnimations,
    optimizeInteractions,
    lazyLoadImages,
    getImageQuality
  };
};
