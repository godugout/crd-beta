import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import ShimmerEffect from '../card-effects/effects/ShimmerEffect';
import HolographicEffect from '../card-effects/effects/HolographicEffect';
import RefractorEffect from '../card-effects/effects/RefractorEffect';
import VintageEffect from '../card-effects/effects/VintageEffect';
import { FALLBACK_FRONT_IMAGE_URL, FALLBACK_BACK_IMAGE_URL, handleImageLoadError } from '@/lib/utils/cardDefaults';

interface CardModelProps {
  imageUrl: string;
  backImageUrl: string;
  isFlipped: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
}

const CardModel: React.FC<CardModelProps> = ({
  imageUrl = FALLBACK_FRONT_IMAGE_URL,
  backImageUrl = FALLBACK_BACK_IMAGE_URL,
  isFlipped,
  activeEffects = [],
  effectIntensities = {}
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [frontTextureLoaded, setFrontTextureLoaded] = useState(false);
  const [backTextureLoaded, setBackTextureLoaded] = useState(false);
  
  const frontTexture = useTexture(imageUrl || FALLBACK_FRONT_IMAGE_URL, () => {
    setFrontTextureLoaded(true);
    console.log("Front card texture loaded");
  });
  
  const backTexture = useTexture(backImageUrl || FALLBACK_FRONT_IMAGE_URL, () => {
    setBackTextureLoaded(true);
    console.log("Back card texture loaded");
  });

  useEffect(() => {
    const handleError = () => {
      console.error("Texture failed to load");
      setFrontTextureLoaded(false);
      setBackTextureLoaded(false);
    };

    // Handle texture loading errors by monitoring the image source
    const frontImg = new Image();
    frontImg.onerror = handleError;
    frontImg.src = imageUrl;

    const backImg = new Image();
    backImg.onerror = handleError;
    backImg.src = backImageUrl;

    return () => {
      frontImg.onerror = null;
      backImg.onerror = null;
    };
  }, [imageUrl, backImageUrl]);

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

  // Update material creation to include better defaults
  const frontMaterial = new THREE.MeshStandardMaterial({ 
    map: frontTexture,
    color: 'white',
    roughness: 0.3,
    metalness: 0.2,
  });
  
  const backMaterial = new THREE.MeshStandardMaterial({ 
    map: backTexture,
    color: 'white',
    roughness: 0.3,
    metalness: 0.2,
  });
  
  const edgeMaterial = new THREE.MeshStandardMaterial({ 
    color: 'white',
    roughness: 0.5,
    metalness: 0.1,
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
