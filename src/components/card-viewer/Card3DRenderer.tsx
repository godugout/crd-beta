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

// Helper function to map our custom lighting presets to valid @react-three/drei environment presets
const mapToValidEnvironmentPreset = (
  preset: string
): "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse" => {
  const validPresetMap = {
    studio: "studio",
    natural: "park",
    dramatic: "night", 
    display_case: "lobby"
  } as const;
  
  return (validPresetMap[preset as keyof typeof validPresetMap] || "studio") as 
    "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse";
};

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

  // Update the default card material to have a more realistic matte printing appearance
  const createDefaultMaterial = (texture: THREE.Texture | null, isBack: boolean = false) => {
    return new THREE.MeshPhysicalMaterial({
      map: texture,
      color: texture ? undefined : (isBack ? "#1a3060" : "#2a5298"),
      metalness: 0.1, // Lower metalness for matte look
      roughness: 0.7, // Higher roughness for matte finish
      clearcoat: 0.3, // Subtle clearcoat for print finish
      clearcoatRoughness: 0.8, // High roughness in clearcoat
      envMapIntensity: 0.5, // Subtle environment reflections
      flatShading: false,
      // Add subtle normal mapping for paper texture
      normalScale: new THREE.Vector2(0.05, 0.05)
    });
  };

  // Update holographic effect to be more subtle and realistic
  const createHolographicMaterial = (intensity: number = 1.0) => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 0.9,
      roughness: 0.2,
      transmission: 0.1,
      thickness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.15 * intensity,
      side: THREE.FrontSide,
      envMapIntensity: 2
    });
  };

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
    
    // Update holographic effect if active
    if (activeEffects.includes('Holographic')) {
      cardRef.current.children.forEach(child => {
        if (child.userData.effectType === 'holographic' && child instanceof THREE.Mesh) {
          if (child.material instanceof THREE.MeshPhysicalMaterial) {
            const intensity = effectIntensities['Holographic'] || 1.0;
            const time = state.clock.getElapsedTime();
            
            // Create more subtle color shifts
            const hue = ((Math.sin(time * 0.2) * 0.1) + 0.5) % 1.0;
            const color = new THREE.Color();
            color.setHSL(hue, 0.5, 0.6);
            
            // Apply subtle modifications
            child.material.color = color;
            child.material.emissive = color.clone().multiplyScalar(0.2);
            child.material.emissiveIntensity = 0.1 + Math.sin(time * 1.5) * 0.05;
            child.material.opacity = 0.15 * intensity * (0.8 + Math.sin(time * 0.5) * 0.2);
            
            // Create subtle wave pattern
            if (child.geometry instanceof THREE.PlaneGeometry) {
              const positions = child.geometry.attributes.position;
              for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const waveX = Math.sin(x * 3 + time * 0.5) * 0.002 * intensity;
                const waveY = Math.cos(y * 3 + time * 0.5) * 0.002 * intensity;
                positions.setZ(i, waveX + waveY);
              }
              positions.needsUpdate = true;
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
    // Extract environmentType from card if it exists, otherwise use 'studio'
    const environmentType = (card as any).environmentType || 'studio';
    
    // Map to a valid preset that @react-three/drei supports
    return mapToValidEnvironmentPreset(environmentType);
  };

  return (
    <group ref={cardRef}>
      <Environment 
        preset={getEnvironmentPreset()} 
        background={false} 
      />
      
      {/* Card front */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[2.5, 3.5, 32, 32]} />
        <primitive object={createDefaultMaterial(frontTexture)} attach="material" />
      </mesh>
      
      {/* Card back */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5, 32, 32]} />
        <primitive object={createDefaultMaterial(backTexture, true)} attach="material" />
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
