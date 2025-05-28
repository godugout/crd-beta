
import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, CanvasTexture } from 'three';
import { Card } from '@/lib/types';
import * as THREE from 'three';

interface CardModelProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
}

// Create a simple card back texture programmatically
const createCardBackTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 712; // Card aspect ratio
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 512, 712);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 712);
    
    // Add some decorative elements
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 472, 672);
    
    // Add center logo/text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CRD', 256, 340);
    ctx.font = '16px Arial';
    ctx.fillText('Trading Card', 256, 370);
  }
  
  return new CanvasTexture(canvas);
};

export const CardModel: React.FC<CardModelProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load card front texture with error handling
  const frontTexture = useLoader(TextureLoader, card.imageUrl || '/placeholder-card.png');
  
  // Create card back texture programmatically instead of loading from file
  const backTexture = useMemo(() => createCardBackTexture(), []);
  
  // Create materials based on active effects
  const frontMaterial = useMemo(() => {
    const intensity = effectIntensities.holographic || 0.7;
    
    if (activeEffects.includes('holographic')) {
      return new THREE.MeshPhysicalMaterial({
        map: frontTexture,
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
    
    return new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      roughness: 0.2,
      metalness: 0.8,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
    });
  }, [frontTexture, activeEffects, effectIntensities]);

  const backMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.3,
      metalness: 0.7,
      envMapIntensity: 1.2,
    });
  }, [backTexture]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth rotation animation
    const targetRotationY = isFlipped ? Math.PI : 0;
    if (groupRef.current.rotation.y !== targetRotationY) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.1;
    }
    
    // Subtle floating animation
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.01;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Card Front */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={frontMaterial} />
      </mesh>
      
      {/* Card Back */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} />
      </mesh>
    </group>
  );
};

export default CardModel;
