
import { useState, useRef, useEffect, useCallback } from 'react';
import { useMobileOptimization } from './useMobileOptimization';
import { useToast } from '@/hooks/use-toast';

interface Point {
  x: number;
  y: number;
}

interface AdvancedGestureOptions {
  /**
   * Enable pinch to zoom gesture
   * @default true
   */
  enablePinch?: boolean;
  
  /**
   * Enable twist rotation gesture
   * @default true
   */
  enableTwist?: boolean;
  
  /**
   * Enable swipe gestures
   * @default true
   */
  enableSwipe?: boolean;
  
  /**
   * Enable device motion (gyroscope, accelerometer)
   * @default true
   */
  enableDeviceMotion?: boolean;
  
  /**
   * Enable haptic feedback
   * @default true
   */
  enableHaptic?: boolean;
  
  /**
   * Sensitivity for gestures (0-1)
   * @default 1
   */
  sensitivity?: number;
  
  /**
   * Reference to container element
   */
  containerRef: React.RefObject<HTMLElement>;
  
  /**
   * Callback when tutorial should be shown
   */
  onShowTutorial?: () => void;
}

export const useAdvancedGestures = (options: AdvancedGestureOptions) => {
  const {
    enablePinch = true,
    enableTwist = true,
    enableSwipe = true,
    enableDeviceMotion = true,
    enableHaptic = true,
    sensitivity = 1,
    containerRef,
    onShowTutorial
  } = options;
  
  const { isMobile } = useMobileOptimization();
  const { toast } = useToast();
  
  // State for gesture tracking
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isGesturing, setIsGesturing] = useState(false);
  const [pressForce, setPressForce] = useState(0);
  const [activeGesture, setActiveGesture] = useState<string | null>(null);

  // Refs for gesture tracking
  const touchStartRef = useRef<Point[]>([]);
  const lastTouchRef = useRef<Point[]>([]);
  const touchStartTimeRef = useRef(0);
  const initialDistanceRef = useRef(0);
  const initialAngleRef = useRef(0);
  const isPinchingRef = useRef(false);
  const isTwistingRef = useRef(false);
  const isSwipingRef = useRef(false);
  const swipeVelocityRef = useRef({ x: 0, y: 0 });
  const momentumAnimationRef = useRef<number | null>(null);
  const deviceOrientationRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const lastUpdateTimeRef = useRef(0);
  
  // Flag for first use tutorial
  const hasTutorialShownRef = useRef(false);
  
  // Helper to calculate distance between two points
  const getDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };
  
  // Helper to calculate angle between two points
  const getAngle = (p1: Point, p2: Point): number => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  };
  
  // Helper to trigger haptic feedback
  const triggerHaptic = useCallback((intensity?: number) => {
    if (!enableHaptic) return;
    
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(intensity || 10);
      }
    } catch (e) {
      console.log('Haptic feedback not supported');
    }
  }, [enableHaptic]);

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    // Show tutorial on first use
    if (!hasTutorialShownRef.current && onShowTutorial) {
      onShowTutorial();
      hasTutorialShownRef.current = true;
    }
    
    // Record touch start positions
    const touches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
    touchStartRef.current = touches;
    lastTouchRef.current = touches;
    touchStartTimeRef.current = performance.now();
    
    // Cancel any ongoing momentum animation
    if (momentumAnimationRef.current) {
      cancelAnimationFrame(momentumAnimationRef.current);
      momentumAnimationRef.current = null;
    }
    
    setIsGesturing(true);
    
    // Reset flags
    isPinchingRef.current = false;
    isTwistingRef.current = false;
    isSwipingRef.current = false;
    
    // Handle force touch if available
    if ('force' in e.touches[0]) {
      const force = (e.touches[0] as any).force;
      setPressForce(force);
      
      if (force > 0.8) {
        triggerHaptic(20);
      }
    }
    
    // Record initial state for multi-touch gestures
    if (touches.length === 2) {
      initialDistanceRef.current = getDistance(touches[0], touches[1]);
      initialAngleRef.current = getAngle(touches[0], touches[1]);
      setActiveGesture('multi-touch');
    } else if (touches.length === 1) {
      setActiveGesture('single-touch');
    }
  }, [containerRef, onShowTutorial, triggerHaptic]);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (!isGesturing || !containerRef.current) return;
    
    // Prevent default to avoid scrolling while gesturing
    e.preventDefault();
    
    const touches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
    const now = performance.now();
    const deltaTime = now - lastUpdateTimeRef.current;
    
    // Handle force updates for pressure sensitivity
    if ('force' in e.touches[0]) {
      const force = (e.touches[0] as any).force;
      setPressForce(force);
    }
    
    // Handle multi-touch gestures (pinch & twist)
    if (touches.length === 2 && enablePinch && lastTouchRef.current.length === 2) {
      const currentDistance = getDistance(touches[0], touches[1]);
      const currentAngle = getAngle(touches[0], touches[1]);
      
      // Calculate pinch scale change
      if (initialDistanceRef.current > 0) {
        const newScale = currentDistance / initialDistanceRef.current;
        const scaleDelta = newScale - 1;
        
        // Apply scaled sensitivity to pinch
        const appliedDelta = scaleDelta * sensitivity;
        
        setScale(prev => {
          const nextScale = prev * (1 + appliedDelta * 0.1);
          return Math.max(0.5, Math.min(3, nextScale));
        });
        
        isPinchingRef.current = true;
      }
      
      // Calculate twist rotation
      if (enableTwist && initialAngleRef.current !== null) {
        let angleDelta = currentAngle - initialAngleRef.current;
        
        // Normalize angle delta
        if (angleDelta > 180) angleDelta -= 360;
        if (angleDelta < -180) angleDelta += 360;
        
        // Apply scaled sensitivity to rotation
        const appliedDelta = angleDelta * sensitivity * 0.2;
        
        setRotation(prev => ({
          ...prev,
          z: prev.z + appliedDelta
        }));
        
        isTwistingRef.current = true;
      }
      
      // Update active gesture type
      if (isPinchingRef.current && isTwistingRef.current) {
        setActiveGesture('pinch-twist');
      } else if (isPinchingRef.current) {
        setActiveGesture('pinch');
      } else if (isTwistingRef.current) {
        setActiveGesture('twist');
      }
    }
    // Handle single touch gestures (swipe)
    else if (touches.length === 1 && lastTouchRef.current.length === 1) {
      const deltaX = touches[0].x - lastTouchRef.current[0].x;
      const deltaY = touches[0].y - lastTouchRef.current[0].y;
      
      // Calculate velocity for momentum
      const velocityX = deltaTime > 0 ? deltaX / deltaTime : 0;
      const velocityY = deltaTime > 0 ? deltaY / deltaTime : 0;
      swipeVelocityRef.current = { x: velocityX * 20, y: velocityY * 20 };
      
      // Apply scaled sensitivity to movement
      const appliedDeltaX = deltaX * sensitivity;
      const appliedDeltaY = deltaY * sensitivity;
      
      // Detect edge swipes (for flipping)
      const rect = containerRef.current.getBoundingClientRect();
      const touchX = touches[0].x - rect.left;
      const edgeThreshold = rect.width * 0.15;
      
      if (Math.abs(deltaX) > 8 && !isSwipingRef.current) {
        if (touchX < edgeThreshold && deltaX > 0) {
          setActiveGesture('edge-swipe-right');
          triggerHaptic(15);
        } else if (touchX > rect.width - edgeThreshold && deltaX < 0) {
          setActiveGesture('edge-swipe-left');
          triggerHaptic(15);
        } else {
          setActiveGesture('swipe');
        }
        isSwipingRef.current = true;
      }
      
      // Update rotation based on swipe movement
      setRotation(prev => ({
        x: prev.x + appliedDeltaY * 0.2,
        y: prev.y - appliedDeltaX * 0.2,
        z: prev.z
      }));
      
      // Update position based on swipe movement
      setPosition(prev => ({
        x: prev.x + appliedDeltaX * 0.08,
        y: prev.y + appliedDeltaY * 0.08
      }));
      
      setVelocity({
        x: velocityX * 20,
        y: velocityY * 20
      });
    }
    
    // Update last touch and time
    lastTouchRef.current = touches;
    lastUpdateTimeRef.current = now;
  }, [isGesturing, containerRef, enablePinch, enableTwist, sensitivity, triggerHaptic]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent | React.TouchEvent) => {
    if (!isGesturing || !containerRef.current) return;
    
    const now = performance.now();
    const touchDuration = now - touchStartTimeRef.current;
    const remainingTouches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
    
    // Reset force pressure
    setPressForce(0);
    
    // Detect quick taps
    if (touchDuration < 300 && !isPinchingRef.current && !isTwistingRef.current && !isSwipingRef.current) {
      // Detect double tap
      if (now - lastUpdateTimeRef.current < 500) {
        setActiveGesture('double-tap');
        triggerHaptic(15);
        
        // Reset scale and rotation on double tap
        setScale(1);
        setRotation({ x: 0, y: 0, z: 0 });
        setPosition({ x: 0, y: 0 });
      } else {
        setActiveGesture('tap');
      }
    }
    
    // Detect edge swipes for card flip
    if (isSwipingRef.current) {
      if (activeGesture === 'edge-swipe-left' || activeGesture === 'edge-swipe-right') {
        // Trigger card flip event
        triggerHaptic(25);
      }
    }
    
    // Apply momentum if swipe had velocity
    if (
      enableSwipe && 
      isSwipingRef.current && 
      (Math.abs(swipeVelocityRef.current.x) > 0.1 || Math.abs(swipeVelocityRef.current.y) > 0.1)
    ) {
      const applyMomentum = () => {
        if (!isGesturing) {
          setRotation(prev => ({
            x: prev.x + swipeVelocityRef.current.y * 0.2,
            y: prev.y - swipeVelocityRef.current.x * 0.2,
            z: prev.z
          }));
          
          // Apply friction to slow down
          swipeVelocityRef.current = {
            x: swipeVelocityRef.current.x * 0.95,
            y: swipeVelocityRef.current.y * 0.95
          };
          
          // Continue animation if velocity is still significant
          if (
            Math.abs(swipeVelocityRef.current.x) > 0.01 || 
            Math.abs(swipeVelocityRef.current.y) > 0.01
          ) {
            momentumAnimationRef.current = requestAnimationFrame(applyMomentum);
          }
        }
      };
      
      momentumAnimationRef.current = requestAnimationFrame(applyMomentum);
    }
    
    // Reset gesture state if no touches remain
    if (remainingTouches.length === 0) {
      setIsGesturing(false);
      
      // Reset gesture flags
      isPinchingRef.current = false;
      isTwistingRef.current = false;
      isSwipingRef.current = false;
      
      // Clear active gesture after a short delay
      setTimeout(() => {
        setActiveGesture(null);
      }, 300);
    }
    
    // Update last touch info
    lastTouchRef.current = remainingTouches;
  }, [isGesturing, containerRef, activeGesture, enableSwipe, triggerHaptic]);

  // Handle device orientation changes
  const handleDeviceOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (!enableDeviceMotion || !e.beta || !e.gamma || !e.alpha) return;
    
    // Update device orientation reference
    deviceOrientationRef.current = {
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma
    };
    
    // Apply slight rotation based on device tilt
    if (!isGesturing) {
      setRotation(prev => ({
        x: e.beta * sensitivity * 0.1,
        y: e.gamma * sensitivity * 0.1,
        z: prev.z
      }));
    }
  }, [enableDeviceMotion, isGesturing, sensitivity]);

  // Request device motion permission on iOS 13+
  const requestDeviceMotionPermission = useCallback(async () => {
    if (!enableDeviceMotion) return;
    
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && 
          typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleDeviceOrientation);
          toast({
            title: "Motion Controls Enabled",
            description: "Tilt your device to control card rotation",
            duration: 3000
          });
        } else {
          toast({
            title: "Motion Controls Disabled",
            description: "Permission was not granted",
            variant: "destructive",
            duration: 3000
          });
        }
      } else if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    } catch (error) {
      console.error('Error requesting device motion permission:', error);
    }
  }, [enableDeviceMotion, handleDeviceOrientation, toast]);

  // Set up event listeners
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart as any);
    container.addEventListener('touchmove', handleTouchMove as any, { passive: false });
    container.addEventListener('touchend', handleTouchEnd as any);
    
    // Clean up event listeners
    return () => {
      container.removeEventListener('touchstart', handleTouchStart as any);
      container.removeEventListener('touchmove', handleTouchMove as any);
      container.removeEventListener('touchend', handleTouchEnd as any);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      
      if (momentumAnimationRef.current) {
        cancelAnimationFrame(momentumAnimationRef.current);
      }
    };
  }, [
    containerRef, 
    handleTouchStart, 
    handleTouchMove, 
    handleTouchEnd, 
    handleDeviceOrientation
  ]);

  // Show tutorial for first time users
  useEffect(() => {
    if (isMobile && !hasTutorialShownRef.current && onShowTutorial) {
      onShowTutorial();
      hasTutorialShownRef.current = true;
    }
  }, [isMobile, onShowTutorial]);

  return {
    scale,
    rotation,
    position,
    velocity,
    isGesturing,
    pressForce,
    activeGesture,
    requestDeviceMotionPermission,
    resetGestures: () => {
      setScale(1);
      setRotation({ x: 0, y: 0, z: 0 });
      setPosition({ x: 0, y: 0 });
      setVelocity({ x: 0, y: 0 });
    }
  };
};
