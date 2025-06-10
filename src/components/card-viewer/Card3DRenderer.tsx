
import React, { useRef, useEffect, useMemo } from 'react';
import { Card } from '@/lib/types';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Card3DRendererProps {
  card: Card;
  className?: string;
  isFlipped?: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
}

const Card3DRenderer: React.FC<Card3DRendererProps> = ({ 
  card, 
  className,
  isFlipped = false,
  activeEffects = [],
  effectIntensities = {}
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load textures
  const frontTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(card.imageUrl || '/placeholder-card.png');
    texture.flipY = false; // Prevent texture flipping
    return texture;
  }, [card.imageUrl]);

  const backTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/images/card-back-placeholder.png');
    texture.flipY = false;
    return texture;
  }, []);

  // Create materials based on active effects
  const frontMaterial = useMemo(() => {
    const intensity = effectIntensities[activeEffects[0]] || 1.0;
    
    if (activeEffects.includes('Holographic')) {
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
    
    if (activeEffects.includes('Chrome')) {
      return new THREE.MeshPhysicalMaterial({
        map: frontTexture,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: 3.0 * intensity,
        clearcoat: 1.0,
      });
    }
    
    if (activeEffects.includes('Vintage')) {
      return new THREE.MeshStandardMaterial({
        map: frontTexture,
        roughness: 0.8,
        metalness: 0.1,
        envMapIntensity: 0.3,
      });
    }
    
    // Default material
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
      clearcoat: 0.8,
    });
  }, [backTexture]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Handle flipping animation
    const targetRotationY = isFlipped ? Math.PI : 0;
    if (Math.abs(groupRef.current.rotation.y - targetRotationY) > 0.01) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1;
    }
    
    // Subtle floating animation
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.02;
    
    // Gentle rotation when not flipped
    if (!isFlipped) {
      groupRef.current.rotation.y += Math.sin(time * 0.3) * 0.002;
    }
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

export default Card3DRenderer;
