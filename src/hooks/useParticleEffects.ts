import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ParticleEffectType, 
  ParticleSettings, 
  ParticleSystemState, 
  DEFAULT_PARTICLE_PRESETS,
  TEAM_COLOR_SCHEMES
} from '@/lib/types/particleEffects';
import { Card } from '@/lib/types';
import { useMobileOptimization } from './useMobileOptimization';

// Default settings for each particle type
const DEFAULT_SETTINGS: Record<ParticleEffectType, ParticleSettings> = {
  sparkle: {
    type: 'sparkle',
    enabled: false,
    density: 0.5,
    speed: 0.6,
    reactivity: 0.8,
    color: ['#FFFFFF', '#FFD700'],
    emissionPattern: 'edges',
    size: 0.4,
    opacity: 0.8,
    lifespan: 1.2
  },
  dust: {
    type: 'dust',
    enabled: false,
    density: 0.3,
    speed: 0.2,
    reactivity: 0.4,
    color: ['#FFFFFF', '#F0F0FF'],
    emissionPattern: 'full',
    size: 0.2,
    opacity: 0.4,
    lifespan: 3
  },
  energy: {
    type: 'energy',
    enabled: false,
    density: 0.6,
    speed: 0.7,
    reactivity: 0.9,
    color: ['#00FFFF', '#0080FF'],
    emissionPattern: 'edges',
    size: 0.6,
    opacity: 0.7,
    lifespan: 1.5
  },
  team: {
    type: 'team',
    enabled: false,
    density: 0.5,
    speed: 0.5,
    reactivity: 0.7,
    color: ['#FFFFFF', '#DDDDDD'], // Default, will be replaced by team colors
    emissionPattern: 'corners',
    size: 0.5,
    opacity: 0.7,
    lifespan: 1.8
  }
};

interface ParticleEffectsOptions {
  card?: Card;
  shouldAutoDetectCardType?: boolean;
  initialPerformanceLevel?: 'high' | 'medium' | 'low';
  onPerformanceChange?: (level: 'high' | 'medium' | 'low') => void;
}

