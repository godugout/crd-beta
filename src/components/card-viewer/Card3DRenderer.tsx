
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/lib/types';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

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
      cardRef.current.children.forEach(child => {
        if (child.userData.effectType === 'holographic' && child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshPhysicalMaterial) {
            // Get intensity from props or default
            const intensity = effectIntensities['Holographic'] || 1.0;
            
            // Modify holographic effect based on time and card position
            // Make color shift depending on viewing angle (rotation of card)
            const viewAngle = Math.abs(cardRef.current!.rotation.y % (Math.PI * 2)) / (Math.PI * 2);
            const hueShift = (viewAngle + Math.sin(t * 1.5) * 0.2) % 1.0;
            
            const color = new THREE.Color();
            color.setHSL(hueShift, 0.8, 0.6);
            
            // Apply dynamic effects
            child.material.color = color;
            child.material.emissive = color.clone().multiplyScalar(0.4);
            child.material.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.1;
            child.material.opacity = 0.2 * intensity + Math.sin(t * 2) * 0.05;
            
            // Create wave effect on the geometry
            if (child.geometry instanceof THREE.PlaneGeometry) {
              const positions = child.geometry.attributes.position;
              
              for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                
                // Create wave pattern based on time
                const waveX = Math.sin(x * 5 + t * 2) * 0.01 * intensity;
                const waveY = Math.cos(y * 5 + t * 2) * 0.01 * intensity;
                
                // Only modify Z to create depth perception
                positions.setZ(i, waveX + waveY);
              }
              
              positions.needsUpdate = true;
            }
          }
        }
      });
    }
    
    // Apply refractor dynamic effects
    if (activeEffects.includes('Refractor')) {
      cardRef.current.children.forEach(child => {
        if (child.userData.effectType === 'refractor' && child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshPhysicalMaterial) {
            // Get intensity from props
            const intensity = effectIntensities['Refractor'] || 1.0;
            
            // Create subtle color shifts
            const hueBase = 0.6; // Blue-ish base
            const hueShift = ((Math.sin(t * 0.3) * 0.1) + hueBase) % 1.0;
            const color = new THREE.Color();
            color.setHSL(hueShift, 0.7, 0.6);
            
            child.material.color = color;
            child.material.opacity = 0.15 * intensity + Math.sin(t * 1.3) * 0.05;
            
            // Adjust transmission and roughness based on view angle
            const viewAngle = Math.abs(cardRef.current!.rotation.y % (Math.PI * 2)) / (Math.PI * 2);
            child.material.transmission = 0.4 + viewAngle * 0.3;
            child.material.roughness = 0.2 + viewAngle * 0.2;
          }
        }
      });
    }
    
    // Apply chrome dynamic effects
    if (activeEffects.includes('Chrome')) {
      cardRef.current.children.forEach(child => {
        if (child.userData.effectType === 'chrome' && child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshPhysicalMaterial) {
            const intensity = effectIntensities['Chrome'] || 1.0;
            
            // Make chrome appear more or less reflective based on viewing angle
            const viewAngle = Math.abs(cardRef.current!.rotation.y % (Math.PI * 2)) / (Math.PI * 2);
            child.material.roughness = 0.05 + viewAngle * 0.15;
            child.material.metalness = 0.9 + viewAngle * 0.1;
            child.material.clearcoatRoughness = 0.02 + viewAngle * 0.08;
          }
        }
      });
    }
    
    // Apply gold foil dynamic effects
    if (activeEffects.includes('Gold Foil')) {
      cardRef.current.children.forEach(child => {
        if (child.userData.effectType === 'goldfoil' && child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshPhysicalMaterial) {
            const intensity = effectIntensities['Gold Foil'] || 1.0;
            
            // Create subtle color variation to simulate real gold
            const baseHue = 0.12; // Gold base hue
            const hueVariation = Math.sin(t * 0.5) * 0.02;
            const color = new THREE.Color();
            color.setHSL(baseHue + hueVariation, 0.8, 0.6);
            
            child.material.color = color;
            
            // Adjust sheen based on viewing angle
            const viewAngle = Math.abs(cardRef.current!.rotation.y % (Math.PI * 2)) / (Math.PI * 2);
            if (child.material.reflectivity !== undefined) {
              child.material.reflectivity = 0.8 + viewAngle * 0.2;
            }
          }
        }
      });
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

  // If no environment type is specified, fallback to 'studio'
  const getEnvironmentPreset = (): "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse" => {
    const validPresets = ['apartment', 'city', 'dawn', 'forest', 'lobby', 'night', 'park', 'studio', 'sunset', 'warehouse'] as const;
    const defaultPreset = 'studio' as const;
    
    // Since environmentType is not in the Card type, we'll use a safe fallback
    const environmentType = (card as any).environmentType;
    const preset = validPresets.find(p => p === environmentType) || defaultPreset;
    return preset;
  };

  return (
    <group ref={cardRef}>
      <Environment 
        preset={getEnvironmentPreset()} 
        background={false} 
      />
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
