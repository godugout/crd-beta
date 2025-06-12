import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import BaseballCardBorder from './BaseballCardBorder';
import CardEffectsLayer from './CardEffectsLayer';
import CardTextOverlays from './components/CardTextOverlays';
import CardEdges from './components/CardEdges';
import { useCardTextures } from './hooks/useCardTextures';
import { useCardMaterials } from './components/CardMaterials';

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

  // Load textures
  const { cardTexture, backTexture } = useCardTextures(template.thumbnailUrl);

  // Create materials
  const { frontMaterial, backMaterial } = useCardMaterials({
    cardTexture,
    backTexture,
    cardFinish
  });

  // Apply random design color scheme if available (only for effects, not base template)
  const colorScheme = (memoryData as any)?.colorScheme;
  const svgOverlays = (memoryData as any)?.svgOverlays || [];
  const canvasEffects = (memoryData as any)?.canvasEffects || [];

  // Oakland A's team colors
  const teamColors = {
    primary: colorScheme?.primary || '#003831',
    secondary: colorScheme?.secondary || '#EFB21E'
  };

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

      {/* Text Overlays */}
      <CardTextOverlays memoryData={memoryData} teamColors={teamColors} />

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
      {!showBorder && (
        <CardEdges
          cardSize={cardSize}
          templateCategory={template.category}
          viewMode={viewMode}
        />
      )}
    </group>
  );
};

export default OaklandCard3DModel;
