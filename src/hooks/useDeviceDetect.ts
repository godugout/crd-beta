
import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  browserName: string;
  browserVersion: string;
  os: string;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  isMobile: boolean;   // Added for convenience
  isTablet: boolean;   // Added for convenience  
  isDesktop: boolean;  // Added for convenience
  webGLSupport: boolean;
  webGLVersion: number;
  touchSupport: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  maxTextureSize: number | null;
  gpuInfo: string | null;
}

export function useDeviceDetect(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    browserName: '',
    browserVersion: '',
    os: '',
    mobile: false,
    tablet: false,
    desktop: true,
    isMobile: false,   // Added for convenience
    isTablet: false,   // Added for convenience
    isDesktop: true,   // Added for convenience
    webGLSupport: false,
    webGLVersion: 0,
    touchSupport: false,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    maxTextureSize: null,
    gpuInfo: null,
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Detect browser and version
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    
    if (ua.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)![1];
    } else if (ua.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)![1];
    } else if (ua.indexOf('Safari') > -1) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/([0-9.]+)/)![1];
    } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) {
      browserName = 'Internet Explorer';
      browserVersion = ua.match(/(?:MSIE |rv:)([0-9.]+)/)![1];
    } else if (ua.indexOf('Edge') > -1) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edge\/([0-9.]+)/)![1];
    }
    
    // Detect OS
    let os = 'Unknown';
    if (ua.indexOf('Windows') > -1) os = 'Windows';
    else if (ua.indexOf('Mac') > -1) os = 'macOS';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';
    else if (ua.indexOf('Android') > -1) os = 'Android';
    else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) os = 'iOS';
    
    // Detect device type
    const mobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const tablet = /iPad|Android(?!.*Mobile)/i.test(ua);
    const desktop = !mobile && !tablet;
    
    // Check for touch support
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Check WebGL support and get version
    let webGLSupport = false;
    let webGLVersion = 0;
    let maxTextureSize = null;
    let gpuInfo = null;
    
    try {
      const canvas = document.createElement('canvas');
      
      // Try WebGL2 first
      const gl2 = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
      if (gl2) {
        webGLSupport = true;
        webGLVersion = 2;
        maxTextureSize = gl2.getParameter(gl2.MAX_TEXTURE_SIZE);
        const debugInfo = gl2.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          gpuInfo = gl2.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      } else {
        // Fall back to WebGL1
        const gl = (
          canvas.getContext('webgl') || 
          canvas.getContext('experimental-webgl')
        ) as WebGLRenderingContext | null;
        
        if (gl) {
          webGLSupport = true;
          webGLVersion = 1;
          maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            gpuInfo = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      }
    } catch (e) {
      console.error('Error detecting WebGL support:', e);
    }
    
    setCapabilities({
      browserName,
      browserVersion,
      os,
      mobile,
      tablet,
      desktop,
      isMobile: mobile,
      isTablet: tablet,
      isDesktop: desktop,
      webGLSupport,
      webGLVersion,
      touchSupport,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio,
      maxTextureSize,
      gpuInfo,
    });
    
    // Update screen size on resize
    const handleResize = () => {
      setCapabilities(prev => ({
        ...prev,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      }));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return capabilities;
}

export default useDeviceDetect;
