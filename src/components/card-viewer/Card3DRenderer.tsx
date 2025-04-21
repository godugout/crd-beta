
import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Card } from '@/lib/types';
import CardModel from './CardModel';
import { Environment } from '@react-three/drei';
import { FALLBACK_FRONT_IMAGE_URL, FALLBACK_BACK_IMAGE_URL, safeNumber } from '@/lib/utils/cardDefaults';

// Helper function to get environment preset
const getEnvironmentPreset = (preset: string): string => {
  const validPresets = ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby'];
  return validPresets.includes(preset) ? preset : 'studio';
};

// Define the component props type
interface Card3DRendererProps {
  card: Card;
  isFlipped: boolean;
  activeEffects?: string[];
  effectIntensities?: Record<string, number>;
  lightingPreset?: string;
  onRenderFrame?: () => void;
}

const Card3DRenderer: React.FC<Card3DRendererProps> = ({
  card,
  isFlipped,
  activeEffects = [],
  effectIntensities = {},
  lightingPreset = 'studio',
  onRenderFrame
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frameCount = useRef(0);
  const [environmentPreset, setEnvironmentPreset] = useState('studio');
  
  useEffect(() => {
    const mappedPreset = getEnvironmentPreset(lightingPreset);
    setEnvironmentPreset(mappedPreset);
    console.log("Applied lighting preset:", lightingPreset, "mapped to:", mappedPreset);
  }, [lightingPreset]);
  
  useFrame(() => {
    frameCount.current = (frameCount.current + 1) % 5;
    
    if (frameCount.current === 0 && onRenderFrame) {
      onRenderFrame();
    }
    
    if (frameCount.current === 0 && activeEffects.length > 0) {
      console.log("Active effects:", activeEffects, "with intensities:", effectIntensities);
    }
  });
  
  const needs3DEffects = activeEffects.some(effect => 
    ['Holographic', 'Shimmer', 'Refractor'].includes(effect)
  );
  
  const shadowProps = needs3DEffects 
    ? { castShadow: true, receiveShadow: true } 
    : {};
    
  // Ensure we always have valid image URLs, falling back to guaranteed external URLs if needed
  const cardImageUrl = card.imageUrl || FALLBACK_FRONT_IMAGE_URL;
  const cardBackImageUrl = card.backImageUrl || FALLBACK_BACK_IMAGE_URL;
  
  // Map effect intensities to ensure they are all valid numbers
  const safeIntensities: Record<string, number> = {};
  if (effectIntensities) {
    Object.keys(effectIntensities).forEach(key => {
      safeIntensities[key] = safeNumber(effectIntensities[key], 0.7);
    });
  }

  return (
    <group ref={groupRef} {...shadowProps}>
      <CardModel
        imageUrl={cardImageUrl}
        backImageUrl={cardBackImageUrl}
        isFlipped={isFlipped}
        activeEffects={activeEffects} 
        effectIntensities={safeIntensities}
      />
      
      <Environment 
        preset={environmentPreset as any} 
        background={false}
      />
    </group>
  );
};

export default Card3DRenderer;
