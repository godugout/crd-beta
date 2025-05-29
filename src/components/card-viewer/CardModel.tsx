import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, CanvasTexture } from 'three';
import { Card } from '@/lib/types';
import * as THREE from 'three';

interface CardModelProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  materialSettings?: {
    roughness: number;
    metalness: number;
    reflectivity: number;
    clearcoat: number;
    envMapIntensity: number;
  };
}

// Enhanced card back texture with better design
const createCardBackTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 712;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create deep gradient background
    const gradient = ctx.createLinearGradient(0, 0, 512, 712);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(0.3, '#1a1a3a');
    gradient.addColorStop(0.7, '#2d2d5f');
    gradient.addColorStop(1, '#1a1a3a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 712);
    
    // Add geometric pattern
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 452, 652);
    
    // Add inner border
    ctx.strokeStyle = '#6ab7ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(50, 50, 412, 612);
    
    // Add center design
    ctx.fillStyle = '#4a90e2';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CRD', 256, 340);
    
    ctx.fillStyle = '#6ab7ff';
    ctx.font = '18px Arial';
    ctx.fillText('PREMIUM COLLECTION', 256, 370);
    
    // Add corner decorations
    const cornerSize = 40;
    ctx.fillStyle = '#4a90e2';
    // Top corners
    ctx.fillRect(30, 30, cornerSize, 3);
    ctx.fillRect(30, 30, 3, cornerSize);
    ctx.fillRect(482 - cornerSize, 30, cornerSize, 3);
    ctx.fillRect(479, 30, 3, cornerSize);
    // Bottom corners
    ctx.fillRect(30, 679, cornerSize, 3);
    ctx.fillRect(30, 652, 3, cornerSize);
    ctx.fillRect(482 - cornerSize, 679, cornerSize, 3);
    ctx.fillRect(479, 652, 3, cornerSize);
  }
  
  return new CanvasTexture(canvas);
};

// Galaxy effect texture generator
const createGalaxyTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Deep space background
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#1a0033');
    gradient.addColorStop(0.3, '#0d001a');
    gradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add nebula clouds
    ctx.globalCompositeOperation = 'screen';
    const nebulaGradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 150);
    nebulaGradient.addColorStop(0, 'rgba(138, 43, 226, 0.3)');
    nebulaGradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.2)');
    nebulaGradient.addColorStop(1, 'rgba(25, 25, 112, 0.1)');
    
    ctx.fillStyle = nebulaGradient;
    ctx.fillRect(0, 0, 512, 512);
    
    ctx.globalCompositeOperation = 'source-over';
  }
  
  return new CanvasTexture(canvas);
};

