
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLowEndDevice: boolean;
  canHandleComplexLighting: boolean;
}

export const useDeviceDetect = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLowEndDevice: false,
    canHandleComplexLighting: true
  });
  
  useEffect(() => {
    const checkDeviceCapabilities = () => {
      // Check screen size
      const width = window.innerWidth;
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;
      
      // Check for low-end devices
      const isLowEndDevice = detectLowEndDevice();
      
      // Determine if device can handle complex lighting
      const canHandleComplexLighting = isDesktop || (isTablet && !isLowEndDevice);
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isLowEndDevice,
        canHandleComplexLighting
      });
    };
    
    // Try to detect if the device is low-end
    const detectLowEndDevice = (): boolean => {
      // Check for navigator.deviceMemory (Chrome)
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory;
        if (memory && memory < 4) {
          return true;
        }
      }
      
      // Check for navigator.hardwareConcurrency (CPU cores)
      if ('hardwareConcurrency' in navigator) {
        const cores = navigator.hardwareConcurrency;
        if (cores && cores <= 2) {
          return true;
        }
      }
      
      // Mobile heuristic - most mobile browsers have poor WebGL performance
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Check for WebGL capabilities
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          return true; // No WebGL support
        }
        
        // Check max texture size as a rough performance indicator
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if (maxTextureSize < 4096) {
          return true; // Limited texture support
        }
        
        return isMobileDevice; // Default to treating mobile as low-end unless proven otherwise
      } catch (e) {
        return true; // Error occurred, assume it's a low-end device
      }
    };
    
    checkDeviceCapabilities();
    
    // Update on resize
    window.addEventListener('resize', checkDeviceCapabilities);
    return () => window.removeEventListener('resize', checkDeviceCapabilities);
  }, []);
  
  return deviceInfo;
};
