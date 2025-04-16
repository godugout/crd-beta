
import { useState, useRef, useCallback, useEffect } from 'react';

export interface CardEffect {
  id: string;
  name: string;
  active: boolean;
  intensity: number;
  hue?: number;
  saturation?: number;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface CardEffectsOptions {
  enableLighting?: boolean;
  enableReflections?: boolean;
  enableParallax?: boolean;
  performanceMode?: 'low' | 'medium' | 'high';
  initialEffects?: CardEffect[];
}

export const DEFAULT_EFFECTS: CardEffect[] = [
  { id: 'holographic', name: 'Holographic', active: false, intensity: 0.7, hue: 0 },
  { id: 'refractor', name: 'Refractor', active: false, intensity: 0.8 },
  { id: 'chrome', name: 'Chrome', active: false, intensity: 0.6 },
  { id: 'goldFoil', name: 'Gold Foil', active: false, intensity: 0.7 },
  { id: 'vintage', name: 'Vintage', active: false, intensity: 0.5 },
  { id: 'prismatic', name: 'Prismatic', active: false, intensity: 0.9, hue: 180 },
  { id: 'mojo', name: 'Mojo', active: false, intensity: 0.8 },
  { id: 'pulsar', name: 'Pulsar', active: false, intensity: 0.6 }
];

export function useCardEffects(options: CardEffectsOptions = {}) {
  // Initialize with default or provided effects
  const [effects, setEffects] = useState<CardEffect[]>(
    options.initialEffects || DEFAULT_EFFECTS
  );
  
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0.5, y: 0.5 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardEffectsState, setCardEffectsState] = useState<Record<string, string[]>>({});
  
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track drag state
  const dragInfo = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startRotateX: 0,
    startRotateY: 0,
  });

  // Toggle effect active state
  const toggleEffect = useCallback((effectId: string) => {
    setEffects(prev => 
      prev.map(effect => 
        effect.id === effectId 
          ? { ...effect, active: !effect.active } 
          : effect
      )
    );
  }, []);

  // Update effect intensity
  const updateEffectIntensity = useCallback((effectId: string, intensity: number) => {
    setEffects(prev => 
      prev.map(effect => 
        effect.id === effectId 
          ? { ...effect, intensity } 
          : effect
      )
    );
  }, []);

  // Set active effects array - adds this missing method
  const setActiveEffects = useCallback((effectIds: string[]) => {
    setEffects(prev => 
      prev.map(effect => ({
        ...effect,
        active: effectIds.includes(effect.id)
      }))
    );
  }, []);

  // Set card effects - adds this missing method
  const setCardEffects = useCallback((cardId: string, effectIds: string[]) => {
    setCardEffectsState(prev => ({
      ...prev,
      [cardId]: effectIds
    }));
  }, []);

  // Update effect property (generic function)
  const updateEffectProperty = useCallback(<T extends keyof CardEffect>(
    effectId: string, 
    property: T, 
    value: CardEffect[T]
  ) => {
    setEffects(prev => 
      prev.map(effect => 
        effect.id === effectId 
          ? { ...effect, [property]: value } 
          : effect
      )
    );
  }, []);

  // Handle mouse/touch movement for interactive card
  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!cardRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate relative mouse position (0-1)
    const relativeX = (clientX - rect.left) / rect.width;
    const relativeY = (clientY - rect.top) / rect.height;
    
    setMousePosition({ x: relativeX, y: relativeY });
    
    // If dragging, update rotation
    if (dragInfo.current.isDragging) {
      const deltaX = clientX - dragInfo.current.startX;
      const deltaY = clientY - dragInfo.current.startY;
      
      const sensitivity = 0.5;
      
      setRotation({
        x: dragInfo.current.startRotateX + (deltaY * sensitivity),
        y: dragInfo.current.startRotateY - (deltaX * sensitivity)
      });
    }
  }, []);

  // Start drag
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    dragInfo.current.isDragging = true;
    dragInfo.current.startX = clientX;
    dragInfo.current.startY = clientY;
    dragInfo.current.startRotateX = rotation.x;
    dragInfo.current.startRotateY = rotation.y;
    setIsMoving(true);
  }, [rotation]);

  // End drag
  const handleDragEnd = useCallback(() => {
    dragInfo.current.isDragging = false;
    setIsMoving(false);
    
    // Optional: add momentum effect here
  }, []);

  // Reset card position
  const resetCard = useCallback(() => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setIsFlipped(false);
  }, []);

  // Flip card
  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Handle zoom
  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => {
      // Limit zoom between 0.5 and 3
      const newZoom = prev + delta * 0.1;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  }, []);

  // Generate CSS variables for effects
  const generateEffectStyles = useCallback(() => {
    const styles: Record<string, string> = {
      '--mouse-x': `${mousePosition.x * 100}%`,
      '--mouse-y': `${mousePosition.y * 100}%`,
    };

    // Add variables for each active effect
    effects.forEach(effect => {
      if (effect.active) {
        styles[`--${effect.id}-active`] = '1';
        styles[`--${effect.id}-intensity`] = effect.intensity.toString();
        
        if (effect.hue !== undefined) {
          styles[`--${effect.id}-hue`] = effect.hue.toString();
        }
        
        if (effect.saturation !== undefined) {
          styles[`--${effect.id}-saturation`] = effect.saturation.toString();
        }
      } else {
        styles[`--${effect.id}-active`] = '0';
      }
    });

    return styles;
  }, [effects, mousePosition]);

  // Generate classes for active effects
  const generateEffectClasses = useCallback(() => {
    const classes = ['card-effect'];
    effects.forEach(effect => {
      if (effect.active) {
        classes.push(`effect-${effect.id}`);
      }
    });
    return classes.join(' ');
  }, [effects]);

  // Handle mouse/touch events
  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      handleDragStart(e.clientX, e.clientY);
    };
    
    const handleMouseUp = () => {
      handleDragEnd();
    };
    
    const handleMouseLeave = () => {
      handleDragEnd();
    };
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleZoom(-Math.sign(e.deltaY));
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleInteraction, handleDragStart, handleDragEnd, handleZoom]);
  
  // Return all necessary values and functions
  return {
    effects,
    mousePosition,
    rotation,
    isMoving,
    zoom,
    isFlipped,
    cardRef,
    containerRef,
    toggleEffect,
    updateEffectIntensity,
    updateEffectProperty,
    resetCard,
    flipCard,
    handleZoom,
    setZoom,
    setRotation,
    generateEffectStyles,
    generateEffectClasses,
    activeEffects: effects.filter(e => e.active).map(e => e.id),
    cardEffects: cardEffectsState,
    setCardEffects,
    setActiveEffects
  };
}
