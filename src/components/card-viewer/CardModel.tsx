
import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Card } from '@/lib/types';
import * as THREE from 'three';

interface CardModelProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
}

export const CardModel: React.FC<CardModelProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load card texture
  const frontTexture = useLoader(TextureLoader, card.imageUrl || '/placeholder-card.png');
  const backTexture = useLoader(TextureLoader, '/images/card-back-placeholder.png');
  
  // Create materials based on active effects
  const frontMaterial = useMemo(() => {
    const intensity = effectIntensities.holographic || 0.7;
    
    if (activeEffects.includes('holographic')) {
      return new THREE.MeshPhysicalMaterial({
        map: frontTexture,
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
    
    return new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      roughness: 0.2,
      metalness: 0.8,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
    });
  }, [frontTexture, activeEffects, effectIntensities]);

  const backMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.3,
      metalness: 0.7,
      envMapIntensity: 1.2,
    });
  }, [backTexture]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth rotation animation
    const targetRotationY = isFlipped ? Math.PI : 0;
    if (groupRef.current.rotation.y !== targetRotationY) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1;
    }
    
    // Subtle floating animation
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.01;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Card Front */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={frontMaterial} />
      </mesh>
      
      {/* Card Back */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} />
      </mesh>
    </group>
  );
};

export default CardModel;
