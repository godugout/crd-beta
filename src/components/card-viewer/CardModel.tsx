
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Card } from '@/lib/types/cardTypes';
import { useTexture } from '@react-three/drei';

interface CardModelProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
}

export const CardModel: React.FC<CardModelProps> = ({ 
  card,
  isFlipped,
  activeEffects,
  effectIntensities
}) => {
  const cardRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  
  // Standard card dimensions (aspect ratio: 2.5 x 3.5)
  const cardWidth = 2.5;
  const cardHeight = 3.5;
  const cardThickness = 0.02;
  
  // Load textures
  // Use placeholders if the card doesn't have images
  const frontImageUrl = card.imageUrl || '/placeholders/card-front.jpg';
  // Use same image for back if backImageUrl doesn't exist
  const backImageUrl = card.imageUrl || '/placeholders/card-back.jpg';
  
  // Load textures with error handling
  let frontTexture;
  let backTexture;
  
  try {
    frontTexture = useTexture(frontImageUrl);
    backTexture = useTexture(backImageUrl);
  } catch (error) {
    console.error("Error loading textures:", error);
    // We'll handle this in the render by checking if textures exist
  }
  
  // Create holographic effect material for better visual appeal
  const holographicMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.3,
      side: THREE.FrontSide
    });
  }, []);
  
  // Create refractor material
  const refractorMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.2,
      side: THREE.FrontSide,
      transmission: 0.5
    });
  }, []);

  // Handle animations and effects updates
  useFrame((state, delta) => {
    if (!cardRef.current) return;
    
    // Flip animation
    const targetRotationY = isFlipped ? Math.PI : 0;
    
    // Smooth animation
    cardRef.current.rotation.y += (targetRotationY - cardRef.current.rotation.y) * 0.1;
    
    // Add subtle floating animation if not flipped
    if (!isFlipped) {
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
      cardRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
    
    // Update holographic effect if active
    if (activeEffects.includes('holographic') || activeEffects.includes('Holographic')) {
      // Find holographic overlay mesh
      cardRef.current.children.forEach((child) => {
        if (child.userData.type === 'holographic') {
          // Add type checking to ensure it's a Mesh with material
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhysicalMaterial) {
            const material = child.material;
            
            // Dynamic color shifts based on viewing angle and time
            const intensity = effectIntensities['holographic'] || effectIntensities['Holographic'] || 1.0;
            const time = state.clock.elapsedTime;
            
            // Create rainbow effect with hue rotation
            const hue = (time * 0.1) % 1.0;
            const color = new THREE.Color();
            color.setHSL(hue, 0.8, 0.5);
            
            material.color = color;
            material.emissive = color;
            material.emissiveIntensity = 0.2 * intensity;
            material.opacity = 0.2 * intensity + Math.sin(time * 2) * 0.05;
            
            // Simulate viewing angle effect
            const viewAngle = Math.sin(time * 0.5) * 0.5 + 0.5;
            material.clearcoatRoughness = 0.1 + viewAngle * 0.2;
            material.roughness = 0.1 + viewAngle * 0.3;
            
            // Make rainbow pattern shift with time
            child.rotation.z = Math.sin(time * 0.2) * 0.02;
          }
        }
      });
    }
    
    // Update refractor effect if active
    if (activeEffects.includes('refractor') || activeEffects.includes('Refractor')) {
      // Find refractor overlay mesh
      cardRef.current.children.forEach((child) => {
        if (child.userData.type === 'refractor') {
          // Add type checking to ensure it's a Mesh with material
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhysicalMaterial) {
            const material = child.material;
            const intensity = effectIntensities['refractor'] || effectIntensities['Refractor'] || 1.0;
            const time = state.clock.elapsedTime;
            
            // Subtle color shifts
            const hue = ((Math.sin(time * 0.3) * 0.1) + 0.6) % 1.0; // Blue-ish range
            const color = new THREE.Color();
            color.setHSL(hue, 0.7, 0.6);
            
            material.color = color;
            material.opacity = 0.15 * intensity + Math.sin(time * 1.5) * 0.05;
          }
        }
      });
    }
  });

  // Progressive enhancement: enable higher quality rendering on desktop
  useEffect(() => {
    // Check if we're on a powerful device
    const isHighPerformance = gl.capabilities.getMaxAnisotropy() > 8;
    
    if (isHighPerformance) {
      // Enable higher quality settings
      gl.setPixelRatio(window.devicePixelRatio);
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      
      // Improve texture quality if textures exist
      if (frontTexture) frontTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
      if (backTexture) backTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
    } else {
      // Lower quality for mobile/low-end devices
      gl.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
      gl.shadowMap.type = THREE.BasicShadowMap;
    }
  }, [gl, frontTexture, backTexture]);

  return (
    <group ref={cardRef}>
      {/* Card body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[cardWidth, cardHeight, cardThickness]} />
        
        {/* Front face */}
        <meshPhysicalMaterial 
          map={frontTexture}
          color={frontTexture ? undefined : "#2a5298"}
          metalness={0.2}
          roughness={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          attach="material-0"
        />
        
        {/* Back face */}
        <meshPhysicalMaterial 
          map={backTexture}
          color={backTexture ? undefined : "#1a3060"}
          metalness={0.2}
          roughness={0.4}
          attach="material-1"
        />
        
        {/* Edge materials */}
        <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.6} attach="material-2" />
        <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.6} attach="material-3" />
        <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.6} attach="material-4" />
        <meshStandardMaterial color="#f0f0f0" metalness={0.3} roughness={0.6} attach="material-5" />
      </mesh>
      
      {/* Holographic effect overlay */}
      {(activeEffects.includes('holographic') || activeEffects.includes('Holographic')) && (
        <mesh 
          position={[0, 0, cardThickness/2 + 0.005]} 
          userData={{ type: 'holographic' }}
        >
          <planeGeometry args={[cardWidth - 0.05, cardHeight - 0.05, 30, 30]} />
          <meshPhysicalMaterial 
            color={new THREE.Color(0x88ccff)}
            metalness={0.9}
            roughness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transparent={true}
            opacity={0.3 * (effectIntensities['holographic'] || effectIntensities['Holographic'] || 1.0)}
            side={THREE.FrontSide}
            emissive={new THREE.Color(0x88ccff)}
            emissiveIntensity={0.2}
            envMapIntensity={2}
          />
        </mesh>
      )}
      
      {/* Refractor effect overlay */}
      {(activeEffects.includes('refractor') || activeEffects.includes('Refractor')) && (
        <mesh 
          position={[0, 0, cardThickness/2 + 0.01]} 
          userData={{ type: 'refractor' }}
        >
          <planeGeometry args={[cardWidth - 0.1, cardHeight - 0.1, 20, 20]} />
          <meshPhysicalMaterial 
            color={new THREE.Color(0x88ccff)}
            metalness={0.7}
            roughness={0.3}
            transparent={true}
            opacity={0.15 * (effectIntensities['refractor'] || effectIntensities['Refractor'] || 1.0)}
            side={THREE.FrontSide}
            transmission={0.5}
          />
        </mesh>
      )}
      
      {/* Gold Foil effect overlay */}
      {(activeEffects.includes('Gold Foil') || activeEffects.includes('gold foil')) && (
        <mesh 
          position={[0, 0, cardThickness/2 + 0.015]} 
          userData={{ type: 'goldfoil' }}
        >
          <planeGeometry args={[cardWidth - 0.15, cardHeight - 0.15, 15, 15]} />
          <meshPhysicalMaterial 
            color={new THREE.Color(0xffd700)}
            metalness={1.0}
            roughness={0.2}
            transparent={true}
            opacity={0.4 * (effectIntensities['Gold Foil'] || effectIntensities['gold foil'] || 1.0)}
            side={THREE.FrontSide}
            clearcoat={0.8}
          />
        </mesh>
      )}
      
      {/* Chrome effect overlay */}
      {(activeEffects.includes('Chrome') || activeEffects.includes('chrome')) && (
        <mesh 
          position={[0, 0, cardThickness/2 + 0.02]} 
          userData={{ type: 'chrome' }}
        >
          <planeGeometry args={[cardWidth - 0.08, cardHeight - 0.08, 20, 20]} />
          <meshPhysicalMaterial 
            color={new THREE.Color(0xffffff)}
            metalness={1.0}
            roughness={0.05}
            transparent={true}
            opacity={0.3 * (effectIntensities['Chrome'] || effectIntensities['chrome'] || 1.0)}
            side={THREE.FrontSide}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            envMapIntensity={3}
          />
        </mesh>
      )}
    </group>
  );
};

export default CardModel;