export const useParticleEffects = (options: ParticleEffectsOptions = {}) => {
  const {
    card,
    shouldAutoDetectCardType = true,
    initialPerformanceLevel = 'medium',
    onPerformanceChange
  } = options;

  const { isMobile, reduceEffects } = useMobileOptimization();

  // Initialize state with default settings
  const [state, setState] = useState<ParticleSystemState>({
    effects: { ...DEFAULT_SETTINGS },
    isActive: false,
    isTransitioning: false,
    isPerformanceRestricted: isMobile,
    performanceLevel: initialPerformanceLevel,
    autoAdjust: true
  });

  // FPS monitoring for automatic performance adjustment
  const fpsRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Apply effects based on card type (if auto-detect is enabled)
  useEffect(() => {
    if (!card || !shouldAutoDetectCardType) return;

    // Auto-detect card type and apply appropriate effects
    const isHolographic = card.effects?.includes('Holographic');
    const isRefractor = card.effects?.includes('Refractor');
    const isPremium = isHolographic || isRefractor || (card.rarity === 'rare' || card.rarity === 'legendary');
    const teamName = card.team || '';

    // Clone the current state to modify
    const newState = { ...state };

    // Apply sparkle effects for premium cards
    if (isPremium) {
      newState.effects.sparkle = {
        ...newState.effects.sparkle,
        enabled: true
      };
    }

    // Apply team colors if team is recognized
    if (teamName && TEAM_COLOR_SCHEMES[teamName]) {
      newState.effects.team = {
        ...newState.effects.team,
        enabled: true,
        color: TEAM_COLOR_SCHEMES[teamName]
      };
    }

    // Update state if changes were made
    setState(newState);
  }, [card, shouldAutoDetectCardType]);

  // Monitor performance and adjust settings if needed
  const monitorPerformance = useCallback(() => {
    const now = performance.now();
    frameCountRef.current++;

    // Calculate FPS every second
    if (now - lastFrameTimeRef.current >= 1000) {
      const fps = frameCountRef.current;
      fpsRef.current.push(fps);
      
      // Keep only the last 5 FPS measurements
      if (fpsRef.current.length > 5) {
        fpsRef.current.shift();
      }
      
      // Get average FPS
      const avgFps = fpsRef.current.reduce((sum, val) => sum + val, 0) / fpsRef.current.length;
      
      // Adjust performance level if needed and auto-adjust is enabled
      if (state.autoAdjust) {
        let newPerformanceLevel = state.performanceLevel;
        
        if (avgFps < 30) {
          newPerformanceLevel = 'low';
        } else if (avgFps > 50) {
          newPerformanceLevel = 'high';
        } else {
          newPerformanceLevel = 'medium';
        }
        
        // Only update if performance level changed
        if (newPerformanceLevel !== state.performanceLevel) {
          setState(prev => ({
            ...prev,
            performanceLevel: newPerformanceLevel,
            isPerformanceRestricted: newPerformanceLevel === 'low'
          }));
          
          if (onPerformanceChange) {
            onPerformanceChange(newPerformanceLevel);
          }
        }
      }
      
      // Reset for next second
      frameCountRef.current = 0;
      lastFrameTimeRef.current = now;
    }
    
    // Continue monitoring
    animationFrameRef.current = requestAnimationFrame(monitorPerformance);
  }, [state.autoAdjust, state.performanceLevel, onPerformanceChange]);

  // Start/stop performance monitoring
  useEffect(() => {
    if (state.isActive && state.autoAdjust) {
      lastFrameTimeRef.current = performance.now();
      frameCountRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(monitorPerformance);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isActive, state.autoAdjust, monitorPerformance]);

  // Toggle an effect on or off
  const toggleEffect = useCallback((effectType: ParticleEffectType) => {
    setState(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effectType]: {
          ...prev.effects[effectType],
          enabled: !prev.effects[effectType].enabled
        }
      },
      isActive: true // Activate the system when an effect is toggled on
    }));
  }, []);

  // Update settings for a specific effect
  const updateEffectSettings = useCallback((
    effectType: ParticleEffectType,
    settings: Partial<ParticleSettings>
  ) => {
    setState(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effectType]: {
          ...prev.effects[effectType],
          ...settings
        }
      }
    }));
  }, []);

  // Apply a preset configuration
  const applyPreset = useCallback((presetName: string) => {
    const preset = DEFAULT_PARTICLE_PRESETS[presetName];
    if (!preset) return;
    
    const effectType = preset.settings.type || 'sparkle';
    
    setState(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effectType]: {
          ...prev.effects[effectType],
          ...preset.settings,
          enabled: true
        }
      },
      isActive: true
    }));
  }, []);

  // Toggle the entire particle system on/off
  const toggleSystem = useCallback(() => {
    setState(prev => {
      const isActive = !prev.isActive;
      
      // If turning on, make sure at least one effect is enabled
      let effects = { ...prev.effects };
      if (isActive && !Object.values(effects).some(effect => effect.enabled)) {
        effects.sparkle = {
          ...effects.sparkle,
          enabled: true
        };
      }
      
      return {
        ...prev,
        isActive,
        effects,
        isTransitioning: true
      };
    });
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isTransitioning: false
      }));
    }, 600);
  }, []);

  // Toggle auto performance adjustment
  const toggleAutoAdjust = useCallback(() => {
    setState(prev => ({
      ...prev,
      autoAdjust: !prev.autoAdjust
    }));
  }, []);

  // Manually set performance level
  const setPerformanceLevel = useCallback((level: 'high' | 'medium' | 'low') => {
    setState(prev => ({
      ...prev,
      performanceLevel: level,
      isPerformanceRestricted: level === 'low',
      autoAdjust: false // Disable auto-adjust when manually setting performance
    }));
    
    if (onPerformanceChange) {
      onPerformanceChange(level);
    }
  }, [onPerformanceChange]);

  // Reset all effects to defaults
  const resetEffects = useCallback(() => {
    setState(prev => ({
      ...prev,
      effects: { ...DEFAULT_SETTINGS },
      isActive: false
    }));
  }, []);

  // Calculate parameters based on performance level and device capabilities
  const getOptimizedParams = useCallback(() => {
    const baseParticleCount = state.performanceLevel === 'high' ? 
      100 : state.performanceLevel === 'medium' ? 
      50 : 20;
    
    const maxParticlesPerEffect = isMobile ? 
      baseParticleCount * 0.5 : baseParticleCount;
    
    const useHighQualityShaders = state.performanceLevel === 'high' && !isMobile;
    
    return {
      maxParticlesPerEffect,
      useHighQualityShaders,
      particleTextureResolution: state.performanceLevel === 'high' ? 64 : 32,
      useBlending: state.performanceLevel !== 'low',
      useMotionBlur: state.performanceLevel === 'high',
      fps: state.performanceLevel === 'high' ? 60 : state.performanceLevel === 'medium' ? 30 : 20
    };
  }, [state.performanceLevel, isMobile]);

  return {
    particleState: state,
    toggleEffect,
    updateEffectSettings,
    applyPreset,
    toggleSystem,
    toggleAutoAdjust,
    setPerformanceLevel,
    resetEffects,
    optimizedParams: getOptimizedParams(),
    availablePresets: DEFAULT_PARTICLE_PRESETS
  };
};
