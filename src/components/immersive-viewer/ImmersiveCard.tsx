import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Card } from '@/lib/types';

interface ImmersiveCardProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  materialSettings: any;
  lightingSettings: any;
  onFlip?: () => void;
}

const ImmersiveCard: React.FC<ImmersiveCardProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities,
  materialSettings,
  lightingSettings,
  onFlip
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { raycaster, camera } = useThree();
  const lastClickTime = useRef(0);

  // Load textures with correct orientation
  const frontTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(card.imageUrl || '/images/card-placeholder.jpg');
    texture.flipY = true;
    return texture;
  }, [card.imageUrl]);

  const backTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/lovable-uploads/f1b608ba-b8c6-40f5-b552-a5d7addbf4ae.png');
    texture.flipY = true;
    return texture;
  }, []);

  // Create materials based on active effects and settings
  const frontMaterial = useMemo(() => {
    // Get environment intensity from lighting settings
    const envMapIntensity = lightingSettings?.envMapIntensity || 1.0;
    
    const baseSettings = {
      map: frontTexture,
      roughness: materialSettings?.roughness || 0.2,
      metalness: materialSettings?.metalness || 0.8,
      envMapIntensity: envMapIntensity,
      ...materialSettings
    };

    // Apply effect-specific material properties
    if (activeEffects.includes('holographic')) {
      const intensity = effectIntensities.holographic || 0.7;
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        metalness: 0.9 * intensity,
        roughness: 0.1 * (1 - intensity * 0.8),
        envMapIntensity: envMapIntensity * 2.0 * intensity,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        iridescence: 1.0 * intensity,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 800],
      });
    }

    if (activeEffects.includes('refractor')) {
      const intensity = effectIntensities.refractor || 0.5;
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        transmission: 0.1 * intensity,
        thickness: 0.5,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        envMapIntensity: envMapIntensity,
      });
    }

    if (activeEffects.includes('chrome')) {
      const intensity = effectIntensities.chrome || 0.4;
      return new THREE.MeshPhysicalMaterial({
        ...baseSettings,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: envMapIntensity * 3.0 * intensity,
        clearcoat: 1.0,
      });
    }

    if (activeEffects.includes('vintage')) {
      return new THREE.MeshStandardMaterial({
        map: frontTexture,
        roughness: 0.8,
        metalness: 0.1,
        envMapIntensity: envMapIntensity * 0.3,
      });
    }

    return new THREE.MeshPhysicalMaterial(baseSettings);
  }, [frontTexture, activeEffects, effectIntensities, materialSettings, lightingSettings]);

  const backMaterial = useMemo(() => {
    const envMapIntensity = lightingSettings?.envMapIntensity || 1.0;
    
    // Enhanced material with darker background and glowing characters
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.1, // Very smooth for reflectivity
      metalness: 0.1, // Low metalness so texture remains visible
      envMapIntensity: envMapIntensity * 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.9,
      // Strong glow for character visibility with darker background
      emissive: new THREE.Color(0.05, 0.05, 0.08), // Very subtle blue-tinted glow
      emissiveIntensity: 0.8, // Strong emission for characters
      // Darker background adjustment
      color: new THREE.Color(0.7, 0.7, 0.7), // Darken the overall texture
      toneMapped: false, // Prevent tone mapping from affecting glow
    });
  }, [backTexture, lightingSettings]);

  // Handle double-click to flip
  const handleCardClick = (event: any) => {
    if (!onFlip) return;

    event.stopPropagation();
    
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime.current;
    
    // Double-click detection (within 300ms)
    if (timeDiff < 300) {
      onFlip();
    }
    
    lastClickTime.current = currentTime;
  };

  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Handle card flipping
    const targetRotationY = isFlipped ? Math.PI : 0;
    if (Math.abs(groupRef.current.rotation.y - targetRotationY) > 0.01) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1;
    }

    // Auto-rotate if enabled
    if (lightingSettings?.autoRotate) {
      groupRef.current.rotation.y += delta * 0.5;
    }

    // Follow pointer if enabled
    if (lightingSettings?.followPointer) {
      const mouse = state.mouse;
      groupRef.current.rotation.x = mouse.y * 0.1;
      groupRef.current.rotation.z = mouse.x * 0.05;
    }

    // Gentle floating animation
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* Front of card */}
      <mesh 
        ref={meshRef} 
        castShadow 
        receiveShadow
        onClick={handleCardClick}
      >
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={frontMaterial} />
      </mesh>
      
      {/* Back of card with enhanced dark background and glowing figures */}
      <mesh 
        position={[0, 0, -0.01]} 
        rotation={[0, Math.PI, 0]} 
        castShadow 
        receiveShadow
        onClick={handleCardClick}
      >
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} />
      </mesh>
    </group>
  );
};

export default ImmersiveCard;
