
import React, { useRef } from 'react';
import * as THREE from 'three';
import { Card } from '@/lib/types';
import { useCardTextures } from './CardTextures';
import { useCardMaterials } from './CardMaterials';
import { useCardInteractions } from './CardInteractions';
import { useCardAnimations } from './CardAnimations';
import CardMesh from './CardMesh';

interface ImmersiveCardProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities: Record<string, number>;
  materialSettings: any;
  lightingSettings: any;
  onFlip?: () => void;
}

const ImmersiveCard: React.FC<ImmersiveCardProps> = ({
  card,
  isFlipped,
  activeEffects,
  effectIntensities,
  materialSettings,
  lightingSettings,
  onFlip
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Load textures
  const { frontTexture, backTexture } = useCardTextures({ card });

  // Create materials
  const { frontMaterial, backMaterial } = useCardMaterials({
    frontTexture,
    backTexture,
    activeEffects,
    effectIntensities,
    materialSettings,
    lightingSettings
  });

  // Handle interactions
  const { handleCardClick } = useCardInteractions({ onFlip });

  // Handle animations
  useCardAnimations({
    groupRef,
    isFlipped,
    lightingSettings
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <CardMesh
        frontMaterial={frontMaterial}
        backMaterial={backMaterial}
        onCardClick={handleCardClick}
      />
    </group>
  );
};

export default ImmersiveCard;
