
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import ShimmerEffect from '../card-effects/effects/ShimmerEffect';
import HolographicEffect from '../card-effects/effects/HolographicEffect';
import RefractorEffect from '../card-effects/effects/RefractorEffect';
import VintageEffect from '../card-effects/effects/VintageEffect';

// Fallback textures if the main ones fail to load
const FALLBACK_FRONT_TEXTURE = '/images/card-placeholder.png';
const FALLBACK_BACK_TEXTURE = '/images/card-back-placeholder.png';

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
  const [frontTextureLoaded, setFrontTextureLoaded] = useState(false);
  const [backTextureLoaded, setBackTextureLoaded] = useState(false);
  
  // Use proper error handlers for texture loading
  const frontTexture = useTexture(imageUrl, undefined);
  const backTexture = useTexture(backImageUrl, undefined);

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
    console.log("Card textures:", { front: imageUrl, back: backImageUrl });
  }, [activeEffects, imageUrl, backImageUrl]);

  // Create materials for each side of the card
  const frontMaterial = new THREE.MeshStandardMaterial({ 
    color: 'white', 
    map: frontTexture 
  });
  
  const backMaterial = new THREE.MeshStandardMaterial({ 
    color: 'white',
    map: backTexture 
  });
  
  const edgeMaterial = new THREE.MeshStandardMaterial({ 
    color: 'white'
  });

  return (
    <group>
      {/* Main card mesh */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[width, height, thickness]} />
        <primitive object={frontMaterial} attach="material-0" />
        <primitive object={frontMaterial} attach="material-1" />
        <primitive object={edgeMaterial} attach="material-2" />
        <primitive object={edgeMaterial} attach="material-3" />
        <primitive object={backMaterial} attach="material-4" />
        <primitive object={backMaterial} attach="material-5" />
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
