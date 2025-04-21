
import { useState, useEffect, useCallback } from 'react';

interface PhysicsState {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  isMoving: boolean;
  isDragging: boolean;
}

interface PhysicsSettings {
  dampingFactor?: number;
  rotationDampingFactor?: number;
  sensitivity?: number;
  boundaryConstraints?: boolean;
  maxRotation?: number;
}

export const useCardPhysics = (settings: PhysicsSettings = {}) => {
  const {
    dampingFactor = 0.95,
    rotationDampingFactor = 0.9,
    sensitivity = 0.2,
    boundaryConstraints = false,
    maxRotation = Math.PI / 4 // 45 degrees
  } = settings;

  const [state, setState] = useState<PhysicsState>({
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    isMoving: false,
    isDragging: false
  });

  const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });
  const [frameId, setFrameId] = useState<number | null>(null);

  // Update physics simulation each frame
  const updatePhysics = useCallback(() => {
    setState(prevState => {
      // Don't apply physics while dragging
      if (prevState.isDragging) {
        return prevState;
      }

      // Apply velocity and damping
      const newVelocity = {
        x: prevState.velocity.x * dampingFactor,
        y: prevState.velocity.y * dampingFactor,
        z: prevState.velocity.z * dampingFactor
      };

      // Calculate new position
      let newPosition = {
        x: prevState.position.x + newVelocity.x,
        y: prevState.position.y + newVelocity.y,
        z: prevState.position.z + newVelocity.z
      };

      // Apply boundary constraints if enabled
      if (boundaryConstraints) {
        const boundary = 500;
        if (Math.abs(newPosition.x) > boundary) {
          newPosition.x = Math.sign(newPosition.x) * boundary;
          newVelocity.x *= -0.5; // Bounce with energy loss
        }
        
        if (Math.abs(newPosition.y) > boundary) {
          newPosition.y = Math.sign(newPosition.y) * boundary;
          newVelocity.y *= -0.5; // Bounce with energy loss
        }
      }

      // Apply rotation damping
      const newRotation = {
        x: prevState.rotation.x * rotationDampingFactor,
        y: prevState.rotation.y * rotationDampingFactor,
        z: prevState.rotation.z * rotationDampingFactor
      };

      // Check if still moving
      const isStillMoving = 
        Math.abs(newVelocity.x) > 0.01 || 
        Math.abs(newVelocity.y) > 0.01 ||
        Math.abs(newRotation.x) > 0.001 ||
        Math.abs(newRotation.y) > 0.001;

      return {
        ...prevState,
        position: newPosition,
        velocity: newVelocity,
        rotation: newRotation,
        isMoving: isStillMoving
      };
    });

    // Continue animation loop if moving
    const id = requestAnimationFrame(updatePhysics);
    setFrameId(id);
  }, [dampingFactor, rotationDampingFactor, boundaryConstraints]);

  // Start physics loop when component mounts
  useEffect(() => {
    const id = requestAnimationFrame(updatePhysics);
    setFrameId(id);
    
    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [updatePhysics]);

  // Handle pointer down event
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setState(prev => ({ ...prev, isDragging: true }));
    setLastPointerPos({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle pointer move event
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!state.isDragging) return;

    const dx = e.clientX - lastPointerPos.x;
    const dy = e.clientY - lastPointerPos.y;

    setState(prev => ({
      ...prev,
      position: {
        x: prev.position.x + dx * sensitivity,
        y: prev.position.y + dy * sensitivity,
        z: prev.position.z
      },
      rotation: {
        x: Math.max(-maxRotation, Math.min(maxRotation, prev.rotation.x - dy * 0.01)),
        y: Math.max(-maxRotation, Math.min(maxRotation, prev.rotation.y + dx * 0.01)),
        z: prev.rotation.z
      }
    }));

    setLastPointerPos({ x: e.clientX, y: e.clientY });
  }, [state.isDragging, lastPointerPos, sensitivity, maxRotation]);

  // Handle pointer up event
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    // Calculate final velocity based on movement
    const dx = e.clientX - lastPointerPos.x;
    const dy = e.clientY - lastPointerPos.y;
    
    setState(prev => ({
      ...prev,
      isDragging: false,
      isMoving: true,
      velocity: {
        x: dx * sensitivity * 0.1,
        y: dy * sensitivity * 0.1,
        z: 0
      }
    }));
  }, [lastPointerPos, sensitivity]);

  // Reset card position and rotation
  const resetCard = useCallback(() => {
    setState({
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      isMoving: false,
      isDragging: false
    });
  }, []);

  return {
    ...state,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetCard
  };
};

export default useCardPhysics;
