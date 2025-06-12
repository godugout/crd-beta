
import React from 'react';
import * as THREE from 'three';
import { OaklandTemplate } from '@/lib/types/oaklandTemplates';
import BaseballCardBorder from './BaseballCardBorder';
import CardEffectsLayer from './CardEffectsLayer';
import CardTextOverlays from './components/CardTextOverlays';
import CardEdges from './components/CardEdges';
import { useCardTextures } from './hooks/useCardTextures';
import { useCardMaterials } from './components/CardMaterials';
import { useAdvancedCardControls } from './hooks/useAdvancedCardControls';

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
  sidebarOpen?: boolean;
}

const OaklandCard3DModel: React.FC<OaklandCard3DModelProps> = ({
  template,
  memoryData,
  cardFinish,
  autoRotate,
  viewMode,
  showEffects = true,
  showBorder = true,
  borderStyle = 'classic',
  sidebarOpen = false
}) => {
  // Card dimensions - smaller for better viewport fit
  const cardSize = { width: 2.0, height: 2.8, depth: 0.02 };

  // Load textures
  const { cardTexture, backTexture } = useCardTextures(template.thumbnailUrl);

  // Create materials
  const { frontMaterial, backMaterial } = useCardMaterials({
    cardTexture,
    backTexture,
    cardFinish
  });

  // Advanced card controls
  const {
    groupRef,
    controls,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useAdvancedCardControls({ sidebarOpen });

  // Apply random design color scheme if available (only for effects, not base template)
  const colorScheme = (memoryData as any)?.colorScheme;
  const svgOverlays = (memoryData as any)?.svgOverlays || [];
  const canvasEffects = (memoryData as any)?.canvasEffects || [];

  // Oakland A's team colors
  const teamColors = {
    primary: colorScheme?.primary || '#003831',
    secondary: colorScheme?.secondary || '#EFB21E'
  };

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]}
      onPointerDown={handleMouseDown}
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Traditional Baseball Card Border */}
      {showBorder && (
        <BaseballCardBorder
          borderStyle={borderStyle}
          teamColors={teamColors}
          cardSize={cardSize}
        />
      )}

      {/* Card Front - Show template clearly */}
      <mesh castShadow receiveShadow>
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
