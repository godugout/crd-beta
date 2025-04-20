
import { useState, useEffect, useRef, useCallback } from 'react';

interface OptimizedEffectSettings {
  qualityLevel: 'high' | 'medium' | 'low';
  animationEnabled: boolean;
  reflectionStrength: number;
  lightingQuality: 'pbr' | 'basic' | 'minimal';
  textureResolution: 'full' | 'half' | 'quarter';
  effectIntensities: Record<string, number>;
}

export function useOptimizedCardEffects(initialActiveEffects: string[] = []) {
  const [activeEffects, setActiveEffects] = useState<string[]>(initialActiveEffects);
  const [settings, setSettings] = useState<OptimizedEffectSettings>({
    qualityLevel: 'medium',
    animationEnabled: true,
    reflectionStrength: 0.7,
    lightingQuality: 'basic',
    textureResolution: 'half',
    effectIntensities: {
      Holographic: 0.7,
      Refractor: 0.8,
      Shimmer: 0.6,
      'Gold Foil': 0.8,
      Chrome: 0.7,
      Vintage: 0.7,
    }
  });
  const [devicePerformance, setDevicePerformance] = useState<'high' | 'medium' | 'low'>('medium');
  const framerateRef = useRef<number>(60);
  const frameTimeRef = useRef<number[]>([]);
  const isMonitoringRef = useRef<boolean>(false);

  // Initialize device performance detection
  useEffect(() => {
    const detectDeviceCapabilities = () => {
      // Check for hardware capabilities
      const cores = navigator.hardwareConcurrency || 2;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isOldBrowser = !window.requestAnimationFrame || !window.performance;
      
      // Estimate device capability
      if (cores >= 8 && !isMobile && !isOldBrowser) {
        setDevicePerformance('high');
      } else if (cores <= 2 || isMobile || isOldBrowser) {
        setDevicePerformance('low');
      } else {
        setDevicePerformance('medium');
      }
      
      console.log(`Device performance detected: ${devicePerformance} (${cores} cores, mobile: ${isMobile})`);
    };
    
    detectDeviceCapabilities();
  }, []);

  // Apply performance-based presets
  useEffect(() => {
    const applyPerformancePresets = () => {
      switch (devicePerformance) {
        case 'high':
          setSettings(prev => ({
            ...prev,
            qualityLevel: 'high',
            animationEnabled: true,
            reflectionStrength: 0.8,
            lightingQuality: 'pbr',
            textureResolution: 'full'
          }));
          break;
        
        case 'medium':
          setSettings(prev => ({
            ...prev,
            qualityLevel: 'medium',
            animationEnabled: true,
            reflectionStrength: 0.6,
            lightingQuality: 'basic',
            textureResolution: 'half'
          }));
          break;
        
        case 'low':
          setSettings(prev => ({
            ...prev,
            qualityLevel: 'low',
            animationEnabled: false,
            reflectionStrength: 0.3,
            lightingQuality: 'minimal',
            textureResolution: 'quarter'
          }));
          break;
      }
    };
    
    applyPerformancePresets();
  }, [devicePerformance]);

  // Monitor performance with requestAnimationFrame
  useEffect(() => {
    if (isMonitoringRef.current) return;
    
    isMonitoringRef.current = true;
    let previousTime = performance.now();
    let frameCount = 0;
    
    const monitorFramerate = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - previousTime;
      
      // Record frame time
      frameTimeRef.current.push(deltaTime);
      if (frameTimeRef.current.length > 60) {
        frameTimeRef.current.shift();
      }
      
      // Calculate average FPS every 20 frames
      frameCount++;
      if (frameCount >= 20) {
        const avgFrameTime = frameTimeRef.current.reduce((sum, time) => sum + time, 0) / 
                             frameTimeRef.current.length;
        const fps = 1000 / avgFrameTime;
        framerateRef.current = fps;
        
        // Adjust quality if performance is poor
        if (fps < 30 && settings.qualityLevel !== 'low') {
          console.log(`Low performance detected (${fps.toFixed(1)}fps), reducing quality`);
          setSettings(prev => ({
            ...prev,
            qualityLevel: 'low',
            animationEnabled: false,
            textureResolution: 'quarter',
            lightingQuality: 'minimal'
          }));
        }
        
        frameCount = 0;
      }
      
      previousTime = currentTime;
      requestAnimationFrame(monitorFramerate);
    };
    
    requestAnimationFrame(monitorFramerate);
    
    return () => {
      isMonitoringRef.current = false;
    };
  }, [settings.qualityLevel]);

  const toggleEffect = useCallback((effect: string) => {
    setActiveEffects(prev => {
      if (prev.includes(effect)) {
        return prev.filter(e => e !== effect);
      } else {
        return [...prev, effect];
      }
    });
  }, []);

  const setEffectIntensity = useCallback((effect: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      effectIntensities: {
        ...prev.effectIntensities,
        [effect]: value
      }
    }));
  }, []);

  const optimizeForPerformance = useCallback(() => {
    const currentFramerate = framerateRef.current;
    
    if (currentFramerate < 20) {
      // Severe performance issues - apply minimum settings
      setSettings({
        qualityLevel: 'low',
        animationEnabled: false,
        reflectionStrength: 0.2,
        lightingQuality: 'minimal',
        textureResolution: 'quarter',
        effectIntensities: {
          Holographic: 0.3,
          Refractor: 0.3,
          Shimmer: 0.3,
          'Gold Foil': 0.3,
          Chrome: 0.3,
          Vintage: 0.3,
        }
      });
      
      // Reduce active effects to at most one
      if (activeEffects.length > 1) {
        setActiveEffects([activeEffects[0]]);
      }
    }
  }, [activeEffects]);

  return {
    activeEffects,
    settings,
    devicePerformance,
    framerate: framerateRef.current,
    toggleEffect,
    setEffectIntensity,
    optimizeForPerformance
  };
}
