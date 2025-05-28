
import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, CanvasTexture } from 'three';
import { Card } from '@/lib/types';
import * as THREE from 'three';

interface Card3DModelProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
}

// Create card back texture
const createCardBackTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 712;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 512, 712);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 712);
    
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 472, 672);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CRD', 256, 340);
    ctx.font = '18px Arial';
    ctx.fillText('Trading Card', 256, 370);
  }
  
  return new CanvasTexture(canvas);
};

export const Card3DModel: React.FC<Card3DModelProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const frontTexture = useLoader(TextureLoader, card.imageUrl || '/placeholder-card.png');
  const backTexture = useMemo(() => createCardBackTexture(), []);
  
  // Create materials based on effects
  const frontMaterial = useMemo(() => {
    const baseConfig = {
      map: frontTexture,
      side: THREE.DoubleSide,
    };

    if (activeEffects.includes('holographic')) {
      const intensity = effectIntensities.holographic || 0.7;
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        metalness: 0.9 * intensity,
        roughness: 0.1 * (1 - intensity * 0.8),
        envMapIntensity: 2.0 * intensity,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        iridescence: 1.0 * intensity,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 800],
      });
    }
    
    if (activeEffects.includes('chrome')) {
      const intensity = effectIntensities.chrome || 0.6;
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: 3.0 * intensity,
        clearcoat: 1.0,
      });
    }
    
    if (activeEffects.includes('foil')) {
      const intensity = effectIntensities.foil || 0.6;
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        metalness: 0.8 * intensity,
        roughness: 0.3 * (1 - intensity),
        envMapIntensity: 2.0 * intensity,
        clearcoat: 0.8,
      });
    }
    
    if (activeEffects.includes('refractor')) {
      const intensity = effectIntensities.refractor || 0.4;
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        metalness: 0.3,
        roughness: 0.1,
        envMapIntensity: 1.8 * intensity,
        transmission: 0.1 * intensity,
        thickness: 0.5,
        ior: 1.5,
        clearcoat: 1.0,
      });
    }
    
    if (activeEffects.includes('prismatic')) {
      const intensity = effectIntensities.prismatic || 0.8;
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        metalness: 0.7 * intensity,
        roughness: 0.2,
        envMapIntensity: 2.5 * intensity,
        iridescence: 0.8 * intensity,
        iridescenceIOR: 1.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      });
    }
    
    return new THREE.MeshPhysicalMaterial({
      ...baseConfig,
      roughness: 0.3,
      metalness: 0.1,
      envMapIntensity: 1.0,
    });
  }, [frontTexture, activeEffects, effectIntensities]);

  const backMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.4,
      metalness: 0.2,
      envMapIntensity: 0.8,
      side: THREE.DoubleSide,
    });
  }, [backTexture]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const targetRotationY = isFlipped ? Math.PI : 0;
    if (Math.abs(groupRef.current.rotation.y - targetRotationY) > 0.01) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1;
    }
    
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.02;
    groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.005;
    
    // Effect-based animations
    if (activeEffects.includes('holographic')) {
      const shimmer = Math.sin(time * 4) * 0.1 + 0.9;
      frontMaterial.envMapIntensity = 2.0 * (effectIntensities.holographic || 0.7) * shimmer;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Card Front */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5, 32, 32]} />
        <primitive object={frontMaterial} />
      </mesh>
      
      {/* Card Back */}
      <mesh position={[0, 0, -0.02]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} />
      </mesh>
      
      {/* Card Edges */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[2.5, 3.5, 0.02]} />
        <meshPhysicalMaterial 
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};
