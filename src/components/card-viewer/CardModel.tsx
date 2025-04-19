
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import ShimmerEffect from '../card-effects/effects/ShimmerEffect';
import HolographicEffect from '../card-effects/effects/HolographicEffect';
import RefractorEffect from '../card-effects/effects/RefractorEffect';
import VintageEffect from '../card-effects/effects/VintageEffect';

interface CardModelProps {
  imageUrl: string;
  backImageUrl: string;
  isFlipped: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
}

const CardModel: React.FC<CardModelProps> = ({
  imageUrl,
  backImageUrl,
  isFlipped,
  activeEffects = [],
  effectIntensities = {}
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frontTexture = useTexture(imageUrl);
  const backTexture = useTexture(backImageUrl);

  // Calculate card dimensions (standard trading card ratio)
  const width = 2.5;
  const height = 3.5;
  const thickness = 0.05;
  
  // Update rotation based on flipped state
  useFrame(() => {
    if (!meshRef.current) return;
    
    const targetRotationY = isFlipped ? Math.PI : 0;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotationY,
      0.1
    );
  });
  
  useEffect(() => {
    console.log("Card model received effects:", activeEffects);
  }, [activeEffects]);

  // Log when textures are loaded
  useEffect(() => {
    if (frontTexture && backTexture) {
      console.log("Textures loaded successfully");
    }
  }, [frontTexture, backTexture]);

  // Prepare materials for each side of the card
  const materials = [
    // Right side
    new THREE.MeshStandardMaterial({ color: 'white', map: frontTexture }),
    // Left side
    new THREE.MeshStandardMaterial({ color: 'white', map: frontTexture }),
    // Top side
    new THREE.MeshStandardMaterial({ color: 'white' }),
    // Bottom side
    new THREE.MeshStandardMaterial({ color: 'white' }),
    // Front side (showing back texture when flipped)
    new THREE.MeshStandardMaterial({ color: 'white', map: backTexture }),
    // Back side (showing front texture when not flipped)
    new THREE.MeshStandardMaterial({ color: 'white', map: backTexture })
  ];

  return (
    <group>
      {/* Main card mesh */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[width, height, thickness]} />
        <primitive object={materials[0]} attach="material-0" />
        <primitive object={materials[1]} attach="material-1" />
        <primitive object={materials[2]} attach="material-2" />
        <primitive object={materials[3]} attach="material-3" />
        <primitive object={materials[4]} attach="material-4" />
        <primitive object={materials[5]} attach="material-5" />
      </mesh>
      
      {/* Apply effects as separate layers */}
      {activeEffects.includes('Shimmer') && (
        <ShimmerEffect 
          isActive={true} 
          intensity={effectIntensities['Shimmer'] || 0.7}
        />
      )}
      
      {activeEffects.includes('Holographic') && (
        <HolographicEffect 
          isActive={true} 
          intensity={effectIntensities['Holographic'] || 0.7}
        />
      )}
      
      {activeEffects.includes('Refractor') && (
        <RefractorEffect 
          isActive={true} 
          intensity={effectIntensities['Refractor'] || 0.7}
        />
      )}
      
      {activeEffects.includes('Vintage') && (
        <VintageEffect 
          isActive={true} 
          intensity={effectIntensities['Vintage'] || 0.7}
          cardTexture={frontTexture}
        />
      )}
    </group>
  );
};

export default CardModel;
