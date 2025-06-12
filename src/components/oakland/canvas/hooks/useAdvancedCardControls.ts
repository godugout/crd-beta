
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
  
  const [controls, setControls] = useState<CardControls>({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.8, // Smaller default scale
    isFlipped: false,
    autoRotate: false
  });

  // Handle mouse interactions
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;

    setControls(prev => ({
      ...prev,
      rotation: {
        ...prev.rotation,
        y: prev.rotation.y + deltaX * 0.01,
        x: prev.rotation.x - deltaY * 0.01
      }
    }));

    setDragStart({ x: event.clientX, y: event.clientY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard controls
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case 'f':
        flipCard();
        break;
      case ' ':
        toggleAutoRotate();
        event.preventDefault();
        break;
      case 'r':
        resetCard();
        break;
      case 'arrowup':
        moveCard('up');
        event.preventDefault();
        break;
      case 'arrowdown':
        moveCard('down');
        event.preventDefault();
        break;
      case 'arrowleft':
        moveCard('left');
        event.preventDefault();
        break;
      case 'arrowright':
        moveCard('right');
        event.preventDefault();
        break;
      case '=':
      case '+':
        scaleCard(0.1);
        event.preventDefault();
        break;
      case '-':
        scaleCard(-0.1);
        event.preventDefault();
        break;
    }
  }, []);

  // Control functions
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

  // Adjust position based on sidebar state
  useEffect(() => {
    const sidebarOffset = sidebarOpen ? -0.3 : 0;
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

  // Animation frame
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Auto rotation
    if (controls.autoRotate) {
      setControls(prev => ({
        ...prev,
        rotation: {
          ...prev.rotation,
          y: prev.rotation.y + delta * 0.5
        }
      }));
    }

    // Apply transforms
    groupRef.current.position.set(
      controls.position.x,
      controls.position.y,
      controls.position.z
    );
    groupRef.current.rotation.set(
      controls.rotation.x,
      controls.rotation.y,
      controls.rotation.z
    );
    groupRef.current.scale.setScalar(controls.scale);
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
