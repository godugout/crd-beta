
import { useState, useCallback, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CardControls {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  isFlipped: boolean;
  autoRotate: boolean;
}

interface UseAdvancedCardControlsProps {
  sidebarOpen?: boolean;
}

export const useAdvancedCardControls = ({ sidebarOpen = false }: UseAdvancedCardControlsProps = {}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastRotation, setLastRotation] = useState({ x: 0, y: 0 });
  
  const [controls, setControls] = useState<CardControls>({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }, // Start with proper orientation
    scale: 0.8,
    isFlipped: false,
    autoRotate: false
  });

  // Handle Three.js pointer events
  const handleMouseDown = useCallback((event: { point: { x: number; y: number } }) => {
    setIsDragging(true);
    setDragStart({ x: event.point.x, y: event.point.y });
    // Store current rotation as reference
    setLastRotation({ x: controls.rotation.x, y: controls.rotation.y });
  }, [controls.rotation]);

  const handleMouseMove = useCallback((event: { point: { x: number; y: number } }) => {
    if (!isDragging) return;

    const deltaX = (event.point.x - dragStart.x) * 2; // Increase sensitivity
    const deltaY = (event.point.y - dragStart.y) * 2;

    setControls(prev => ({
      ...prev,
      rotation: {
        ...prev.rotation,
        y: lastRotation.y + deltaX, // Horizontal movement rotates around Y axis
        x: lastRotation.x - deltaY  // Vertical movement rotates around X axis
      }
    }));
  }, [isDragging, dragStart, lastRotation]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Enhanced control functions
  const flipCard = useCallback(() => {
    setControls(prev => ({
      ...prev,
      isFlipped: !prev.isFlipped,
      rotation: {
        ...prev.rotation,
        y: prev.rotation.y + Math.PI
      }
    }));
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setControls(prev => ({
      ...prev,
      autoRotate: !prev.autoRotate
    }));
  }, []);

  const resetCard = useCallback(() => {
    setControls(prev => ({
      ...prev,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 0.8,
      isFlipped: false,
      autoRotate: false
    }));
    setLastRotation({ x: 0, y: 0 });
  }, []);

  const moveCard = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const moveAmount = 0.2;
    setControls(prev => {
      const newPosition = { ...prev.position };
      switch (direction) {
        case 'up':
          newPosition.y += moveAmount;
          break;
        case 'down':
          newPosition.y -= moveAmount;
          break;
        case 'left':
          newPosition.x -= moveAmount;
          break;
        case 'right':
          newPosition.x += moveAmount;
          break;
      }
      return { ...prev, position: newPosition };
    });
  }, []);

  const scaleCard = useCallback((delta: number) => {
    setControls(prev => ({
      ...prev,
      scale: Math.max(0.3, Math.min(2.0, prev.scale + delta))
    }));
  }, []);

  // Enhanced keyboard controls
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Prevent default for specific keys we handle
    switch (event.key.toLowerCase()) {
      case 'f':
        event.preventDefault();
        flipCard();
        break;
      case ' ':
        event.preventDefault();
        toggleAutoRotate();
        break;
      case 'r':
        event.preventDefault();
        resetCard();
        break;
      case 'arrowup':
        event.preventDefault();
        moveCard('up');
        break;
      case 'arrowdown':
        event.preventDefault();
        moveCard('down');
        break;
      case 'arrowleft':
        event.preventDefault();
        moveCard('left');
        break;
      case 'arrowright':
        event.preventDefault();
        moveCard('right');
        break;
      case '=':
      case '+':
        event.preventDefault();
        scaleCard(0.1);
        break;
      case '-':
        event.preventDefault();
        scaleCard(-0.1);
        break;
    }
  }, [flipCard, toggleAutoRotate, resetCard, moveCard, scaleCard]);

  // Adjust position based on sidebar state
  useEffect(() => {
    const sidebarOffset = sidebarOpen ? -0.2 : 0;
    setControls(prev => ({
      ...prev,
      position: { ...prev.position, x: sidebarOffset }
    }));
  }, [sidebarOpen]);

  // Setup keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Animation frame with smooth interpolation
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Auto rotation
    if (controls.autoRotate && !isDragging) {
      setControls(prev => ({
        ...prev,
        rotation: {
          ...prev.rotation,
          y: prev.rotation.y + delta * 0.8
        }
      }));
    }

    // Smooth application of transforms
    const targetPosition = new THREE.Vector3(
      controls.position.x,
      controls.position.y,
      controls.position.z
    );
    const targetRotation = new THREE.Euler(
      controls.rotation.x,
      controls.rotation.y,
      controls.rotation.z
    );
    const targetScale = controls.scale;

    // Smooth interpolation for better UX
    groupRef.current.position.lerp(targetPosition, 0.1);
    groupRef.current.rotation.x += (targetRotation.x - groupRef.current.rotation.x) * 0.1;
    groupRef.current.rotation.y += (targetRotation.y - groupRef.current.rotation.y) * 0.1;
    groupRef.current.rotation.z += (targetRotation.z - groupRef.current.rotation.z) * 0.1;
    
    const currentScale = groupRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.1;
    groupRef.current.scale.setScalar(newScale);
  });

  return {
    groupRef,
    controls,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    flipCard,
    toggleAutoRotate,
    resetCard,
    moveCard,
    scaleCard,
    setControls
  };
};
