
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
  qualityLevel?: 'high' | 'medium' | 'low';
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
  onRenderFrame,
  qualityLevel = 'medium'
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frameCount = useRef(0);
  const [environmentPreset, setEnvironmentPreset] = useState('studio');
  const skipFrameCount = useRef(0);
  
  // Map custom lighting preset to valid environment preset
  useEffect(() => {
    const mappedPreset = mapLightingPresetToEnvironment(lightingPreset);
    setEnvironmentPreset(mappedPreset);
  }, [lightingPreset]);
  
  // Optimized frame updates with dynamic frame skipping based on quality level
  useFrame((state) => {
    // Update render stats callback
    if (onRenderFrame) {
      onRenderFrame();
    }
    
    // Throttle animations based on quality level
    const skipFrames = qualityLevel === 'high' ? 0 : qualityLevel === 'medium' ? 1 : 3;
    skipFrameCount.current = (skipFrameCount.current + 1) % (skipFrames + 1);
    if (skipFrameCount.current !== 0) return;
    
    // Add subtle floating animation to the card
    if (groupRef.current && !isFlipped) {
      const time = state.clock.getElapsedTime() * 0.3;
      groupRef.current.position.y = Math.sin(time) * 0.05;
      groupRef.current.rotation.z = Math.sin(time * 0.7) * 0.02;
    }

    // Smooth card flip animation
    if (groupRef.current) {
      const targetRotation = isFlipped ? Math.PI : 0;
      const currentRotation = groupRef.current.rotation.y;
      
      // Use faster lerp for low quality mode
      const lerpFactor = qualityLevel === 'low' ? 0.2 : 0.1;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        currentRotation,
        targetRotation,
        lerpFactor
      );
    }
  });
  
  // Skip rendering specific effects based on quality level
  const filteredEffects = activeEffects.filter(effect => {
    // In low quality mode, remove performance-heavy effects
    if (qualityLevel === 'low') {
      if (['Spectral', 'Pulsar', 'Mojo'].includes(effect)) {
        return false;
      }
    }
    return true;
  });

  return (
    <group ref={groupRef}>
      <CardModel
        imageUrl={card.imageUrl || '/placeholder-card.jpg'}
        backImageUrl={card.backImageUrl || '/card-back-texture.jpg'}
        isFlipped={isFlipped}
        activeEffects={filteredEffects} 
        effectIntensities={effectIntensities}
        qualityLevel={qualityLevel}
      />
      
      {/* Environment provides lighting - using mapped preset */}
      <Environment 
        preset={environmentPreset as any} 
        background={false}
        resolution={qualityLevel === 'high' ? 256 : qualityLevel === 'medium' ? 128 : 64}
      />
    </group>
  );
};

export default Card3DRenderer;
