
import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  browserName: string;
  operatingSystem: string;
  hasWebGLSupport: boolean;
  maxTextureSize: number;
  devicePixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  touchSupport: boolean;
  orientation: 'portrait' | 'landscape';
}

export const useDeviceDetect = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    browserName: 'unknown',
    operatingSystem: 'unknown',
    hasWebGLSupport: false,
    maxTextureSize: 0,
    devicePixelRatio: 1,
    screenWidth: 0,
    screenHeight: 0,
    touchSupport: false,
    orientation: 'landscape'
  });

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Detect browser and OS
    const userAgent = navigator.userAgent;
    const browserInfo = detectBrowser(userAgent);
    const osInfo = detectOS(userAgent);
    
    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /(iPad|tablet|Nexus 9|Nexus 7)/i.test(userAgent) || 
                      (window.innerWidth >= 768 && window.innerWidth <= 1024);
    const isDesktop = !isMobile || (!isTablet && window.innerWidth > 1024);
    
    // Detect touch support
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Screen info
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';
    
    // WebGL support
    const webGLInfo = checkWebGLSupport();
    
    setCapabilities({
      isMobile,
      isTablet,
      isDesktop,
      browserName: browserInfo,
      operatingSystem: osInfo,
      hasWebGLSupport: webGLInfo.supported,
      maxTextureSize: webGLInfo.maxTextureSize,
      devicePixelRatio,
      screenWidth,
      screenHeight,
      touchSupport,
      orientation
    });
    
  }, []);
  
  return capabilities;
};

function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';
  return 'unknown';
}

function detectOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac OS')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'unknown';
}

function checkWebGLSupport(): { supported: boolean; maxTextureSize: number } {
  if (typeof window === 'undefined') {
    return { supported: false, maxTextureSize: 0 };
  }
  
  try {
    const canvas = document.createElement('canvas');
    // Try to get WebGL2 first, then fall back to WebGL
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = 
      canvas.getContext('webgl2') || 
      canvas.getContext('webgl') || 
      canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false, maxTextureSize: 0 };
    }
    
    // Cast to WebGLRenderingContext to access WebGL methods
    const webGLContext = gl as WebGLRenderingContext;
    
    // Get max texture size
    const maxTextureSize = webGLContext.getParameter(webGLContext.MAX_TEXTURE_SIZE) || 0;
    
    return {
      supported: true,
      maxTextureSize
    };
  } catch (e) {
    console.error('Error checking WebGL support:', e);
    return { supported: false, maxTextureSize: 0 };
  }
}

export default useDeviceDetect;
