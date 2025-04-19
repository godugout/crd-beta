
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

interface CardModelProps {
  imageUrl: string;
  backImageUrl?: string;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
}

const CardModel: React.FC<CardModelProps> = ({
  imageUrl,
  backImageUrl = '/card-back-texture.jpg',
  isFlipped,
  activeEffects = [],
  effectIntensities = {}
}) => {
  const cardRef = useRef<THREE.Group>(null);
  const [textureError, setTextureError] = useState(false);
  const [frontTextureLoaded, setFrontTextureLoaded] = useState(false);
  const [backTextureLoaded, setBackTextureLoaded] = useState(false);
  
  // Default fallback textures
  const fallbackFrontTexture = new THREE.Color('#2a5298');
  const fallbackBackTexture = new THREE.Color('#1a3060');
  
  // Load textures with error handling
  const frontTexture = useTexture(
    imageUrl, 
    (texture) => {
      console.log('Front texture loaded successfully');
      setFrontTextureLoaded(true);
    },
    () => {
      console.error('Failed to load front texture:', imageUrl);
      setTextureError(true);
    }
  );
  
  // Use try-catch for back texture since it's optional and might fail
  let backTexture;
  try {
    backTexture = useTexture(
      backImageUrl, 
      (texture) => {
        console.log('Back texture loaded successfully');
        setBackTextureLoaded(true);
      },
      () => {
        console.error('Failed to load back texture:', backImageUrl);
        // Don't set textureError here, just use fallback
      }
    );
  } catch (error) {
    console.warn('Back texture could not be loaded, using fallback');
  }

  // Create materials with proper matte finish
  const frontMaterial = new THREE.MeshPhysicalMaterial({
    map: frontTextureLoaded ? frontTexture : null,
    color: frontTextureLoaded ? undefined : fallbackFrontTexture,
    metalness: 0.1,      // Lower metalness for matte look
    roughness: 0.7,      // Higher roughness for matte finish
    clearcoat: 0.3,      // Subtle clearcoat for print finish
    clearcoatRoughness: 0.8,  // High roughness in clearcoat
    envMapIntensity: 0.5     // Subtle environment reflections
  });
  
  const backMaterial = new THREE.MeshPhysicalMaterial({
    map: backTextureLoaded ? backTexture : null,
    color: backTextureLoaded ? undefined : fallbackBackTexture,
    metalness: 0.1,
    roughness: 0.7,
    clearcoat: 0.3,
    clearcoatRoughness: 0.8,
    envMapIntensity: 0.5
  });

  // Get intensity value for a specific effect
  const getEffectIntensity = (effectName: string): number => {
    return effectIntensities[effectName] || 1.0;
  };

  // More efficient animation with reduced updates
  useFrame((state) => {
    if (!cardRef.current) return;
    
    const targetRotation = isFlipped ? Math.PI : 0;
    cardRef.current.rotation.y = THREE.MathUtils.lerp(
      cardRef.current.rotation.y,
      targetRotation,
      0.1
    );

    // Reduced animation frequency
    if (state.clock.getElapsedTime() % 0.5 < 0.1) {
      const t = state.clock.getElapsedTime();
      cardRef.current.position.y = Math.sin(t * 0.3) * 0.05;
      cardRef.current.rotation.z = Math.sin(t * 0.2) * 0.01;
    }
  });

  // If there's a texture error, show an error cube
  if (textureError) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  return (
    <group ref={cardRef} position={[0, 0, 0]}>
      {/* Front face */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={frontMaterial} attach="material" />
      </mesh>
      
      {/* Back face */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} attach="material" />
      </mesh>
    </group>
  );
};

export default CardModel;
