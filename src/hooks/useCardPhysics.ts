
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
}

export function useCardPhysics({
  dampingFactor = 0.95,
  rotationDampingFactor = 0.92,
  sensitivity = 0.15,
  autoRotate = false
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
  
  // Initialize physics simulation
  useEffect(() => {
    const updatePhysics = () => {
      setState(prevState => {
        // Only update physics if the card is actually moving
        if (!prevState.isMoving && !autoRotate && 
            Math.abs(prevState.velocity.x) < 0.01 && 
            Math.abs(prevState.velocity.y) < 0.01 &&
            Math.abs(prevState.angularVelocity.x) < 0.01 &&
            Math.abs(prevState.angularVelocity.y) < 0.01 &&
            Math.abs(prevState.angularVelocity.z) < 0.01) {
          return prevState;
        }

        // Apply damping to slow down movement over time
        const newVelocity = {
          x: prevState.velocity.x * dampingFactor,
          y: prevState.velocity.y * dampingFactor
        };

        // Apply damping to angular velocity
        const newAngularVelocity = {
          x: prevState.angularVelocity.x * rotationDampingFactor,
          y: prevState.angularVelocity.y * rotationDampingFactor,
          z: prevState.angularVelocity.z * rotationDampingFactor
        };

        // Update position based on velocity
        const newPosition = {
          x: prevState.position.x + newVelocity.x,
          y: prevState.position.y + newVelocity.y
        };

        // Update rotation based on angular velocity
        const newRotation = {
          x: prevState.rotation.x + newAngularVelocity.x,
          y: prevState.rotation.y + newAngularVelocity.y,
          z: prevState.rotation.z + newAngularVelocity.z
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

    // Start the physics loop
    frameRef.current = requestAnimationFrame(updatePhysics);

    // Clean up animation frame on unmount
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [dampingFactor, rotationDampingFactor, autoRotate]);

  // Handle pointer interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    
    // Pause any existing motion when user grabs the card
    setState(prev => ({
      ...prev,
      isMoving: true,
      velocity: { x: 0, y: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 }
    }));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    // Calculate speed of movement for "flick" detection
    const moveSpeed = Math.sqrt(dx * dx + dy * dy);
    
    // Update state with new velocity and angular velocity
    setState(prev => {
      // Convert mouse movement to rotation (reversed for natural feel)
      const newAngularVelocity = {
        x: prev.angularVelocity.x - (dy * sensitivity * 0.1),
        y: prev.angularVelocity.y + (dx * sensitivity * 0.1),
        // Add a small z-rotation for more natural movement
        z: prev.angularVelocity.z + (dx * sensitivity * 0.02)
      };

      return {
        ...prev,
        velocity: {
          x: dx * sensitivity,
          y: dy * sensitivity
        },
        angularVelocity: newAngularVelocity,
        isMoving: true
      };
    });

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPointerDownRef.current = false;
    
    // Calculate "flick" velocity based on movement speed
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    
    // Boost velocity for a more satisfying flick effect
    setState(prev => ({
      ...prev,
      velocity: {
        x: prev.velocity.x * 1.2,
        y: prev.velocity.y * 1.2
      },
      // Also boost angular velocity on release for better spin
      angularVelocity: {
        x: prev.angularVelocity.x * 1.2,
        y: prev.angularVelocity.y * 1.2,
        z: prev.angularVelocity.z * 1.2
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
        x: prev.velocity.x + x,
        y: prev.velocity.y + y
      },
      angularVelocity: {
        x: prev.angularVelocity.x + y * 0.05,
        y: prev.angularVelocity.y - x * 0.05,
        z: prev.angularVelocity.z + spin
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
