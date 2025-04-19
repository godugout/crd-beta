
import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Card } from '@/lib/types';
import CardModel from './CardModel';
import { Environment } from '@react-three/drei';
import { mapLightingPresetToEnvironment } from '@/utils/environmentPresets';
import { FALLBACK_FRONT_IMAGE_URL, FALLBACK_BACK_IMAGE_URL, handleImageLoadError } from '@/lib/utils/cardDefaults';

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
    const mappedPreset = mapLightingPresetToEnvironment(lightingPreset);
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
    
  const cardImageUrl = card.imageUrl || FALLBACK_FRONT_IMAGE_URL;
  const cardBackImageUrl = card.backImageUrl || FALLBACK_BACK_IMAGE_URL;

  return (
    <group ref={groupRef} {...shadowProps}>
      <CardModel
        imageUrl={cardImageUrl}
        backImageUrl={cardBackImageUrl}
        isFlipped={isFlipped}
        activeEffects={activeEffects} 
        effectIntensities={effectIntensities}
      />
      
      <Environment 
        preset={environmentPreset as any} 
        background={false}
      />
    </group>
  );
};

export default Card3DRenderer;
