
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
  const [isFlipping, setIsFlipping] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastRotation, setLastRotation] = useState({ x: 0, y: 0 });
  
  const [controls, setControls] = useState<CardControls>({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.8,
    isFlipped: false,
    autoRotate: false
  });

  // Consolidated mouse interaction handlers
  const handlePointerDown = useCallback((event: { point: { x: number; y: number } }) => {
    if (isFlipping) return; // Prevent interaction during flip
    
    setIsDragging(true);
    setDragStart({ x: event.point.x, y: event.point.y });
    setLastRotation({ x: controls.rotation.x, y: controls.rotation.y });
    document.body.style.cursor = 'grabbing';
    console.log('Pointer down - starting drag');
  }, [controls.rotation, isFlipping]);

  const handlePointerMove = useCallback((event: { point: { x: number; y: number } }) => {
    if (!isDragging || isFlipping) return;

    const deltaX = (event.point.x - dragStart.x) * 4; // Increased sensitivity
    const deltaY = (event.point.y - dragStart.y) * 4;

    // Directly update the Three.js object for immediate response
    if (groupRef.current) {
      groupRef.current.rotation.y = lastRotation.y + deltaX;
      groupRef.current.rotation.x = lastRotation.x - deltaY;
    }
  }, [isDragging, dragStart, lastRotation, isFlipping]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.style.cursor = 'grab';
    
    // Sync state with actual rotation
    if (groupRef.current) {
      setControls(prev => ({
        ...prev,
        rotation: {
          x: groupRef.current!.rotation.x,
          y: groupRef.current!.rotation.y,
          z: groupRef.current!.rotation.z
        }
      }));
    }
    console.log('Pointer up - drag ended');
  }, [isDragging]);

  // Enhanced flip function with proper animation
  const flipCard = useCallback(() => {
    if (isFlipping || isDragging) return;
    
    setIsFlipping(true);
    console.log('Starting flip animation');
    
    setControls(prev => {
      const newFlipped = !prev.isFlipped;
      const targetY = newFlipped ? Math.PI : 0;
      
      // Animate to the target rotation
      if (groupRef.current) {
        const startY = groupRef.current.rotation.y;
        const duration = 600; // ms
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
          
          if (groupRef.current) {
            groupRef.current.rotation.y = startY + (targetY - startY) * eased;
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setIsFlipping(false);
            console.log('Flip animation completed');
          }
        };
        
        requestAnimationFrame(animate);
      }
      
      return {
        ...prev,
        isFlipped: newFlipped,
        rotation: { ...prev.rotation, y: targetY }
      };
    });
  }, [isFlipping, isDragging]);

  const toggleAutoRotate = useCallback(() => {
    setControls(prev => ({
      ...prev,
      autoRotate: !prev.autoRotate
    }));
  }, []);

  const resetCard = useCallback(() => {
    if (isFlipping) return;
    
    setControls(prev => ({
      ...prev,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 0.8,
      isFlipped: false,
      autoRotate: false
    }));
    setLastRotation({ x: 0, y: 0 });
    
    // Reset Three.js object immediately
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
      groupRef.current.scale.setScalar(0.8);
    }
  }, [isFlipping]);

  const faceCamera = useCallback(() => {
    if (isFlipping) return;
    
    setControls(prev => ({
      ...prev,
      rotation: { x: 0, y: 0, z: 0 },
      isFlipped: false
    }));
    
    if (groupRef.current) {
      groupRef.current.rotation.set(0, 0, 0);
    }
    setLastRotation({ x: 0, y: 0 });
  }, [isFlipping]);

  const showBack = useCallback(() => {
    if (isFlipping) return;
    
    setControls(prev => ({
      ...prev,
      rotation: { x: 0, y: Math.PI, z: 0 },
      isFlipped: true
    }));
    
    if (groupRef.current) {
      groupRef.current.rotation.set(0, Math.PI, 0);
    }
    setLastRotation({ x: 0, y: Math.PI });
  }, [isFlipping]);

  // Simplified frame update - no conflicting interpolation
  useFrame((state, delta) => {
    if (!groupRef.current || isDragging || isFlipping) return;

    // Only apply auto-rotation if enabled and not interacting
    if (controls.autoRotate) {
      groupRef.current.rotation.y += delta * 0.8;
      setControls(prev => ({
        ...prev,
        rotation: { ...prev.rotation, y: groupRef.current!.rotation.y }
      }));
    }

    // Adjust position based on sidebar state
    const targetX = sidebarOpen ? -0.2 : 0;
    if (Math.abs(groupRef.current.position.x - targetX) > 0.01) {
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.1;
    }
  });

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isFlipping) return;
      
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
        case '1':
          event.preventDefault();
          faceCamera();
          break;
        case '2':
          event.preventDefault();
          showBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [flipCard, toggleAutoRotate, resetCard, faceCamera, showBack, isFlipping]);

  return {
    groupRef,
    controls,
    isDragging,
    isFlipping,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    flipCard,
    toggleAutoRotate,
    resetCard,
    faceCamera,
    showBack,
    setControls
  };
};
