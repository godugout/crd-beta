
import { useState, useCallback, useRef } from 'react';

export interface PhysicsSettings {
  mass: number;
  friction: number;
  restitution: number;
  dampening: number;
  usePhysics: boolean;
  autoRotate?: boolean;
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
    usePhysics: true,
    ...initialSettings
  };

  const [settings, setSettings] = useState<PhysicsSettings>(defaultSettings);
  const [isDragging, setIsDragging] = useState(false);
  const physicsState = useRef<PhysicsState>({
    velocity: { x: 0, y: 0, rotationZ: 0 },
    position: { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, rotationZ: 0 }
  });
  
  // Reference to last pointer position
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const frameRequest = useRef<number | null>(null);
  
  // Handle pointer down event
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    
    // Stop any animations
    if (frameRequest.current) {
      cancelAnimationFrame(frameRequest.current);
      frameRequest.current = null;
    }
  }, []);
  
  // Handle pointer move event
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - lastPointerPos.current.x;
    const dy = e.clientY - lastPointerPos.current.y;
    
    lastPointerPos.current = { x: e.clientX, y: e.clientY };
    
    // Update velocity based on pointer movement
    physicsState.current.velocity.x = dx * 0.1;
    physicsState.current.velocity.y = dy * 0.1;
    
    // Update card position
    physicsState.current.position.rotationY += dx * 0.01;
    physicsState.current.position.rotationX -= dy * 0.01;
  }, [isDragging]);
  
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
        } else {
          frameRequest.current = null;
        }
      };
      
      frameRequest.current = requestAnimationFrame(animate);
    }
  }, [isDragging, settings.friction, settings.usePhysics]);
  
  // Apply an impulse to the card
  const applyImpulse = useCallback((impulseX: number, impulseY: number) => {
    physicsState.current.velocity.x += impulseX;
    physicsState.current.velocity.y += impulseY;
    
    // Start animation if not already running
    if (!frameRequest.current) {
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
        } else {
          frameRequest.current = null;
        }
      };
      
      frameRequest.current = requestAnimationFrame(animate);
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
    }
  }, []);
  
  // Update physics settings
  const updateSettings = useCallback((newSettings: Partial<PhysicsSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  return {
    physicsState: physicsState.current,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetPosition,
    updateSettings,
    settings,
    isDragging,
    applyImpulse
  };
};

export default useCardPhysics;
