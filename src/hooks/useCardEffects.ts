
import { useState, useRef, useCallback } from 'react';
import { useCardLighting } from './useCardLighting';

export type CardEffect = {
  id: string;
  name: string;
  description: string;
  intensity: number;
  category: 'basic' | 'premium' | 'special';
  enabled: boolean;
};

export type MousePosition = {
  x: number;
  y: number;
};

const DEFAULT_EFFECTS: CardEffect[] = [
  {
    id: 'holographic',
    name: 'Holographic',
    description: 'Rainbow-colored reflective foil effect',
    intensity: 1.0,
    category: 'premium',
    enabled: false
  },
  {
    id: 'refractor',
    name: 'Refractor',
    description: 'Light-bending prismatic effect',
    intensity: 1.0,
    category: 'premium',
    enabled: false
  },
  {
    id: 'chrome',
    name: 'Chrome',
    description: 'Metallic reflective effect',
    intensity: 1.0,
    category: 'premium',
    enabled: false
  },
  {
    id: 'gold_foil',
    name: 'Gold Foil',
    description: 'Metallic gold accents',
    intensity: 1.0,
    category: 'special',
    enabled: false
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged, worn appearance',
    intensity: 1.0,
    category: 'basic',
    enabled: false
  },
  {
    id: 'embossed',
    name: 'Embossed',
    description: '3D raised texture effect',
    intensity: 1.0,
    category: 'basic',
    enabled: false
  },
  {
    id: 'scratch_resistant',
    name: 'Scratch Resistant',
    description: 'Protective coating appearance',
    intensity: 1.0,
    category: 'basic',
    enabled: false
  },
  {
    id: 'matte',
    name: 'Matte',
    description: 'Non-reflective finish',
    intensity: 1.0,
    category: 'basic',
    enabled: false
  }
];

export const useCardEffects = () => {
  const [effects, setEffects] = useState<CardEffect[]>(DEFAULT_EFFECTS);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const activeEffects = effects.filter(effect => effect.enabled).map(effect => effect.id);
  
  // Initialize lighting system
  const { lightingSettings, updateLightPosition } = useCardLighting('studio');
  
  // Toggle effect on/off
  const toggleEffect = useCallback((effectId: string) => {
    setEffects(prevEffects => 
      prevEffects.map(effect => 
        effect.id === effectId ? { ...effect, enabled: !effect.enabled } : effect
      )
    );
  }, []);
  
  // Update effect intensity
  const updateEffectIntensity = useCallback((effectId: string, intensity: number) => {
    setEffects(prevEffects => 
      prevEffects.map(effect => 
        effect.id === effectId ? { ...effect, intensity } : effect
      )
    );
  }, []);
  
  // Set specific effects as active
  const setActiveEffects = useCallback((effectIds: string[]) => {
    setEffects(prevEffects =>
      prevEffects.map(effect => ({
        ...effect,
        enabled: effectIds.includes(effect.id)
      }))
    );
  }, []);
  
  // Generate CSS for effect styles
  const generateEffectStyles = useCallback(() => {
    const styles: Record<string, any> = {};
    
    effects.forEach(effect => {
      if (!effect.enabled) return;
      
      switch (effect.id) {
        case 'holographic':
          styles.filter = `${styles.filter || ''} saturate(${1 + effect.intensity * 0.5})`;
          styles.background = `linear-gradient(35deg, 
            rgba(255,0,0,${0.1 * effect.intensity}) 0%, 
            rgba(255,255,0,${0.1 * effect.intensity}) 20%, 
            rgba(0,255,0,${0.1 * effect.intensity}) 40%, 
            rgba(0,255,255,${0.1 * effect.intensity}) 60%, 
            rgba(255,0,255,${0.1 * effect.intensity}) 80%, 
            rgba(255,0,0,${0.1 * effect.intensity}) 100%)`;
          styles.mixBlendMode = 'color-dodge';
          break;
        case 'refractor':
          styles.filter = `${styles.filter || ''} brightness(${1 + effect.intensity * 0.1})`;
          styles.boxShadow = `${styles.boxShadow || ''}, 0 0 ${10 * effect.intensity}px rgba(255,255,255,0.5)`;
          break;
        case 'chrome':
          styles.filter = `${styles.filter || ''} contrast(${1 + effect.intensity * 0.3})`;
          break;
        case 'gold_foil':
          styles.boxShadow = `${styles.boxShadow || ''}, 0 0 ${5 * effect.intensity}px rgba(255,215,0,0.7)`;
          break;
        case 'vintage':
          styles.filter = `${styles.filter || ''} sepia(${0.5 * effect.intensity})`;
          break;
        case 'embossed':
          styles.boxShadow = `${styles.boxShadow || ''}, 0 ${1 * effect.intensity}px ${2 * effect.intensity}px rgba(0,0,0,0.3)`;
          break;
        case 'matte':
          styles.filter = `${styles.filter || ''} brightness(${1 - 0.05 * effect.intensity})`;
          break;
      }
    });
    
    return styles;
  }, [effects]);
  
  // Handle mouse/touch movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    setMousePosition({ x, y });
    
    // Update rotation based on mouse position
    setRotation({
      x: y * 15, // Rotate around X-axis based on Y position
      y: -x * 15 // Rotate around Y-axis based on X position
    });
    
    // Update lighting position
    const normalizedX = (e.clientX - rect.left) / rect.width;
    const normalizedY = (e.clientY - rect.top) / rect.height;
    updateLightPosition(normalizedX, normalizedY);
    
    setIsMoving(true);
    
    // Set a timeout to mark movement as stopped
    setTimeout(() => {
      setIsMoving(false);
    }, 100);
  }, [updateLightPosition]);
  
  // Functions for flipping and zooming
  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);
  
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  }, []);
  
  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);
  
  const resetView = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  return {
    effects,
    mousePosition,
    rotation,
    isMoving,
    zoom,
    isFlipped,
    cardRef,
    activeEffects,
    lightingSettings,
    handleMouseMove,
    toggleEffect,
    updateEffectIntensity,
    generateEffectStyles,
    flipCard,
    zoomIn,
    zoomOut,
    resetView,
    setActiveEffects,
    availableEffects: effects.map(effect => effect.name),
    effectIntensities: effects.reduce((acc, effect) => {
      acc[effect.id] = effect.intensity;
      return acc;
    }, {} as Record<string, number>),
    adjustEffectIntensity: updateEffectIntensity
  };
};
