import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import ShimmerEffect from '../card-effects/effects/ShimmerEffect';
import HolographicEffect from '../card-effects/effects/HolographicEffect';
import RefractorEffect from '../card-effects/effects/RefractorEffect';
import VintageEffect from '../card-effects/effects/VintageEffect';
import { FALLBACK_IMAGE_URL, FALLBACK_BACK_IMAGE_URL } from '@/lib/utils/cardDefaults';

interface CardModelProps {
  imageUrl: string;
  backImageUrl: string;
  isFlipped: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
}

const CardModel: React.FC<CardModelProps> = ({
  imageUrl = FALLBACK_IMAGE_URL,
  backImageUrl = FALLBACK_BACK_IMAGE_URL,
  isFlipped,
  activeEffects = [],
  effectIntensities = {}
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [frontTextureLoaded, setFrontTextureLoaded] = useState(false);
  const [backTextureLoaded, setBackTextureLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  // Ensure we always have valid texture URLs
  const safeImageUrl = imageUrl || FALLBACK_IMAGE_URL;
  const safeBackImageUrl = backImageUrl || FALLBACK_BACK_IMAGE_URL;
  
  // Try to load textures with error handling
  const frontTexture = useTexture(safeImageUrl, () => {
    setFrontTextureLoaded(true);
    console.log("Front card texture loaded:", safeImageUrl);
  });
  
  const backTexture = useTexture(safeBackImageUrl, () => {
    setBackTextureLoaded(true);
    console.log("Back card texture loaded:", safeBackImageUrl);
  });

  useEffect(() => {
    // Extra safety check for textures
    const checkTextureValidity = () => {
      if (!frontTextureLoaded || !backTextureLoaded) {
        console.warn("Textures not fully loaded, applying additional fallbacks");
        
        // Reset any problematic textures with new instances using guaranteed URLs
        if (!frontTextureLoaded && frontTexture) {
          console.log("Attempting to reload front texture with fallback");
          const newTexture = new THREE.TextureLoader().load(FALLBACK_IMAGE_URL);
          Object.assign(frontTexture, newTexture);
        }
        
        if (!backTextureLoaded && backTexture) {
          console.log("Attempting to reload back texture with fallback");
          const newTexture = new THREE.TextureLoader().load(FALLBACK_BACK_IMAGE_URL);
          Object.assign(backTexture, newTexture);
        }
      }
    };
    
    // Allow a short delay for normal loading before applying fallbacks
    const timer = setTimeout(checkTextureValidity, 3000);
    return () => clearTimeout(timer);
  }, [frontTextureLoaded, backTextureLoaded, frontTexture, backTexture]);

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
