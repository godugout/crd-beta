
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Card } from '@/lib/types';

interface ImmersiveCardProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  materialSettings: any;
  lightingSettings: any;
}

const ImmersiveCard: React.FC<ImmersiveCardProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities,
  materialSettings,
  lightingSettings
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Load textures with correct orientation
  const frontTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(card.imageUrl || '/images/card-placeholder.jpg');
    texture.flipY = true; // Changed to true to fix upside-down issue
    return texture;
  }, [card.imageUrl]);

  const backTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/lovable-uploads/f1b608ba-b8c6-40f5-b552-a5d7addbf4ae.png');
    texture.flipY = true; // Changed to true to fix upside-down issue
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
    
    // Create a highly reflective material for the back with the figures
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.05, // Very smooth for high reflectivity
      metalness: 0.95, // High metalness for reflective paint effect
      envMapIntensity: envMapIntensity * 2.5, // Enhanced environment reflections
      clearcoat: 1.0, // Full clearcoat for glossy finish
      clearcoatRoughness: 0.02, // Very smooth clearcoat
      reflectivity: 1.0, // Maximum reflectivity
      // Enhanced properties for the "reflective paint" effect
      color: new THREE.Color(0.1, 0.1, 0.1), // Slight tint to maintain black background
      emissive: new THREE.Color(0.02, 0.02, 0.02), // Very subtle emission for depth
    });
  }, [backTexture, lightingSettings]);

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
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={frontMaterial} />
      </mesh>
      
      {/* Back of card with reflective figures */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} />
      </mesh>
    </group>
  );
};

export default ImmersiveCard;
