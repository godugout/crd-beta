
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import HolographicEffect from '../card-effects/effects/HolographicEffect';
import ShimmerEffect from '../card-effects/effects/ShimmerEffect';
import RefractorEffect from '../card-effects/effects/RefractorEffect';
import VintageEffect from '../card-effects/effects/VintageEffect';

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
  
  // Load textures using drei's useTexture
  const frontTexture = useTexture(
    imageUrl, 
    (texture) => {
      console.log('Front texture loaded successfully');
    },
    (error) => {
      console.error('Front texture failed to load:', error);
      setTextureError(true);
    }
  );
  
  const backTexture = useTexture(
    backImageUrl,
    (texture) => {
      console.log('Back texture loaded successfully');
    },
    (error) => {
      console.error('Back texture failed to load:', error);
    }
  );

  // Create materials with proper matte finish
  const frontMaterial = new THREE.MeshPhysicalMaterial({
    map: frontTexture,
    color: frontTexture ? undefined : new THREE.Color('#2a5298'),
    metalness: 0.1,      // Lower metalness for matte look
    roughness: 0.7,      // Higher roughness for matte finish
    clearcoat: 0.3,      // Subtle clearcoat for print finish
    clearcoatRoughness: 0.8,  // High roughness in clearcoat
    envMapIntensity: 0.5     // Subtle environment reflections
  });
  
  const backMaterial = new THREE.MeshPhysicalMaterial({
    map: backTexture,
    color: backTexture ? undefined : new THREE.Color('#1a3060'),
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

  // Animate card flipping and subtle floating
  useFrame((state) => {
    if (!cardRef.current) return;
    
    const targetRotation = isFlipped ? Math.PI : 0;
    cardRef.current.rotation.y = THREE.MathUtils.lerp(
      cardRef.current.rotation.y,
      targetRotation,
      0.1
    );

    // Subtle floating animation
    const t = state.clock.getElapsedTime();
    cardRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    cardRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
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
        <planeGeometry args={[2.5, 3.5, 32, 32]} />
        <primitive object={frontMaterial} attach="material" />
      </mesh>
      
      {/* Back face */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5, 32, 32]} />
        <primitive object={backMaterial} attach="material" />
      </mesh>
      
      {/* Apply special effects layers */}
      {activeEffects.includes('Holographic') && (
        <HolographicEffect 
          isActive={true} 
          intensity={getEffectIntensity('Holographic')} 
        />
      )}
      
      {activeEffects.includes('Shimmer') && (
        <ShimmerEffect 
          isActive={true} 
          intensity={getEffectIntensity('Shimmer')} 
        />
      )}
      
      {activeEffects.includes('Refractor') && (
        <RefractorEffect 
          isActive={true} 
          intensity={getEffectIntensity('Refractor')} 
        />
      )}
      
      {activeEffects.includes('Vintage') && (
        <VintageEffect 
          isActive={true} 
          intensity={getEffectIntensity('Vintage')}
          cardTexture={frontTexture}
        />
      )}
    </group>
  );
};

export default CardModel;
