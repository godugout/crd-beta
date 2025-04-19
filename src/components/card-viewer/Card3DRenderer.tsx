
import React, { useRef, useEffect } from 'react';
import { Card } from '@/lib/types';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface Card3DRendererProps {
  card: Card;
  className?: string;
  isFlipped?: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
}

const Card3DRenderer: React.FC<Card3DRendererProps> = ({ 
  card, 
  isFlipped = false,
  activeEffects = [],
  effectIntensities = {}
}) => {
  const cardRef = useRef<THREE.Mesh>(null);
  const [frontTexture, setFrontTexture] = React.useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = React.useState<THREE.Texture | null>(null);
  const [textureError, setTextureError] = React.useState(false);
  
  // Load textures on component mount
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    
    // Load front texture
    textureLoader.load(
      card.imageUrl || '/placeholder-card.png',
      (texture) => {
        setFrontTexture(texture);
      },
      undefined,
      (error) => {
        console.error('Error loading front texture:', error);
        setTextureError(true);
      }
    );
    
    // Load back texture
    textureLoader.load(
      '/card-back-texture.jpg',
      (texture) => {
        setBackTexture(texture);
      },
      undefined,
      (error) => {
        console.error('Error loading back texture:', error);
        setTextureError(true);
      }
    );
    
    return () => {
      // Cleanup textures
      if (frontTexture) frontTexture.dispose();
      if (backTexture) backTexture.dispose();
    };
  }, [card.imageUrl]);

  // Animation effect for card
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
    <group>
      {/* Card front */}
      <mesh ref={cardRef} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5, 20, 20]} />
        <meshPhysicalMaterial 
          map={frontTexture} 
          color={frontTexture ? undefined : "#2a5298"}
          side={THREE.FrontSide}
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.2}
          reflectivity={0.8}
        />
      </mesh>
      
      {/* Card back */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5, 20, 20]} />
        <meshPhysicalMaterial 
          map={backTexture} 
          color={backTexture ? undefined : "#1a3060"}
          side={THREE.FrontSide}
          roughness={0.24}
          metalness={0.64}
          envMapIntensity={1.2}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
        />
      </mesh>
      
      {/* Apply special effects based on activeEffects */}
      {activeEffects.includes('Holographic') && (
        <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0]}>
          <planeGeometry args={[2.5, 3.5, 20, 20]} />
          <meshPhysicalMaterial 
            transparent
            opacity={0.2}
            metalness={0.9}
            roughness={0.1}
            color="#ffffff"
            side={THREE.FrontSide}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
          />
        </mesh>
      )}
      
      {activeEffects.includes('Refractor') && (
        <mesh position={[0, 0, 0.02]} rotation={[0, 0, 0]}>
          <planeGeometry args={[2.4, 3.4, 20, 20]} />
          <meshPhysicalMaterial 
            transparent
            opacity={0.15}
            color="#88ccff"
            metalness={0.8}
            roughness={0.2}
            side={THREE.FrontSide}
            envMapIntensity={1.8}
          />
        </mesh>
      )}
    </group>
  );
};

export default Card3DRenderer;
