import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';

interface OaklandCard3DModelProps {
  template: OaklandTemplate;
  memoryData: {
    title: string;
    subtitle: string;
    description: string;
    player?: string;
    date?: string;
    tags: string[];
  };
  cardFinish: 'matte' | 'glossy' | 'foil';
  autoRotate: boolean;
  viewMode: '3d' | '2d';
}

const OaklandCard3DModel: React.FC<OaklandCard3DModelProps> = ({
  template,
  memoryData,
  cardFinish,
  autoRotate,
  viewMode
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);

  // Load card textures
  const cardTexture = useLoader(TextureLoader, template.thumbnailUrl);
  const backTexture = useLoader(TextureLoader, '/lovable-uploads/f1b608ba-b8c6-40f5-b552-a5d7addbf4ae.png');

  // Apply random design color scheme if available
  const colorScheme = (memoryData as any)?.colorScheme;
  const svgOverlays = (memoryData as any)?.svgOverlays || [];
  const canvasEffects = (memoryData as any)?.canvasEffects || [];

  // Create materials based on card finish and color scheme
  const frontMaterial = useMemo(() => {
    const baseProps = {
      map: cardTexture,
      side: THREE.FrontSide,
    };

    // Apply color scheme if available
    if (colorScheme) {
      const colorTint = new THREE.Color(colorScheme.primary);
      baseProps.map.offset.set(0, 0);
      baseProps.map.repeat.set(1, 1);
    }

    switch (cardFinish) {
      case 'matte':
        return new THREE.MeshLambertMaterial({
          ...baseProps,
          color: colorScheme?.background || '#ffffff'
        });
      
      case 'foil':
        return new THREE.MeshPhysicalMaterial({
          ...baseProps,
          metalness: 0.1,
          roughness: 0.3,
          envMapIntensity: 1.0,
          clearcoat: 0.4,
          clearcoatRoughness: 0.2,
          iridescence: 0.4,
          iridescenceIOR: 1.1,
          iridescenceThicknessRange: [100, 300],
          transmission: 0.05,
          opacity: 0.92,
          transparent: true,
          color: colorScheme?.accent || '#ffffff'
        });
      
      case 'glossy':
      default:
        return new THREE.MeshPhysicalMaterial({
          ...baseProps,
          metalness: 0.02,
          roughness: 0.15,
          envMapIntensity: 0.8,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
          reflectivity: 0.5,
          transparent: true,
          opacity: 0.98,
          color: colorScheme?.background || '#ffffff'
        });
    }
  }, [cardTexture, cardFinish, colorScheme]);

  const backMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: backTexture,
      metalness: 0.1,
      roughness: 0.4,
      envMapIntensity: 0.8,
      clearcoat: 0.6,
      clearcoatRoughness: 0.4,
      side: THREE.BackSide,
    });
  }, [backTexture]);

  const edgeMaterial = useMemo(() => {
    // Oakland A's themed edge color
    const edgeColor = template.category === 'protest' ? '#DC2626' : '#EFB21E';
    
    return new THREE.MeshPhysicalMaterial({
      color: edgeColor,
      metalness: 0.6,
      roughness: 0.3,
      envMapIntensity: 0.8,
    });
  }, [template.category]);

  // Enhanced animation loop with random design effects
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.5;
    }

    if (viewMode === '2d') {
      // In 2D mode, keep card flat
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;
      if (!autoRotate) {
        groupRef.current.rotation.y = 0;
      }
    } else {
      // 3D mode with subtle floating animation
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.02;
    }

    // Enhanced foil effect with dynamic properties
    if (cardFinish === 'foil' && cardRef.current?.material) {
      const material = cardRef.current.material as THREE.MeshPhysicalMaterial;
      material.iridescenceThicknessRange = [
        100 + Math.sin(time * 1.5) * 30,
        300 + Math.cos(time * 1.2) * 50
      ];
    }

    // Apply canvas effects animation if they exist
    if (canvasEffects.length > 0) {
      canvasEffects.forEach((effect: any, index: number) => {
        if (effect.type === 'noise' && cardRef.current?.material) {
          const material = cardRef.current.material as THREE.MeshPhysicalMaterial;
          material.roughness = 0.15 + Math.sin(time * effect.settings.intensity * 2) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Card Front */}
      <mesh ref={cardRef} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={frontMaterial} />
      </mesh>

      {/* Card Back */}
      <mesh position={[0, 0, -0.02]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[2.5, 3.5]} />
        <primitive object={backMaterial} />
      </mesh>

      {/* SVG Overlays as 3D elements */}
      {svgOverlays.map((overlay: any, index: number) => (
        <mesh
          key={overlay.id}
          position={[
            (overlay.position.x - 0.5) * 2.4, // Convert 0-1 to card coordinates
            (0.5 - overlay.position.y) * 3.4, // Convert 0-1 to card coordinates, flip Y
            0.001 + index * 0.001 // Layer slightly above card
          ]}
          scale={[overlay.scale, overlay.scale, 1]}
        >
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial
            color={overlay.color}
            transparent
            opacity={overlay.opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Card Edges (3D thickness) */}
      {viewMode === '3d' && (
        <>
          {/* Top Edge */}
          <mesh position={[0, 1.75, -0.01]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <planeGeometry args={[2.5, 0.02]} />
            <primitive object={edgeMaterial} />
          </mesh>
          
          {/* Bottom Edge */}
          <mesh position={[0, -1.75, -0.01]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <planeGeometry args={[2.5, 0.02]} />
            <primitive object={edgeMaterial} />
          </mesh>
          
          {/* Left Edge */}
          <mesh position={[-1.25, 0, -0.01]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <planeGeometry args={[3.5, 0.02]} />
            <primitive object={edgeMaterial} />
          </mesh>
          
          {/* Right Edge */}
          <mesh position={[1.25, 0, -0.01]} rotation={[0, 0, -Math.PI / 2]} castShadow>
            <planeGeometry args={[3.5, 0.02]} />
            <primitive object={edgeMaterial} />
          </mesh>
        </>
      )}

      {/* Enhanced holographic overlay for special designs */}
      {(cardFinish === 'foil' || canvasEffects.some((e: any) => e.type === 'gradient')) && (
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[2.5, 3.5]} />
          <meshBasicMaterial
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          >
            <primitive 
              object={new THREE.Color().setHSL(
                (Date.now() * 0.0005) % 1, 
                0.3, 
                0.7
              )} 
              attach="color"
            />
          </meshBasicMaterial>
        </mesh>
      )}
    </group>
  );
};

export default OaklandCard3DModel;
