
import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from './useMediaQuery';

interface MobileOptimizationOptions {
  /**
   * Threshold for low bandwidth detection in Kbps
   * @default 700
   */
  lowBandwidthThreshold?: number;
  
  /**
   * Default lazy loading setting
   * @default true
   */
  defaultLazyLoad?: boolean;
  
  /**
   * Default image quality (0-100)
   * @default 80
   */
  defaultImageQuality?: number;
}

interface MobileOptimizationResult {
  /**
   * Whether the device is mobile
   */
  isMobile: boolean;
  
  /**
   * Whether reduced motion is enabled
   */
  reducedMotion: boolean;
  
  /**
   * Whether the connection is low bandwidth
   */
  isLowBandwidth: boolean;
  
  /**
   * Whether to use lazy loading for images
   */
  lazyLoadImages: boolean;
  
  /**
   * Get the appropriate image quality based on connection
   */
  getImageQuality: () => number;
  
  /**
   * Whether to optimize animations
   */
  shouldOptimizeAnimations: boolean;
}

/**
 * Hook for mobile device and connection optimizations
 */
export function useMobileOptimization({
  lowBandwidthThreshold = 700,
  defaultLazyLoad = true,
  defaultImageQuality = 80
}: MobileOptimizationOptions = {}): MobileOptimizationResult {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const preferReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  
  // Check connection type and speed
  useEffect(() => {
    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        
        if (connection) {
          // Check if on a slow connection type
          const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                                 connection.effectiveType === '2g' || 
                                 connection.effectiveType === '3g';
          
          // Check if downlink is below threshold
          const isSlowDownlink = connection.downlink !== undefined && 
                                connection.downlink * 1000 < lowBandwidthThreshold;
          
          // Set low bandwidth if either condition is true
          setIsLowBandwidth(isSlowConnection || isSlowDownlink);
          
          // Add event listener for connection changes
          connection.addEventListener('change', checkConnection);
          return () => {
            connection.removeEventListener('change', checkConnection);
          };
        }
      }
    };
    
    checkConnection();
  }, [lowBandwidthThreshold]);
  
  const getImageQuality = useCallback(() => {
    if (isLowBandwidth) {
      return Math.min(defaultImageQuality, 50);
    }
    
    if (isMobile) {
      return Math.min(defaultImageQuality, 75);
    }
    
    return defaultImageQuality;
  }, [isLowBandwidth, isMobile, defaultImageQuality]);

  return {
    isMobile,
    reducedMotion: preferReducedMotion,
    isLowBandwidth,
    lazyLoadImages: defaultLazyLoad || isLowBandwidth || isMobile,
    getImageQuality,
    shouldOptimizeAnimations: isMobile || isLowBandwidth || preferReducedMotion
  };
}
