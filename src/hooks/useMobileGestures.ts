
import { useState, useRef, useEffect } from 'react';
import { useMobileOptimization } from './useMobileOptimization';
import { useIsMobile } from './use-mobile';

interface GestureOptions {
  /**
   * Enable pinch to zoom gesture
   * @default true
   */
  enableZoom?: boolean;
  
  /**
   * Enable rotation gesture
   * @default true
   */
  enableRotation?: boolean;
  
  /**
   * Enable swipe gestures
   * @default true
   */
  enableSwipe?: boolean;
  
  /**
   * Minimum distance for a swipe to register
   * @default 50
   */
  swipeThreshold?: number;
  
  /**
   * Enable haptic feedback
   * @default true
   */
  hapticFeedback?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
}

interface GestureState {
  scale: number;
  rotation: number;
  offset: {
    x: number;
    y: number;
  };
  isGesturing: boolean;
}

interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  velocity: number;
  distanceX: number;
  distanceY: number;
}

interface PinchEvent {
  scale: number;
  center: TouchPosition;
}

interface RotateEvent {
  angle: number;
  center: TouchPosition;
}

export function useMobileGestures(options: GestureOptions = {}) {
  const {
    enableZoom = true,
    enableRotation = true,
    enableSwipe = true,
    swipeThreshold = 50,
    hapticFeedback = true
  } = options;
  
  const { isMobile, optimizeInteractions } = useMobileOptimization();
  const touchEnabled = typeof window !== 'undefined' && 'ontouchstart' in window;
  
  const [state, setState] = useState<GestureState>({
    scale: 1,
    rotation: 0,
    offset: { x: 0, y: 0 },
    isGesturing: false
  });
  
  // Refs to track touch state
  const touchStartRef = useRef<TouchPosition[]>([]);
  const lastTouchRef = useRef<TouchPosition[]>([]);
  const startDistanceRef = useRef<number>(0);
  const startAngleRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  // Callback refs
  const onSwipeRef = useRef<((event: SwipeEvent) => void) | null>(null);
  const onPinchRef = useRef<((event: PinchEvent) => void) | null>(null);
  const onRotateRef = useRef<((event: RotateEvent) => void) | null>(null);
  
  // Calculate distance between two touch points
  const getDistance = (p1: TouchPosition, p2: TouchPosition): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };
  
  // Calculate angle between two touch points
  const getAngle = (p1: TouchPosition, p2: TouchPosition): number => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  };
  
  // Get the center point between two touches
  const getCenter = (p1: TouchPosition, p2: TouchPosition): TouchPosition => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  };

  // Trigger haptic feedback if enabled
  const triggerHaptic = (intensity: number = 10) => {
    if (hapticFeedback && optimizeInteractions && navigator.vibrate) {
      navigator.vibrate(intensity);
    }
  };
  
  // Event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!touchEnabled) return;
    
    const touches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
    touchStartRef.current = touches;
    lastTouchRef.current = touches;
    lastTimeRef.current = Date.now();
    
    if (touches.length === 2) {
      startDistanceRef.current = getDistance(touches[0], touches[1]);
      startAngleRef.current = getAngle(touches[0], touches[1]);
      setState(prev => ({ ...prev, isGesturing: true }));
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchEnabled || touchStartRef.current.length === 0) return;
    
    const touches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
    const touchStart = touchStartRef.current;
    const lastTouch = lastTouchRef.current;
    
    // Handle pinch/zoom
    if (enableZoom && touches.length === 2 && touchStart.length === 2) {
      const currentDistance = getDistance(touches[0], touches[1]);
      const scale = currentDistance / startDistanceRef.current;
      
      setState(prev => ({ ...prev, scale }));
      
      if (onPinchRef.current) {
        onPinchRef.current({
          scale,
          center: getCenter(touches[0], touches[1])
        });
      }
    }
    
    // Handle rotation
    if (enableRotation && touches.length === 2 && touchStart.length === 2) {
      const currentAngle = getAngle(touches[0], touches[1]);
      const rotation = currentAngle - startAngleRef.current;
      
      setState(prev => ({ ...prev, rotation }));
      
      if (onRotateRef.current) {
        onRotateRef.current({
          angle: rotation,
          center: getCenter(touches[0], touches[1])
        });
      }
    }
    
    lastTouchRef.current = touches;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchEnabled) return;
    
    const touchStart = touchStartRef.current;
    const lastTouch = lastTouchRef.current;
    
    // Handle swipe gestures when only one touch point was used
    if (enableSwipe && touchStart.length === 1 && lastTouch.length === 1) {
      const deltaX = lastTouch[0].x - touchStart[0].x;
      const deltaY = lastTouch[0].y - touchStart[0].y;
      const timeElapsed = Date.now() - lastTimeRef.current;
      const velocityX = Math.abs(deltaX) / timeElapsed;
      const velocityY = Math.abs(deltaY) / timeElapsed;
      const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      
      // Detect swipe direction if threshold is met
      if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
        let direction: 'left' | 'right' | 'up' | 'down';
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        
        triggerHaptic(5);
        
        if (onSwipeRef.current) {
          onSwipeRef.current({
            direction,
            velocity,
            distanceX: deltaX,
            distanceY: deltaY
          });
        }
      }
    }
    
    setState(prev => ({ ...prev, isGesturing: false }));
    touchStartRef.current = [];
    lastTouchRef.current = [];
  };
  
  return {
    ...state,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd
    },
    setGestureCallbacks: {
      onSwipe: (callback: (event: SwipeEvent) => void) => {
        onSwipeRef.current = callback;
      },
      onPinch: (callback: (event: PinchEvent) => void) => {
        onPinchRef.current = callback;
      },
      onRotate: (callback: (event: RotateEvent) => void) => {
        onRotateRef.current = callback;
      }
    },
    reset: () => {
      setState({
        scale: 1,
        rotation: 0,
        offset: { x: 0, y: 0 },
        isGesturing: false
      });
    }
  };
}
