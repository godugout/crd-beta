
import React from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
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
  // Card dimensions
  const cardSize = { width: 2.0, height: 2.8, depth: 0.02 };

  // Load textures with improved error handling
  const { cardTexture, backTexture, isLoading, error } = useCardTextures(template.thumbnailUrl);

  // Create materials only when textures are loaded
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
    isFlipping,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useAdvancedCardControls({ sidebarOpen });

  // Design colors
  const colorScheme = (memoryData as any)?.colorScheme;
  const teamColors = {
    primary: colorScheme?.primary || '#003831',
    secondary: colorScheme?.secondary || '#EFB21E'
  };

  // Show loading state
  if (isLoading || !cardTexture || !backTexture) {
    return (
      <group position={[0, 0, 0]}>
        <mesh>
          <planeGeometry args={[cardSize.width, cardSize.height]} />
          <meshStandardMaterial color="#333333" opacity={0.5} transparent />
        </mesh>
      </group>
    );
  }

  // Show error state
  if (error) {
    console.error('Card texture error:', error);
    return (
      <group position={[0, 0, 0]}>
        <mesh>
          <planeGeometry args={[cardSize.width, cardSize.height]} />
          <meshStandardMaterial color="#ff4444" opacity={0.7} transparent />
        </mesh>
      </group>
    );
  }

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 0]}
      onPointerDown={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        handlePointerDown({ point: { x: event.point.x, y: event.point.y } });
      }}
      onPointerMove={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        handlePointerMove({ point: { x: event.point.x, y: event.point.y } });
      }}
      onPointerUp={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        handlePointerUp();
      }}
    >
      {/* Baseball Card Border */}
      {showBorder && (
        <BaseballCardBorder
          borderStyle={borderStyle}
          teamColors={teamColors}
          cardSize={cardSize}
        />
      )}

      {/* Card Front */}
      <mesh 
        castShadow 
        receiveShadow
        onPointerEnter={() => {
          if (!isDragging && !isFlipping) document.body.style.cursor = 'grab';
        }}
        onPointerLeave={() => {
          if (!isDragging) document.body.style.cursor = 'default';
        }}
      >
        <planeGeometry args={[cardSize.width, cardSize.height]} />
        <primitive object={frontMaterial} />
      </mesh>

      {/* Card Back */}
      <mesh 
        position={[0, 0, -cardSize.depth]} 
        rotation={[0, Math.PI, 0]} 
        castShadow 
        receiveShadow
        onPointerEnter={() => {
          if (!isDragging && !isFlipping) document.body.style.cursor = 'grab';
        }}
        onPointerLeave={() => {
          if (!isDragging) document.body.style.cursor = 'default';
        }}
      >
        <planeGeometry args={[cardSize.width, cardSize.height]} />
        <primitive object={backMaterial} />
      </mesh>

      {/* Text Overlays */}
      <CardTextOverlays memoryData={memoryData} teamColors={teamColors} />

      {/* Effects Layer */}
      {showEffects && (
        <CardEffectsLayer
          showEffects={showEffects}
          svgOverlays={[]}
          canvasEffects={[]}
          cardFinish={cardFinish}
          cardSize={cardSize}
        />
      )}

      {/* Card Edges */}
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
