
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

    // Handle card flipping
    const targetRotationY = isFlipped ? Math.PI : 0;
    if (Math.abs(groupRef.current.rotation.y - targetRotationY) > 0.01) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1;
    }

    // Auto-rotate if enabled
    if (lightingSettings?.autoRotate) {
      groupRef.current.rotation.y += delta * 0.5;
    }

    // Follow pointer if enabled
    if (lightingSettings?.followPointer) {
      const mouse = state.mouse;
      groupRef.current.rotation.x = mouse.y * 0.1;
      groupRef.current.rotation.z = mouse.x * 0.05;
    }

    // Gentle floating animation
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.05;
  });
};
