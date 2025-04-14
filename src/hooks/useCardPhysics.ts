
import { useRef, useState, useEffect } from 'react';

interface PhysicsState {
  position: { x: number; y: number };
  rotation: { x: number; y: number; z: number };
  velocity: { x: number; y: number };
  angularVelocity: { x: number; y: number; z: number };
  isMoving: boolean;
}

interface UseCardPhysicsProps {
  dampingFactor?: number;
  rotationDampingFactor?: number;
  sensitivity?: number;
  autoRotate?: boolean;
  weightlessness?: number;
}

export function useCardPhysics({
  dampingFactor = 0.95,
  rotationDampingFactor = 0.92,
  sensitivity = 0.15,
  autoRotate = false,
  weightlessness = 0.5  // New parameter to control the weightless feeling (0-1)
}: UseCardPhysicsProps = {}) {
  const [state, setState] = useState<PhysicsState>({
    position: { x: 0, y: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0 },
    angularVelocity: { x: 0, y: 0, z: 0 },
    isMoving: false
  });

  const frameRef = useRef<number>();
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const isPointerDownRef = useRef(false);
  const moveStartTimeRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);
  
  // Initialize physics simulation
  useEffect(() => {
    const updatePhysics = () => {
      const now = Date.now();
      const deltaTime = Math.min(33, now - lastUpdateTimeRef.current) / 16.67; // Cap at 60fps equivalent
      lastUpdateTimeRef.current = now;
      
      setState(prevState => {
        // Only update physics if the card is actually moving or auto-rotating
        if (!prevState.isMoving && !autoRotate && 
            Math.abs(prevState.velocity.x) < 0.01 && 
            Math.abs(prevState.velocity.y) < 0.01 &&
            Math.abs(prevState.angularVelocity.x) < 0.01 &&
            Math.abs(prevState.angularVelocity.y) < 0.01 &&
            Math.abs(prevState.angularVelocity.z) < 0.01) {
          return prevState;
        }

        // Apply damping to slow down movement over time - adjusted for smoother deceleration
        const newVelocity = {
          x: prevState.velocity.x * (dampingFactor ** deltaTime),
          y: prevState.velocity.y * (dampingFactor ** deltaTime)
        };

        // Apply damping to angular velocity - adjusted for more natural rotation
        const newAngularVelocity = {
          x: prevState.angularVelocity.x * (rotationDampingFactor ** deltaTime),
          y: prevState.angularVelocity.y * (rotationDampingFactor ** deltaTime),
          z: prevState.angularVelocity.z * (rotationDampingFactor ** deltaTime)
        };

        // Update position based on velocity, with weightlessness factor
        const newPosition = {
          x: prevState.position.x + newVelocity.x * (1 + weightlessness),
          y: prevState.position.y + newVelocity.y * (1 + weightlessness)
        };

        // Update rotation based on angular velocity, with weightlessness factor
        const newRotation = {
          x: prevState.rotation.x + newAngularVelocity.x * (1 + weightlessness * 0.5),
          y: prevState.rotation.y + newAngularVelocity.y * (1 + weightlessness * 0.5),
          z: prevState.rotation.z + newAngularVelocity.z * (1 + weightlessness * 0.5)
        };

        // Add very subtle auto-rotation if enabled
        const autoRotationEffect = autoRotate ? {
          x: newRotation.x + Math.sin(Date.now() / 5000) * 0.005,
          y: newRotation.y + Math.cos(Date.now() / 3000) * 0.008,
          z: newRotation.z
        } : newRotation;

        // Check if the card has effectively stopped moving
        const isStillMoving = 
          isPointerDownRef.current ||
          Math.abs(newVelocity.x) > 0.01 || 
          Math.abs(newVelocity.y) > 0.01 ||
          Math.abs(newAngularVelocity.x) > 0.01 ||
          Math.abs(newAngularVelocity.y) > 0.01 ||
          autoRotate;

        return {
          position: newPosition,
          rotation: autoRotationEffect,
          velocity: newVelocity,
          angularVelocity: newAngularVelocity,
          isMoving: isStillMoving
        };
      });

      frameRef.current = requestAnimationFrame(updatePhysics);
    };

    lastUpdateTimeRef.current = Date.now();
    // Start the physics loop
    frameRef.current = requestAnimationFrame(updatePhysics);

    // Clean up animation frame on unmount
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [dampingFactor, rotationDampingFactor, autoRotate, weightlessness]);

  // Handle pointer interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    moveStartTimeRef.current = Date.now();
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    
    // Smoothly reduce velocity rather than immediate stop for more natural feeling
    setState(prev => ({
      ...prev,
      isMoving: true,
      velocity: { 
        x: prev.velocity.x * 0.5, 
        y: prev.velocity.y * 0.5 
      },
      angularVelocity: { 
        x: prev.angularVelocity.x * 0.5, 
        y: prev.angularVelocity.y * 0.5, 
        z: prev.angularVelocity.z * 0.5 
      }
    }));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    const timeDelta = Math.max(1, Date.now() - moveStartTimeRef.current);
    
    // Calculate speed of movement for "flick" detection
    const moveSpeed = Math.sqrt(dx * dx + dy * dy);
    
    // Update state with new velocity and angular velocity
    setState(prev => {
      // Calculate momentum-based velocity
      const newVelocity = {
        x: dx * sensitivity * (1 + weightlessness * 0.5),
        y: dy * sensitivity * (1 + weightlessness * 0.5)
      };

      // Convert mouse movement to rotation (reversed for natural feel)
      const newAngularVelocity = {
        x: prev.angularVelocity.x * 0.8 - (dy * sensitivity * 0.1 * (1 + weightlessness * 0.3)),
        y: prev.angularVelocity.y * 0.8 + (dx * sensitivity * 0.1 * (1 + weightlessness * 0.3)),
        // Add a small z-rotation for more natural movement
        z: prev.angularVelocity.z * 0.8 + (dx * sensitivity * 0.02 * (1 + weightlessness * 0.2))
      };

      return {
        ...prev,
        velocity: newVelocity,
        angularVelocity: newAngularVelocity,
        isMoving: true
      };
    });

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    moveStartTimeRef.current = Date.now();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    
    const moveDuration = Date.now() - moveStartTimeRef.current;
    
    // Calculate "flick" velocity based on movement speed and duration
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    
    // Short, fast movements result in stronger flicks
    const flickMultiplier = moveDuration < 100 ? 2.5 : moveDuration < 200 ? 1.8 : 1.2;
    
    // Boost velocity for a more satisfying flick effect, with increased weightlessness
    setState(prev => ({
      ...prev,
      velocity: {
        x: prev.velocity.x * flickMultiplier * (1 + weightlessness * 1.2),
        y: prev.velocity.y * flickMultiplier * (1 + weightlessness * 1.2)
      },
      // Also boost angular velocity on release for better spin
      angularVelocity: {
        x: prev.angularVelocity.x * flickMultiplier * (1 + weightlessness * 0.8),
        y: prev.angularVelocity.y * flickMultiplier * (1 + weightlessness * 0.8),
        z: prev.angularVelocity.z * flickMultiplier * (1 + weightlessness * 0.5)
      }
    }));
  };

  // Reset card to neutral position
  const resetCard = () => {
    setState({
      position: { x: 0, y: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
      isMoving: false
    });
  };

  // Apply an impulse force to set the card in motion
  const applyImpulse = (x: number, y: number, spin = 0) => {
    setState(prev => ({
      ...prev,
      velocity: {
        x: prev.velocity.x + x * (1 + weightlessness * 0.5),
        y: prev.velocity.y + y * (1 + weightlessness * 0.5)
      },
      angularVelocity: {
        x: prev.angularVelocity.x + y * 0.05 * (1 + weightlessness * 0.3),
        y: prev.angularVelocity.y - x * 0.05 * (1 + weightlessness * 0.3),
        z: prev.angularVelocity.z + spin * (1 + weightlessness * 0.2)
      },
      isMoving: true
    }));
  };

  return {
    ...state,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetCard,
    applyImpulse
  };
}
