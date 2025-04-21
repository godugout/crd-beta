
interface RenderingInfo {
  visible?: boolean;
  position?: { x?: number; y?: number; z?: number };
  rotation?: { x?: number; y?: number; z?: number };
  scale?: { x?: number; y?: number; z?: number };
  [key: string]: any;
}

export const isDebugMode = (): boolean => {
  return window.location.search.includes('debug=true') || 
         localStorage.getItem('debugMode') === 'true';
};

export const logRenderingInfo = (component: string, info: RenderingInfo): void => {
  if (isDebugMode()) {
    console.log(`[${component}]`, info);
  }
};

export const setDebugMode = (enabled: boolean): void => {
  localStorage.setItem('debugMode', enabled ? 'true' : 'false');
};

export const getDebugStats = () => {
  return {
    memory: (window as any).performance?.memory ? {
      jsHeapSizeLimit: ((window as any).performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: ((window as any).performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      usedJSHeapSize: ((window as any).performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    } : 'Not available',
    fps: calculateFPS()
  };
};

// Simple FPS calculator
let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 0;

function calculateFPS(): number {
  const now = performance.now();
  frameCount++;
  
  if (now - lastFrameTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
    frameCount = 0;
    lastFrameTime = now;
  }
  
  return fps;
}

// Update FPS calculation on animation frame
if (typeof window !== 'undefined') {
  const updateFPS = () => {
    calculateFPS();
    requestAnimationFrame(updateFPS);
  };
  requestAnimationFrame(updateFPS);
}
