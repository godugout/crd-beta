
import { useState, useCallback, useRef } from 'react';

export interface PhysicsSettings {
  mass: number;
  friction: number;
  restitution: number;
  dampening: number;
  dampingFactor?: number;
  rotationDampingFactor?: number;
  sensitivity?: number;
  boundaryConstraints?: boolean;
  usePhysics: boolean;
  autoRotate?: boolean;
  followPointer?: boolean;
}

export interface PhysicsState {
  velocity: {
    x: number;
    y: number;
    rotationZ: number;
  };
  position: {
    x: number;
    y: number;
    z: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
  };
}

export const useCardPhysics = (initialSettings: Partial<PhysicsSettings> = {}) => {
  // Default physics settings
  const defaultSettings: PhysicsSettings = {
    mass: 1,
    friction: 0.95,
    restitution: 0.2,
    dampening: 0.8,
    dampingFactor: 0.97,
    rotationDampingFactor: 0.96,
    sensitivity: 0.1,
    boundaryConstraints: false,
    usePhysics: true,
    ...initialSettings
  };

  const [settings, setSettings] = useState<PhysicsSettings>(defaultSettings);
  const [isDragging, setIsDragging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const physicsState = useRef<PhysicsState>({
    velocity: { x: 0, y: 0, rotationZ: 0 },
    position: { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0 }
  });
  
  // Reference to last pointer position
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const frameRequest = useRef<number | null>(null);
  
  // Position and rotation getters for component convenience
  const position = physicsState.current.position;
  const velocity = physicsState.current.velocity;
  const rotation = {
    x: physicsState.current.position.rotationX,
    y: physicsState.current.position.rotationY,
    z: physicsState.current.position.rotationZ
  };
  
  // Handle pointer down event
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    
    // Stop any animations
    if (frameRequest.current) {
      cancelAnimationFrame(frameRequest.current);
      frameRequest.current = null;
      setIsMoving(false);
    }
  }, []);
  
  // Handle pointer move event
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - lastPointerPos.current.x;
    const dy = e.clientY - lastPointerPos.current.y;
    
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    
    // Update velocity based on pointer movement
    physicsState.current.velocity.x = dx * (settings.sensitivity || 0.1);
    physicsState.current.velocity.y = dy * (settings.sensitivity || 0.1);
    
    // Update card position
    physicsState.current.position.rotationY += dx * 0.01;
    physicsState.current.position.rotationX -= dy * 0.01;
    
    setIsMoving(true);
  }, [isDragging, settings.sensitivity]);
  
  // Handle pointer up event
  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Start the decay animation
    if (!frameRequest.current && settings.usePhysics) {
      const animate = () => {
        // Apply physics simulation
        physicsState.current.velocity.x *= settings.friction;
        physicsState.current.velocity.y *= settings.friction;
        
        // Update position based on velocity
        physicsState.current.position.rotationY += physicsState.current.velocity.x * 0.01;
        physicsState.current.position.rotationX += physicsState.current.velocity.y * 0.01;
        
        // Continue animation if there's still significant velocity
        if (Math.abs(physicsState.current.velocity.x) > 0.01 || 
            Math.abs(physicsState.current.velocity.y) > 0.01) {
          frameRequest.current = requestAnimationFrame(animate);
          setIsMoving(true);
        } else {
          frameRequest.current = null;
          setIsMoving(false);
        }
      };
      
      frameRequest.current = requestAnimationFrame(animate);
    }
  }, [isDragging, settings.friction, settings.usePhysics]);
  
  // Apply an impulse to the card
  const applyImpulse = useCallback((impulseX: number, impulseY: number, impulseZ?: number) => {
    physicsState.current.velocity.x += impulseX;
    physicsState.current.velocity.y += impulseY;
    
    if (impulseZ !== undefined) {
      physicsState.current.velocity.rotationZ += impulseZ;
    }
    
    // Start animation if not already running
    if (!frameRequest.current) {
      const animate = () => {
        // Apply physics simulation
        physicsState.current.velocity.x *= settings.friction;
        physicsState.current.velocity.y *= settings.friction;
        physicsState.current.velocity.rotationZ *= settings.friction;
        
        // Update position based on velocity
        physicsState.current.position.rotationY += physicsState.current.velocity.x * 0.01;
        physicsState.current.position.rotationX += physicsState.current.velocity.y * 0.01;
        physicsState.current.position.rotationZ += physicsState.current.velocity.rotationZ * 0.01;
        
        // Continue animation if there's still significant velocity
        if (Math.abs(physicsState.current.velocity.x) > 0.01 || 
            Math.abs(physicsState.current.velocity.y) > 0.01 ||
            Math.abs(physicsState.current.velocity.rotationZ) > 0.01) {
          frameRequest.current = requestAnimationFrame(animate);
          setIsMoving(true);
        } else {
          frameRequest.current = null;
          setIsMoving(false);
        }
      };
      
      frameRequest.current = requestAnimationFrame(animate);
      setIsMoving(true);
    }
  }, [settings.friction]);
  
  // Reset the card position
  const resetPosition = useCallback(() => {
    physicsState.current = {
      velocity: { x: 0, y: 0, rotationZ: 0 },
      position: { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0 }
    };
    
    if (frameRequest.current) {
      cancelAnimationFrame(frameRequest.current);
      frameRequest.current = null;
      setIsMoving(false);
    }
  }, []);
  
  // Alias for resetPosition to match component usage
  const resetCard = resetPosition;
  
  // Update physics settings
  const updateSettings = useCallback((newSettings: Partial<PhysicsSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  return {
    physicsState: physicsState.current,
    position,
    velocity,
    rotation,
    isMoving,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetPosition,
    resetCard,
    updateSettings,
    settings,
    isDragging,
    applyImpulse
  };
};

export default useCardPhysics;
