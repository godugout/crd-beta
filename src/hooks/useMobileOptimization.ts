
import { useState, useEffect } from 'react';

export interface MobileOptimizationOptions {
  highQualityThreshold?: number; // Device memory in GB to consider high quality
  mediumQualityThreshold?: number; // Device memory in GB to consider medium quality
  defaultImageQuality?: number; // Default image quality (0-100)
  defaultLazyLoading?: boolean; // Whether to lazy load images by default
}

export const useMobileOptimization = (options?: MobileOptimizationOptions) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(false);
  const [shouldOptimizeAnimations, setShouldOptimizeAnimations] = useState<boolean>(false);
  const [lazyLoadImages, setLazyLoadImages] = useState<boolean>(
    options?.defaultLazyLoading ?? true
  );
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const checkConnectionSpeed = () => {
      // Check if navigator.connection is available (Chrome, Edge, Opera)
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          // Check for slow connections
          const isSlowConnection = 
            connection.saveData || 
            connection.effectiveType === 'slow-2g' ||
            connection.effectiveType === '2g' ||
            connection.effectiveType === '3g';
          
          setIsLowBandwidth(isSlowConnection);
          setShouldOptimizeAnimations(isSlowConnection || isMobile);
        }
      } else {
        // Fallback for browsers without connection API
        setIsLowBandwidth(false);
        setShouldOptimizeAnimations(isMobile);
      }
    };
    
    checkMobile();
    checkConnectionSpeed();
    
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);
  
  // Check if device is low-end
  const isLowEndDevice = (): boolean => {
    // Check for device memory (Chrome only)
    if ('deviceMemory' in navigator) {
      return (navigator as any).deviceMemory < 4;
    }
    
    // Check for hardware concurrency (CPU cores)
    if ('hardwareConcurrency' in navigator) {
      return navigator.hardwareConcurrency <= 4;
    }
    
    // If can't detect, assume mobile devices are lower-end
    return isMobile;
  };

  // Get appropriate image quality based on device and connection
  const getImageQuality = (): number => {
    if (isLowBandwidth) return 60; // Lower quality for slow connections
    
    if ('deviceMemory' in navigator) {
      const memory = (navigator as any).deviceMemory;
      
      if (memory >= (options?.highQualityThreshold || 6)) {
        return 90; // High quality for high-end devices
      } else if (memory >= (options?.mediumQualityThreshold || 4)) {
        return 75; // Medium quality
      }
    }
    
    return isMobile ? 70 : options?.defaultImageQuality || 85; // Default quality
  };

  // For animations and interactions optimization
  const optimizeInteractions = (): boolean => {
    return isMobile || isLowEndDevice() || isLowBandwidth;
  };

  // For reducing effects on low-end devices
  const reduceEffects = (): boolean => {
    return isLowEndDevice() || isLowBandwidth;
  };

  return {
    isMobile,
    isLowBandwidth,
    shouldOptimizeAnimations,
    lazyLoadImages,
    getImageQuality,
    optimizeInteractions,
    reduceEffects
  };
};

export default useMobileOptimization;
