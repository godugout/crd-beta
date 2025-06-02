
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CardAnimationsProps {
  groupRef: React.RefObject<THREE.Group>;
  isFlipped: boolean;
  lightingSettings: any;
}

export const useCardAnimations = ({
  groupRef,
  isFlipped,
  lightingSettings
}: CardAnimationsProps) => {
  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Handle card flipping with smoother animation
    const targetRotationY = isFlipped ? Math.PI : 0;
    if (Math.abs(groupRef.current.rotation.y - targetRotationY) > 0.01) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.15;
    }

    // Auto-rotate if enabled
    if (lightingSettings?.autoRotate) {
      groupRef.current.rotation.y += delta * 0.5;
    }

    // Follow pointer if enabled with enhanced sensitivity
    if (lightingSettings?.followPointer) {
      const mouse = state.mouse;
      const targetRotationX = mouse.y * 0.15;
      const targetRotationZ = mouse.x * 0.1;
      
      // Smooth interpolation for pointer following
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.1;
      groupRef.current.rotation.z += (targetRotationZ - groupRef.current.rotation.z) * 0.1;
    }

    // Gentle floating animation
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.03;
    
    // Add subtle rotation variation for more dynamic feel
    if (!lightingSettings?.autoRotate && !lightingSettings?.followPointer) {
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.02;
      groupRef.current.rotation.z = Math.cos(time * 0.4) * 0.01;
    }
  });
};