export const CardModel: React.FC<CardModelProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities,
  materialSettings = {
    roughness: 0.2,
    metalness: 0.8,
    reflectivity: 0.5,
    clearcoat: 0.7,
    envMapIntensity: 1.0
  }
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const frontTexture = useLoader(TextureLoader, card.imageUrl || '/placeholder-card.png');
  const backTexture = useMemo(() => createCardBackTexture(), []);
  const galaxyTexture = useMemo(() => createGalaxyTexture(), []);
  
  // Map preset effect IDs to base effects
  const getBaseEffect = (effectId: string): string => {
    const effectMap: Record<string, string> = {
      'vintage_classic': 'vintage',
      'cosmic_rare': 'galaxy',
      'premium_foil': 'foil',
      'holographic': 'holographic'
    };
    return effectMap[effectId] || effectId;
  };

  // Enhanced materials based on effects
  const frontMaterial = useMemo(() => {
    const baseConfig = {
      map: frontTexture,
      roughness: materialSettings.roughness,
      metalness: materialSettings.metalness,
      envMapIntensity: materialSettings.envMapIntensity,
      clearcoat: materialSettings.clearcoat,
      clearcoatRoughness: 0.1,
    };

    // Get the first active effect and map it to base effect
    const firstEffect = activeEffects[0];
    if (!firstEffect) {
      return new THREE.MeshPhysicalMaterial(baseConfig);
    }

    const baseEffect = getBaseEffect(firstEffect);
    const intensity = effectIntensities[firstEffect] || 0.7;

    console.log('CardModel: Applying effect', { firstEffect, baseEffect, intensity });

    if (baseEffect === 'galaxy') {
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        map: frontTexture,
        emissiveMap: galaxyTexture,
        emissive: new THREE.Color(0x1a0033),
        emissiveIntensity: intensity * 0.4,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 2.0 * intensity,
        iridescence: 0.6 * intensity,
        iridescenceIOR: 1.4,
        iridescenceThicknessRange: [300, 1000],
      });
    }
    
    if (baseEffect === 'holographic') {
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        metalness: 0.9 * intensity,
        roughness: 0.05,
        iridescence: 1.0 * intensity,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [100, 800],
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
      });
    }
    
    if (baseEffect === 'chrome') {
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        metalness: 1.0,
        roughness: 0.02,
        envMapIntensity: 4.0 * intensity,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
      });
    }
    
    if (baseEffect === 'foil') {
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        metalness: 0.95 * intensity,
        roughness: 0.15,
        envMapIntensity: 2.5 * intensity,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        color: new THREE.Color(0xffd700), // Gold tint for foil
      });
    }
    
    if (baseEffect === 'refractor') {
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        metalness: 0.7,
        roughness: 0.2,
        transmission: 0.1 * intensity,
        thickness: 0.5,
        envMapIntensity: 1.8 * intensity,
      });
    }
    
    if (baseEffect === 'prismatic') {
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        metalness: 0.8,
        roughness: 0.1,
        iridescence: 0.8 * intensity,
        iridescenceIOR: 1.5,
        iridescenceThicknessRange: [200, 1000],
        transmission: 0.05,
        envMapIntensity: 2.2 * intensity,
      });
    }
    
    if (baseEffect === 'vintage') {
      const vintageMaterial = new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        roughness: 0.8,
        metalness: 0.1,
        envMapIntensity: 0.3,
      });
      
      // Apply sepia tone effect with aging
      const sepiaIntensity = intensity;
      vintageMaterial.color.setHSL(0.08, 0.4 * sepiaIntensity, 0.85 - sepiaIntensity * 0.3);
      return vintageMaterial;
    }
    
    if (baseEffect === 'neon') {
      return new THREE.MeshPhysicalMaterial({
        ...baseConfig,
        emissive: new THREE.Color(0x00ffff),
        emissiveIntensity: intensity * 0.3,
        metalness: 0.5,
        roughness: 0.3,
        envMapIntensity: 1.5,
      });
    }
    
    return new THREE.MeshPhysicalMaterial(baseConfig);
  }, [frontTexture, activeEffects, effectIntensities, materialSettings, galaxyTexture]);

  const backMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.3,
      metalness: 0.7,
      envMapIntensity: 1.2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });
  }, [backTexture]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth rotation animation
    const targetRotationY = isFlipped ? Math.PI : 0;
    if (Math.abs(groupRef.current.rotation.y - targetRotationY) > 0.01) {
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.12;
    }
    
    // Enhanced floating animation
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.6) * 0.03;
    groupRef.current.rotation.z = Math.sin(time * 0.4) * 0.008;
    
    // Effect-specific animations
    const firstEffect = activeEffects[0];
    const baseEffect = firstEffect ? getBaseEffect(firstEffect) : '';
    
    if (baseEffect === 'neon') {
      const pulse = Math.sin(time * 4) * 0.5 + 0.5;
      if (frontMaterial instanceof THREE.MeshPhysicalMaterial) {
        const intensity = effectIntensities[firstEffect] || 0.5;
        frontMaterial.emissiveIntensity = intensity * 0.3 * (0.8 + pulse * 0.4);
      }
    }
    
    if (baseEffect === 'galaxy') {
      // Subtle rotation for galaxy effect
      if (frontMaterial instanceof THREE.MeshPhysicalMaterial && frontMaterial.emissiveMap) {
        frontMaterial.emissiveMap.offset.x = Math.sin(time * 0.1) * 0.05;
        frontMaterial.emissiveMap.offset.y = Math.cos(time * 0.08) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Card Front */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={frontMaterial} />
      </mesh>
      
      {/* Card Back */}
      <mesh position={[0, 0, -0.02]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} />
      </mesh>
      
      {/* Card edges for thickness */}
      <mesh position={[1.25, 0, -0.01]}>
        <planeGeometry args={[0.02, 3.5]} />
        <meshPhysicalMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[-1.25, 0, -0.01]}>
        <planeGeometry args={[0.02, 3.5]} />
        <meshPhysicalMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.75, -0.01]}>
        <planeGeometry args={[2.5, 0.02]} />
        <meshPhysicalMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, -1.75, -0.01]}>
        <planeGeometry args={[2.5, 0.02]} />
        <meshPhysicalMaterial color="#2a2a2a" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
};

export default CardModel;
