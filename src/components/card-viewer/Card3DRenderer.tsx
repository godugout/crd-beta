
import React, { useRef, useEffect, useState } from 'react';
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
  const cardRef = useRef<THREE.Group>(null);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);
  const [textureLoading, setTextureLoading] = useState(true);
  const [textureError, setTextureError] = useState(false);
  
  // Load textures on component mount
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    setTextureLoading(true);
    setTextureError(false);
    
    // Load front texture
    textureLoader.load(
      card.imageUrl || '/placeholder-card.png',
      (texture) => {
        console.log("Front texture loaded successfully");
        setFrontTexture(texture);
        setTextureLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading front texture:', error);
        setTextureError(true);
        setTextureLoading(false);
      }
    );
    
    // Load back texture
    textureLoader.load(
      '/card-back-texture.jpg',
      (texture) => {
        console.log("Back texture loaded successfully");
        setBackTexture(texture);
      },
      undefined,
      (error) => {
        console.error('Error loading back texture:', error);
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
    
    // Apply holographic dynamic effects if active
    if (activeEffects.includes('Holographic')) {
      const holographicLayer = cardRef.current.children.find(
        child => child.userData.effectType === 'holographic'
      ) as THREE.Mesh | undefined;
      
      if (holographicLayer) {
        // Modify holographic effect based on time and card position
        const material = holographicLayer.material as THREE.MeshPhysicalMaterial;
        material.opacity = 0.2 + Math.sin(t * 2) * 0.1;
        material.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.2;
        
        // Shift hue based on viewing angle
        const hueShift = (Math.sin(t * 0.5) * 0.1 + 0.5) * 360;
        const color = new THREE.Color();
        color.setHSL(hueShift / 360, 0.8, 0.6);
        material.color = color;
      }
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

  // Show loading state while textures load
  if (textureLoading) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3.5, 0.1]} />
        <meshStandardMaterial color="#2a5298" wireframe />
      </mesh>
    );
  }

  // Get effect intensity value for a specific effect
  const getEffectIntensity = (effectName: string) => {
    return effectIntensities[effectName] || 1.0;
  };

  return (
    <group ref={cardRef}>
      {/* Card front */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
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
        <mesh position={[0, 0, 0.01]} userData={{ effectType: 'holographic' }}>
          <planeGeometry args={[2.4, 3.4, 30, 30]} />
          <meshPhysicalMaterial 
            transparent
            opacity={0.2 * getEffectIntensity('Holographic')}
            metalness={0.9}
            roughness={0.1}
            color="#ffffff"
            side={THREE.FrontSide}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            emissive={new THREE.Color(0x88ccff)}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
      
      {activeEffects.includes('Refractor') && (
        <mesh position={[0, 0, 0.015]} userData={{ effectType: 'refractor' }}>
          <planeGeometry args={[2.3, 3.3, 20, 20]} />
          <meshPhysicalMaterial 
            transparent
            opacity={0.15 * getEffectIntensity('Refractor')}
            color="#88ccff"
            metalness={0.8}
            roughness={0.2}
            side={THREE.FrontSide}
            envMapIntensity={1.8}
            transmission={0.5}
          />
        </mesh>
      )}

      {activeEffects.includes('Chrome') && (
        <mesh position={[0, 0, 0.02]} userData={{ effectType: 'chrome' }}>
          <planeGeometry args={[2.45, 3.45, 20, 20]} />
          <meshPhysicalMaterial 
            transparent
            opacity={0.3 * getEffectIntensity('Chrome')}
            color="#ffffff"
            metalness={1}
            roughness={0.05}
            clearcoat={1}
            side={THREE.FrontSide}
            envMapIntensity={3}
          />
        </mesh>
      )}
      
      {activeEffects.includes('Gold Foil') && (
        <mesh position={[0, 0, 0.025]} userData={{ effectType: 'goldfoil' }}>
          <planeGeometry args={[2.35, 3.35, 20, 20]} />
          <meshPhysicalMaterial 
            transparent
            opacity={0.4 * getEffectIntensity('Gold Foil')}
            color="#ffd700"
            metalness={1}
            roughness={0.2}
            reflectivity={1}
            side={THREE.FrontSide}
            envMapIntensity={2}
          />
        </mesh>
      )}
    </group>
  );
};

export default Card3DRenderer;
