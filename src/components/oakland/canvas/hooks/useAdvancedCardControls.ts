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
  
  // Improved mouse control state with better smoothing
  const [momentum, setMomentum] = useState({ x: 0, y: 0 });
  const lastMouseTime = useRef(0);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const velocitySmoothing = useRef<Array<{ x: number; y: number; time: number }>>([]);
  
  const [controls, setControls] = useState<CardControls>({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: 0.8,
    isFlipped: false,
    autoRotate: false
  });

  // Improved mouse interaction handlers with better responsiveness
  const handlePointerDown = useCallback((event: { point: { x: number; y: number } }) => {
    if (isFlipping) return;
    
    setIsDragging(true);
    setDragStart({ x: event.point.x, y: event.point.y });
    setLastRotation({ x: controls.rotation.x, y: controls.rotation.y });
    setMomentum({ x: 0, y: 0 });
    
    // Initialize smooth velocity tracking
    lastMouseTime.current = performance.now();
    lastMousePosition.current = { x: event.point.x, y: event.point.y };
    velocitySmoothing.current = [];
    
    document.body.style.cursor = 'grabbing';
    console.log('Smooth drag started');
  }, [controls.rotation, isFlipping]);

  const handlePointerMove = useCallback((event: { point: { x: number; y: number } }) => {
    if (!isDragging || isFlipping) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastMouseTime.current;
    
    if (deltaTime > 16) { // Limit to ~60fps for smoother updates
      // Much higher sensitivity for more responsive controls
      const sensitivity = 15;
      const deltaX = (event.point.x - dragStart.x) * sensitivity;
      const deltaY = (event.point.y - dragStart.y) * sensitivity;

      // Track velocity with better smoothing
      if (deltaTime > 0) {
        const velocityX = (event.point.x - lastMousePosition.current.x) / deltaTime * 1000;
        const velocityY = (event.point.y - lastMousePosition.current.y) / deltaTime * 1000;
        
        velocitySmoothing.current.push({ x: velocityX, y: velocityY, time: currentTime });
        
        // Keep only recent samples (last 80ms for smoother momentum)
        velocitySmoothing.current = velocitySmoothing.current.filter(v => currentTime - v.time < 80);
      }

      // Apply rotation with immediate response
      if (groupRef.current) {
        groupRef.current.rotation.y = lastRotation.y + deltaX;
        groupRef.current.rotation.x = lastRotation.x - deltaY;
      }

      lastMouseTime.current = currentTime;
      lastMousePosition.current = { x: event.point.x, y: event.point.y };
    }
  }, [isDragging, dragStart, lastRotation, isFlipping]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.style.cursor = 'grab';
    
    // Calculate smooth momentum from recent velocity
    if (velocitySmoothing.current.length > 0) {
      const recentVelocities = velocitySmoothing.current.slice(-3); // Use last 3 samples
      const avgVelocity = recentVelocities.reduce(
        (acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }),
        { x: 0, y: 0 }
      );
      avgVelocity.x /= recentVelocities.length;
      avgVelocity.y /= recentVelocities.length;
      
      // Apply momentum with better scaling
      setMomentum({
        x: avgVelocity.y * 0.015, // Increased momentum transfer
        y: avgVelocity.x * 0.015
      });
    }
    
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
    console.log('Smooth drag ended with momentum');
  }, [isDragging]);

  // Enhanced flip function with better animation
  const flipCard = useCallback(() => {
    if (isFlipping || isDragging) return;
    
    setIsFlipping(true);
    console.log('Starting smooth flip animation');
    
    setControls(prev => {
      const newFlipped = !prev.isFlipped;
      const targetY = newFlipped ? Math.PI : 0;
      
      if (groupRef.current) {
        const startY = groupRef.current.rotation.y;
        const duration = 600; // Slightly faster for better feel
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Better easing for smoother animation
          const eased = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          
          if (groupRef.current) {
            groupRef.current.rotation.y = startY + (targetY - startY) * eased;
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setIsFlipping(false);
            console.log('Smooth flip completed');
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
    setMomentum({ x: 0, y: 0 });
    
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
    setMomentum({ x: 0, y: 0 });
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
    setMomentum({ x: 0, y: 0 });
  }, [isFlipping]);

  // Enhanced frame update with better momentum physics
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Apply momentum with improved damping
    if (!isDragging && !isFlipping && (Math.abs(momentum.x) > 0.001 || Math.abs(momentum.y) > 0.001)) {
      groupRef.current.rotation.x += momentum.x * delta * 60;
      groupRef.current.rotation.y += momentum.y * delta * 60;
      
      // Better damping curve for more natural feel
      const damping = 0.92;
      setMomentum(prev => ({
        x: prev.x * damping,
        y: prev.y * damping
      }));
      
      // Stop momentum when very small
      if (Math.abs(momentum.x) < 0.001 && Math.abs(momentum.y) < 0.001) {
        setMomentum({ x: 0, y: 0 });
      }
    }

    // Auto-rotation
    if (controls.autoRotate && !isDragging && !isFlipping && Math.abs(momentum.x) < 0.001 && Math.abs(momentum.y) < 0.001) {
      groupRef.current.rotation.y += delta * 0.8;
      setControls(prev => ({
        ...prev,
        rotation: { ...prev.rotation, y: groupRef.current!.rotation.y }
      }));
    }

    // Smooth sidebar position adjustment
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
