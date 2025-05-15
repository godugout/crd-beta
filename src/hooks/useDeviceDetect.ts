
import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isHighPerformance: boolean;
  supportsWebGL2: boolean;
  supportsWebGPU: boolean;
  hasTouchScreen: boolean;
  pixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  connection: {
    effectiveType: string;
    saveData: boolean;
  };
}

export function useDeviceDetect(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isHighPerformance: true,
    supportsWebGL2: true,
    supportsWebGPU: false,
    hasTouchScreen: false,
    pixelRatio: 1,
    screenWidth: 1920,
    screenHeight: 1080,
    connection: {
      effectiveType: '4g',
      saveData: false
    }
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // Check for mobile/tablet
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTabletDevice = /iPad|Tablet|PlayBook|Silk|Android(?!.*Mobile)/i.test(userAgent);
      
      // Screen dimensions
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio || 1;
      
      // Check for touch screen
      const hasTouchScreen = ('ontouchstart' in window) || 
                            (navigator.maxTouchPoints > 0) || 
                            ('msMaxTouchPoints' in navigator && (navigator as any).msMaxTouchPoints > 0);
      
      // Network information
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection || {
                          effectiveType: '4g',
                          saveData: false
                        };
      
      // Performance detection logic
      const isLowPerformanceDevice = () => {
        // Mobile or tablet with poor touch events generally means lower performance
        if ((isMobileDevice || isTabletDevice) && hasTouchScreen) {
          return true;
        }
        
        // Low pixel ratio often indicates lower-end devices
        if (devicePixelRatio < 2 && screenWidth < 1366) {
          return true;
        }
        
        // Check for WebGL capabilities
        try {
          const canvas = document.createElement('canvas');
          // Fix: Cast to WebGLRenderingContext to access WebGL-specific properties
          const gl = (canvas.getContext('webgl') || 
                    canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
          
          if (!gl) {
            return true; // No WebGL support
          }
          
          // Now we can safely access WebGL properties
          const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
          if (maxTextureSize < 4096) {
            return true; // Limited texture support
          }
          
        } catch (e) {
          return true; // Error checking WebGL means we should assume low performance
        }
        
        return false;
      };
      
      // WebGL2 support
      let webGL2Support = false;
      try {
        const canvas = document.createElement('canvas');
        webGL2Support = !!canvas.getContext('webgl2');
      } catch (e) {
        webGL2Support = false;
      }
      
      // WebGPU support (experimental)
      const webGPUSupport = 'gpu' in navigator;
      
      setCapabilities({
        isMobile: isMobileDevice && !isTabletDevice,
        isTablet: isTabletDevice,
        isDesktop: !isMobileDevice && !isTabletDevice,
        isHighPerformance: !isLowPerformanceDevice(),
        supportsWebGL2: webGL2Support,
        supportsWebGPU: webGPUSupport,
        hasTouchScreen,
        pixelRatio: devicePixelRatio,
        screenWidth,
        screenHeight,
        connection: {
          effectiveType: connection.effectiveType || '4g',
          saveData: connection.saveData || false
        }
      });
    };
    
    detectCapabilities();
    
    // Update on resize for responsive capabilities
    window.addEventListener('resize', detectCapabilities);
    
    // If connection API is available, listen for changes
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', detectCapabilities);
    }
    
    return () => {
      window.removeEventListener('resize', detectCapabilities);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', detectCapabilities);
      }
    };
  }, []);
  
  return capabilities;
}

export default useDeviceDetect;
