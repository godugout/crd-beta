
import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Card } from '@/lib/types';

interface CardModelProps {
  imageUrl: string;
  backImageUrl?: string;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
  qualityLevel?: 'high' | 'medium' | 'low';
}

const CardModel: React.FC<CardModelProps> = ({
  imageUrl,
  backImageUrl = '/card-back-texture.jpg',
  isFlipped,
  activeEffects = [],
  effectIntensities = {},
  qualityLevel = 'medium'
}) => {
  const cardRef = useRef<THREE.Group>(null);
  const [textureError, setTextureError] = useState(false);
  const [frontTextureLoaded, setFrontTextureLoaded] = useState(false);
  const [backTextureLoaded, setBackTextureLoaded] = useState(false);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  // Default fallback textures
  const fallbackFrontTexture = new THREE.Color('#2a5298');
  const fallbackBackTexture = new THREE.Color('#1a3060');
  
  // Load textures with optimized settings based on quality level
  const textureOptions = {
    anisotropy: qualityLevel === 'high' ? 16 : qualityLevel === 'medium' ? 4 : 1,
    minFilter: qualityLevel === 'low' ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter
  };
  
  // Load textures with error handling
  const frontTexture = useTexture(
    imageUrl, 
    (texture) => {
      texture.anisotropy = textureOptions.anisotropy;
      texture.minFilter = textureOptions.minFilter;
      texture.magFilter = textureOptions.magFilter;
      texture.needsUpdate = true;
      
      // Apply power-of-two optimization for better GPU performance
      if (qualityLevel !== 'high' && (!isPowerOf2(texture.image.width) || !isPowerOf2(texture.image.height))) {
        resizeTextureToPowerOfTwo(texture);
      }
      
      setFrontTextureLoaded(true);
    }
  );
  
  // Use try-catch for back texture since it's optional and might fail
  let backTexture;
  try {
    backTexture = useTexture(
      backImageUrl, 
      (texture) => {
        texture.anisotropy = textureOptions.anisotropy;
        texture.minFilter = textureOptions.minFilter;
        texture.magFilter = textureOptions.magFilter;
        texture.needsUpdate = true;
        
        // Apply power-of-two optimization
        if (qualityLevel !== 'high' && (!isPowerOf2(texture.image.width) || !isPowerOf2(texture.image.height))) {
          resizeTextureToPowerOfTwo(texture);
        }
        
        setBackTextureLoaded(true);
      }
    );
  } catch (error) {
    console.warn('Back texture could not be loaded, using fallback');
  }
  
  // Helper function to check if number is power of two
  function isPowerOf2(value: number): boolean {
    return (value & (value - 1)) === 0 && value !== 0;
  }
  
  // Helper function to resize texture to power of two
  function resizeTextureToPowerOfTwo(texture: THREE.Texture): void {
    if (!texture.image) return;
    
    const canvas = document.createElement('canvas');
    const width = nextPowerOf2(texture.image.width);
    const height = nextPowerOf2(texture.image.height);
    
    canvas.width = width;
    canvas.height = height;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(texture.image, 0, 0, width, height);
      texture.image = canvas;
      texture.needsUpdate = true;
    }
  }
  
  // Helper function to get next power of two
  function nextPowerOf2(n: number): number {
    return Math.pow(2, Math.ceil(Math.log2(n)));
  }

  // Create materials with optimized properties based on quality level
  const frontMaterial = new THREE.MeshPhysicalMaterial({
    map: frontTextureLoaded ? frontTexture : null,
    color: frontTextureLoaded ? undefined : fallbackFrontTexture,
    metalness: 0.1,
    roughness: 0.7,
    clearcoat: qualityLevel === 'low' ? 0.2 : 0.3,
    clearcoatRoughness: qualityLevel === 'low' ? 0.9 : 0.8,
    envMapIntensity: qualityLevel === 'low' ? 0.3 : 0.5,
    flatShading: qualityLevel === 'low',
    // Optimize material by disabling unnecessary features in low quality mode
    ...((qualityLevel === 'low') && {
      defines: {
        STANDARD: '',
        PHYSICAL: ''
      },
      dithering: false
    })
  });
  
  const backMaterial = new THREE.MeshPhysicalMaterial({
    map: backTextureLoaded ? backTexture : null,
    color: backTextureLoaded ? undefined : fallbackBackTexture,
    metalness: 0.1,
    roughness: 0.7,
    clearcoat: qualityLevel === 'low' ? 0.2 : 0.3,
    clearcoatRoughness: qualityLevel === 'low' ? 0.9 : 0.8,
    envMapIntensity: qualityLevel === 'low' ? 0.3 : 0.5,
    flatShading: qualityLevel === 'low',
    // Optimize material by disabling unnecessary features in low quality mode
    ...((qualityLevel === 'low') && {
      defines: {
        STANDARD: '',
        PHYSICAL: ''
      },
      dithering: false
    })
  });

  // Get intensity value for a specific effect
  const getEffectIntensity = (effectName: string): number => {
    return effectIntensities[effectName] || 1.0;
  };

  // If there's a texture error, show an error cube
  if (textureError) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  // Use optimized geometry for performance
  const geometryDetail = qualityLevel === 'high' ? 4 : qualityLevel === 'medium' ? 2 : 1;

  return (
    <group ref={cardRef} position={[0, 0, 0]}>
      {/* Front face - optimize for performance with simplified meshes in lower quality modes */}
      <mesh castShadow={qualityLevel !== 'low'} receiveShadow={qualityLevel !== 'low'}>
        <planeGeometry args={[2.5, 3.5, geometryDetail, geometryDetail]} />
        <primitive object={frontMaterial} attach="material" />
      </mesh>
      
      {/* Back face */}
      <mesh 
        position={[0, 0, -0.01]} 
        rotation={[0, Math.PI, 0]} 
        castShadow={qualityLevel !== 'low'} 
        receiveShadow={qualityLevel !== 'low'}
      >
        <planeGeometry args={[2.5, 3.5, geometryDetail, geometryDetail]} />
        <primitive object={backMaterial} attach="material" />
      </mesh>

      {/* Card edges only in medium/high quality mode */}
      {qualityLevel !== 'low' && (
        <mesh position={[0, 0, -0.005]} scale={[1.01, 1.01, 1]}>
          <boxGeometry args={[2.5, 3.5, 0.01]} />
          <meshStandardMaterial 
            color="#9b87f5" 
            metalness={0.6}
            roughness={0.3}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};

export default CardModel;
