import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import BaseballCardBorder from './BaseballCardBorder';
import CardEffectsLayer from './CardEffectsLayer';

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
  showEffects?: boolean;
  showBorder?: boolean;
  borderStyle?: 'classic' | 'vintage' | 'modern';
}

const OaklandCard3DModel: React.FC<OaklandCard3DModelProps> = ({
  template,
  memoryData,
  cardFinish,
  autoRotate,
  viewMode,
  showEffects = true,
  showBorder = true,
  borderStyle = 'classic'
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);

  // Card dimensions
  const cardSize = { width: 2.5, height: 3.5, depth: 0.02 };

  // Load card textures with proper error handling
  const cardTexture = useLoader(
    TextureLoader, 
    template.thumbnailUrl, 
    (texture) => {
      console.log('Template texture loaded successfully:', template.name);
      texture.flipY = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    },
    (error) => {
      console.warn('Failed to load template texture:', template.name, error);
    }
  );
  
  const backTexture = useLoader(
    TextureLoader, 
    '/lovable-uploads/f1b608ba-b8c6-40f5-b552-a5d7addbf4ae.png',
    (texture) => {
      texture.flipY = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
    },
    (error) => {
      console.warn('Failed to load back texture:', error);
    }
  );

  // Apply random design color scheme if available (only for effects, not base template)
  const colorScheme = (memoryData as any)?.colorScheme;
  const svgOverlays = (memoryData as any)?.svgOverlays || [];
  const canvasEffects = (memoryData as any)?.canvasEffects || [];

  // Oakland A's team colors
  const teamColors = {
    primary: colorScheme?.primary || '#003831',
    secondary: colorScheme?.secondary || '#EFB21E'
  };

  // Create materials based on card finish - DON'T TINT THE BASE TEMPLATE
  const frontMaterial = useMemo(() => {
    const baseProps = {
      map: cardTexture,
      side: THREE.FrontSide,
    };

    switch (cardFinish) {
      case 'matte':
        return new THREE.MeshLambertMaterial({
          ...baseProps,
          // Don't tint the base template - let it show naturally
          color: '#ffffff'
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
          // Keep base template white, effects will add color
          color: '#ffffff'
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
          // Keep base template white, effects will add color
          color: '#ffffff'
        });
    }
  }, [cardTexture, cardFinish]);

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

  // Enhanced animation loop
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
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Traditional Baseball Card Border */}
      {showBorder && (
        <BaseballCardBorder
          borderStyle={borderStyle}
          teamColors={teamColors}
          cardSize={cardSize}
        />
      )}

      {/* Card Front - Show template clearly */}
      <mesh ref={cardRef} castShadow receiveShadow>
        <planeGeometry args={[cardSize.width, cardSize.height]} />
        <primitive object={frontMaterial} />
      </mesh>

      {/* Card Back */}
      <mesh position={[0, 0, -cardSize.depth]} rotation={[0, Math.PI, 0]} castShadow receiveShadow>
        <planeGeometry args={[cardSize.width, cardSize.height]} />
        <primitive object={backMaterial} />
      </mesh>

      {/* Text Overlays - positioned clearly visible */}
      <Text
        position={[0, 1.4, 0.01]}
        fontSize={0.18}
        color={teamColors.primary}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
        maxWidth={2.2}
      >
        {memoryData.title}
      </Text>

      <Text
        position={[0, 1.1, 0.01]}
        fontSize={0.11}
        color={teamColors.secondary}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-medium.woff"
        maxWidth={2.2}
      >
        {memoryData.subtitle}
      </Text>

      {memoryData.player && (
        <Text
          position={[0, -1.0, 0.01]}
          fontSize={0.14}
          color={teamColors.primary}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
          maxWidth={2.2}
        >
          {memoryData.player}
        </Text>
      )}

      {memoryData.date && (
        <Text
          position={[0, -1.3, 0.01]}
          fontSize={0.09}
          color="#666666"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-regular.woff"
          maxWidth={2.2}
        >
          {new Date(memoryData.date).toLocaleDateString()}
        </Text>
      )}

      {/* Decorative Effects Layer - only show when effects are enabled */}
      {showEffects && (
        <CardEffectsLayer
          showEffects={showEffects}
          svgOverlays={svgOverlays}
          canvasEffects={canvasEffects}
          cardFinish={cardFinish}
          cardSize={cardSize}
        />
      )}

      {/* Simple Card Edges (when border is disabled) */}
      {!showBorder && viewMode === '3d' && (
        <>
          {/* Top Edge */}
          <mesh position={[0, cardSize.height / 2, -cardSize.depth / 2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <planeGeometry args={[cardSize.width, cardSize.depth]} />
            <meshPhysicalMaterial
              color={template.category === 'protest' ? '#DC2626' : '#EFB21E'}
              metalness={0.6}
              roughness={0.3}
              envMapIntensity={0.8}
            />
          </mesh>
          
          {/* Bottom Edge */}
          <mesh position={[0, -cardSize.height / 2, -cardSize.depth / 2]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <planeGeometry args={[cardSize.width, cardSize.depth]} />
            <meshPhysicalMaterial
              color={template.category === 'protest' ? '#DC2626' : '#EFB21E'}
              metalness={0.6}
              roughness={0.3}
              envMapIntensity={0.8}
            />
          </mesh>
          
          {/* Left Edge */}
          <mesh position={[-cardSize.width / 2, 0, -cardSize.depth / 2]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <planeGeometry args={[cardSize.height, cardSize.depth]} />
            <meshPhysicalMaterial
              color={template.category === 'protest' ? '#DC2626' : '#EFB21E'}
              metalness={0.6}
              roughness={0.3}
              envMapIntensity={0.8}
            />
          </mesh>
          
          {/* Right Edge */}
          <mesh position={[cardSize.width / 2, 0, -cardSize.depth / 2]} rotation={[0, 0, -Math.PI / 2]} castShadow>
            <planeGeometry args={[cardSize.height, cardSize.depth]} />
            <meshPhysicalMaterial
              color={template.category === 'protest' ? '#DC2626' : '#EFB21E'}
              metalness={0.6}
              roughness={0.3}
              envMapIntensity={0.8}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

export default OaklandCard3DModel;
