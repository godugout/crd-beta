
import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Card } from '@/lib/types';
import CardModel from './CardModel';
import { Environment } from '@react-three/drei';
import { mapLightingPresetToEnvironment } from '@/utils/environmentPresets';

interface Card3DRendererProps {
  card: Card;
  isFlipped: boolean;
  activeEffects: string[];
  effectIntensities?: Record<string, number>;
  lightingPreset?: string;
  onRenderFrame?: () => void;
}

/**
 * Optimized 3D Card Renderer with performance improvements
 */
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
  
  // Map custom lighting preset to valid environment preset
  useEffect(() => {
    const mappedPreset = mapLightingPresetToEnvironment(lightingPreset);
    setEnvironmentPreset(mappedPreset);
  }, [lightingPreset]);
  
  // Optimized frame updates - only run certain operations every N frames
  useFrame(() => {
    frameCount.current = (frameCount.current + 1) % 5;
    
    // Only update every 5th frame to reduce CPU load
    if (frameCount.current === 0 && onRenderFrame) {
      onRenderFrame();
    }
  });
  
  // Determine if we need 3D effects or if CSS effects are sufficient
  const needs3DEffects = activeEffects.some(effect => 
    ['Holographic', 'Shimmer', 'Refractor'].includes(effect)
  );
  
  // Use a simpler shadow setup when possible
  const shadowProps = needs3DEffects 
    ? { castShadow: true, receiveShadow: true } 
    : {};

  // Check for card back image or use default
  const backImageUrl = card.backImageUrl || '/card-back-texture.jpg';
  
  return (
    <group ref={groupRef} {...shadowProps}>
      <CardModel
        imageUrl={card.imageUrl || '/placeholder-card.jpg'}
        backImageUrl={backImageUrl}
        isFlipped={isFlipped}
        activeEffects={activeEffects} 
        effectIntensities={effectIntensities}
      />
      
      {/* Environment provides lighting - using mapped preset */}
      <Environment preset={environmentPreset as any} background={false} />
    </group>
  );
};

export default Card3DRenderer;
