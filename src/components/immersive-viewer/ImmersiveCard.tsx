
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Card } from '@/lib/types';

interface ImmersiveCardProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  materialSettings: any;
  lightingSettings: any;
}

const ImmersiveCard: React.FC<ImmersiveCardProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities,
  materialSettings,
  lightingSettings
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Load textures
  const frontTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(card.imageUrl || '/images/card-placeholder.jpg');
    texture.flipY = false;
    return texture;
  }, [card.imageUrl]);

  const backTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/images/card-back-placeholder.png');
    texture.flipY = false;
    return texture;
  }, []);

  // Create materials based on active effects and settings
  const frontMaterial = useMemo(() => {
    const baseSettings = {
      map: frontTexture,
      roughness: materialSettings?.roughness || 0.2,
      metalness: materialSettings?.metalness || 0.8,
      envMapIntensity: materialSettings?.envMapIntensity || 1.0,
      ...materialSettings
    };

    // Apply effect-specific material properties
    if (activeEffects.includes('holographic')) {
      const intensity = effectIntensities.holographic || 0.7;
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        metalness: 0.9 * intensity,
        roughness: 0.1 * (1 - intensity * 0.8),
        envMapIntensity: 2.0 * intensity,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        iridescence: 1.0 * intensity,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 800],
      });
    }

    if (activeEffects.includes('refractor')) {
      const intensity = effectIntensities.refractor || 0.5;
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        transmission: 0.1 * intensity,
        thickness: 0.5,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
      });
    }

    if (activeEffects.includes('chrome')) {
      const intensity = effectIntensities.chrome || 0.4;
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: 3.0 * intensity,
        clearcoat: 1.0,
      });
    }

    if (activeEffects.includes('vintage')) {
      return new THREE.MeshStandardMaterial({
        map: frontTexture,
        roughness: 0.8,
        metalness: 0.1,
        envMapIntensity: 0.3,
      });
    }

    return new THREE.MeshPhysicalMaterial(baseSettings);
  }, [frontTexture, activeEffects, effectIntensities, materialSettings]);

  const backMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.3,
      metalness: 0.7,
      envMapIntensity: 1.2,
    });
  }, [backTexture]);

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

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Front of card */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={frontMaterial} />
      </mesh>
      
      {/* Back of card */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} />
      </mesh>
    </group>
  );
};

export default ImmersiveCard;
