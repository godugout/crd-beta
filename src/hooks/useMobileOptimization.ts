
import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';

export interface MobileOptimizationOptions {
  lazyLoadImages?: boolean;
  reducedMotion?: boolean;
  optimizeInteractions?: boolean;
  compressionLevel?: 'low' | 'medium' | 'high';
}

export function useMobileOptimization(options: MobileOptimizationOptions = {}) {
  const isMobile = useIsMobile();
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [isBatterySaving, setIsBatterySaving] = useState(false);

  // Default options
  const {
    lazyLoadImages = true,
    reducedMotion = false,
    optimizeInteractions = true,
    compressionLevel = 'medium',
  } = options;

  // Check for network connection quality
  useEffect(() => {
    if (!isMobile) return;

    // Use the Network Information API if available
    const connection = (navigator as any).connection;
    
    if (connection) {
      const updateConnectionInfo = () => {
        // Check if using cellular connection or slow connection
        const isSlow = connection.type === 'cellular' || 
                      (connection.effectiveType && 
                      ['slow-2g', '2g', '3g'].includes(connection.effectiveType));
        
        setIsLowBandwidth(isSlow);
      };

      updateConnectionInfo();
      connection.addEventListener('change', updateConnectionInfo);
      return () => connection.removeEventListener('change', updateConnectionInfo);
    }
  }, [isMobile]);

  // Check battery status if supported
  useEffect(() => {
    if (!isMobile || !('getBattery' in navigator)) return;
    
    const checkBatteryStatus = async () => {
      try {
        const battery = await (navigator as any).getBattery();
        
        const updateBatteryStatus = () => {
          setIsBatterySaving(battery.level <= 0.2 && !battery.charging);
        };
        
        updateBatteryStatus();
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        
        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingchange', updateBatteryStatus);
        };
      } catch (error) {
        console.error('Battery status check failed:', error);
      }
    };
    
    checkBatteryStatus();
  }, [isMobile]);

  // Determine image quality based on device conditions
  const getImageQuality = () => {
    if (!isMobile) return 100;
    if (isLowBandwidth || isBatterySaving) {
      return compressionLevel === 'high' ? 60 : 
             compressionLevel === 'medium' ? 75 : 85;
    }
    return 90;
  };

  return {
    isMobile,
    isLowBandwidth,
    isBatterySaving,
    lazyLoadImages,
    reducedMotion: reducedMotion || isBatterySaving,
    optimizeInteractions,
    getImageQuality
  };
}
