
import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface MobileOptimizationOptions {
  reduceEffects?: boolean;
  lazyLoadImages?: boolean;
  optimizeInteractions?: boolean;
  shouldOptimizeAnimations?: boolean;
}

export const useMobileOptimization = (options?: MobileOptimizationOptions) => {
  const isMobile = useIsMobile();
  const [bandwidthLevel, setBandwidthLevel] = useState<'high' | 'medium' | 'low'>('high');

  // Detect connection quality (if available in browser)
  useEffect(() => {
    const connection = (navigator as any).connection;
    
    if (connection) {
      const updateConnectionStatus = () => {
        const effectiveType = connection.effectiveType;
        if (effectiveType === '4g') setBandwidthLevel('high');
        else if (effectiveType === '3g') setBandwidthLevel('medium');
        else setBandwidthLevel('low');
      };
      
      updateConnectionStatus();
      connection.addEventListener('change', updateConnectionStatus);
      
      return () => {
        connection.removeEventListener('change', updateConnectionStatus);
      };
    }
    
    return undefined;
  }, []);

  // Determine if we should reduce animations/effects based on device and options
  const shouldOptimizeAnimations = () => {
    if (options?.reduceEffects !== undefined) return options.reduceEffects;
    return isMobile || bandwidthLevel !== 'high';
  };

  // Determine if we should lazy load images
  const lazyLoadImages = options?.lazyLoadImages !== false;

  // Get image quality based on bandwidth and device
  const getImageQuality = () => {
    if (!isMobile && bandwidthLevel === 'high') return 0.92; // Desktop, high bandwidth
    if (bandwidthLevel === 'medium') return 0.80; // Medium bandwidth
    return 0.70; // Low bandwidth or mobile
  };

  // Check if we're on a low bandwidth connection
  const isLowBandwidth = bandwidthLevel === 'low';

  // Should we optimize touch interactions?
  const optimizeInteractions = options?.optimizeInteractions !== false && isMobile;

  // Implementation of reduceEffects property
  const reduceEffects = options?.reduceEffects || isMobile;

  return {
    isMobile,
    bandwidthLevel,
    shouldOptimizeAnimations,
    lazyLoadImages,
    getImageQuality,
    isLowBandwidth,
    optimizeInteractions,
    reduceEffects
  };
};
