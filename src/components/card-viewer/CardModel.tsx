
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Card } from '@/lib/types/cardTypes';
import { useTexture } from '@react-three/drei';

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
  const cardRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  
  // Standard card dimensions (aspect ratio: 2.5 x 3.5)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.02;
  
  // Load textures
  // Use placeholders if the card doesn't have images
  const frontImageUrl = card.imageUrl || '/placeholders/card-front.jpg';
  const backImageUrl = card.backImageUrl || '/placeholders/card-back.jpg';
  
  // Load textures with error handling
  const frontTexture = useTexture(frontImageUrl);
  const backTexture = useTexture(backImageUrl);
  
  // Create materials
  const materials = useMemo(() => {
    // Front face material
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      metalness: 0.2,
      roughness: 0.4,
    });
    
    // Back face material
    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      metalness: 0.2,
      roughness: 0.4,
    });
    
    // Edge material (for the thin sides of the card)
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      metalness: 0.3,
      roughness: 0.6,
    });
    
    // Apply effects to materials based on activeEffects
    if (activeEffects.includes('Holographic')) {
      const intensity = effectIntensities['Holographic'] || 1;
      frontMaterial.metalness = 0.8 * intensity;
      frontMaterial.roughness = 0.2 * (1 - intensity * 0.5);
      frontMaterial.envMapIntensity = 1.5 * intensity;
      frontMaterial.iridescence = 1.0 * intensity;
      frontMaterial.iridescenceIOR = 1.3;
    }
    
    if (activeEffects.includes('Refractor')) {
      const intensity = effectIntensities['Refractor'] || 1;
      frontMaterial.metalness = 0.7 * intensity;
      frontMaterial.roughness = 0.3 * (1 - intensity * 0.5);
      frontMaterial.clearcoat = 1.0 * intensity;
      frontMaterial.clearcoatRoughness = 0.1;
    }
    
    if (activeEffects.includes('Chrome')) {
      const intensity = effectIntensities['Chrome'] || 1;
      frontMaterial.metalness = 0.9 * intensity;
      frontMaterial.roughness = 0.1 * (1 - intensity * 0.7);
      frontMaterial.envMapIntensity = 2.0 * intensity;
    }
    
    return { frontMaterial, backMaterial, edgeMaterial };
  }, [frontTexture, backTexture, activeEffects, effectIntensities]);
  
  // Handle animations
  useFrame((state, delta) => {
    if (!cardRef.current) return;
    
    // Flip animation
    const targetRotationY = isFlipped ? Math.PI : 0;
    
    // Smooth animation
    cardRef.current.rotation.y += (targetRotationY - cardRef.current.rotation.y) * 0.1;
    
    // Add subtle floating animation if not flipped
    if (!isFlipped) {
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
      cardRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  // Progressive enhancement: enable higher quality rendering on desktop
  useEffect(() => {
    // Check if we're on a powerful device
    const isHighPerformance = gl.capabilities.maxAnisotropy > 8;
    
    if (isHighPerformance) {
      // Enable higher quality settings
      gl.setPixelRatio(window.devicePixelRatio);
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      
      // Apply higher quality to materials
      materials.frontMaterial.anisotropy = 16;
      materials.backMaterial.anisotropy = 16;
    } else {
      // Lower quality for mobile/low-end devices
      gl.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
      gl.shadowMap.type = THREE.BasicShadowMap;
    }
  }, [gl, materials]);

  return (
    <group ref={cardRef}>
      {/* Card body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
        <meshStandardMaterial
          map={frontTexture}
          attachArray="material"
          metalness={0.2}
          roughness={0.4}
        />
        <meshStandardMaterial
          map={backTexture}
          attachArray="material"
          metalness={0.2}
          roughness={0.4}
        />
        {/* Edge materials for remaining 4 sides */}
        <meshStandardMaterial
          color={0xf0f0f0}
          attachArray="material"
          metalness={0.3}
          roughness={0.6}
        />
        <meshStandardMaterial
          color={0xf0f0f0}
          attachArray="material"
          metalness={0.3}
          roughness={0.6}
        />
        <meshStandardMaterial
          color={0xf0f0f0}
          attachArray="material"
          metalness={0.3}
          roughness={0.6}
        />
        <meshStandardMaterial
          color={0xf0f0f0}
          attachArray="material"
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>
      
      {/* Add special effect overlays based on active effects */}
      {activeEffects.includes('Holographic') && (
        <mesh position={[0, 0, cardThickness/2 + 0.001]}>
          <planeGeometry args={[cardWidth - 0.05, cardHeight - 0.05]} />
          <meshPhysicalMaterial 
            transparent
            opacity={0.2 * (effectIntensities['Holographic'] || 1)}
            iridescence={0.9}
            iridescenceIOR={1.5}
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        </mesh>
      )}
    </group>
  );
};
