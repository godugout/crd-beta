
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/lib/types';

interface ImmersiveCardProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  materialSettings?: any;
  lightingSettings?: {
    primaryLight: {
      intensity: number;
      color: string;
      x: number;
      y: number;
      z: number;
    };
    ambientLight: {
      intensity: number;
      color: string;
    };
    envMapIntensity: number;
    followPointer: boolean;
  };
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
  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Load card texture with fallback
  const cardTexture = useTexture(
    card.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    (texture) => {
      texture.flipY = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    }
  );

  // Handle pointer following
  useEffect(() => {
    if (!lightingSettings?.followPointer) return;

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [lightingSettings?.followPointer]);

  // Animate card based on mouse position and lighting settings
  useFrame((state) => {
    if (!meshRef.current) return;

    // Gentle floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;

    // Mouse-following rotation if enabled
    if (lightingSettings?.followPointer) {
      meshRef.current.rotation.x = mousePosition.y * 0.3;
      meshRef.current.rotation.y = mousePosition.x * 0.3;
    } else if (!hovered) {
      // Gentle auto-rotation when not being interacted with
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }

    // Flip animation
    if (isFlipped) {
      meshRef.current.rotation.y = Math.PI + (meshRef.current.rotation.y % (Math.PI * 2));
    }
  });

  // Calculate material properties based on lighting and effects
  const getMaterialProps = () => {
    const baseProps = {
      map: cardTexture,
      roughness: materialSettings?.roughness || 0.1,
      metalness: materialSettings?.metalness || 0.2,
      envMapIntensity: lightingSettings?.envMapIntensity || 1.0,
    };

    // Enhance properties based on active effects
    if (activeEffects.includes('Chrome')) {
      baseProps.metalness = 0.9;
      baseProps.roughness = 0.1;
    }

    if (activeEffects.includes('Holographic')) {
      baseProps.envMapIntensity = 2.0;
      baseProps.roughness = 0.0;
    }

    if (activeEffects.includes('Refractor')) {
      baseProps.envMapIntensity = 1.5;
      baseProps.roughness = 0.05;
    }

    return baseProps;
  };

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
      receiveShadow
      castShadow
    >
      <planeGeometry args={[2.5, 3.5]} />
      <meshStandardMaterial
        {...getMaterialProps()}
        transparent
        side={THREE.DoubleSide}
      />
      
      {/* Add subtle rim lighting for card edges */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.52, 3.52]} />
        <meshBasicMaterial 
          color={lightingSettings?.primaryLight.color || '#ffffff'}
          transparent
          opacity={0.1}
        />
      </mesh>
    </mesh>
  );
};

export default ImmersiveCard;
