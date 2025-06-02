
import React, { useMemo, useEffect, useState } from 'react';
import { Environment } from '@react-three/drei';
import { hdrImageCache } from '@/services/hdrImageCache';
import * as THREE from 'three';

interface EnvironmentRendererProps {
  environmentType: string;
  lightingSettings?: any;
}

const EnvironmentRenderer: React.FC<EnvironmentRendererProps> = ({ 
  environmentType, 
  lightingSettings 
}) => {
  const [hdrTexture, setHdrTexture] = useState<THREE.DataTexture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Environment intensity configuration based on environment type
  const environmentConfig = useMemo(() => {
    switch (environmentType) {
      case 'studio':
        return { intensity: 1.0, background: true };
      case 'gallery':
        return { intensity: 0.8, background: true };
      case 'stadium':
        return { intensity: 1.2, background: true };
      case 'twilight':
        return { intensity: 0.7, background: true };
      case 'quarry':
        return { intensity: 0.9, background: true };
      case 'coastline':
        return { intensity: 1.1, background: true };
      case 'hillside':
        return { intensity: 0.8, background: true };
      case 'milkyway':
        return { intensity: 0.4, background: true };
      case 'esplanade':
        return { intensity: 1.0, background: true };
      case 'neonclub':
        return { intensity: 0.6, background: true };
      case 'industrial':
        return { intensity: 0.7, background: true };
      default:
        return { intensity: 1.0, background: true };
    }
  }, [environmentType]);

  // Apply lighting settings intensity multiplier
  const finalIntensity = useMemo(() => {
    const baseIntensity = environmentConfig.intensity;
    const lightingMultiplier = lightingSettings?.envMapIntensity || 1.0;
    return baseIntensity * lightingMultiplier;
  }, [environmentConfig.intensity, lightingSettings?.envMapIntensity]);

  // Load HDR texture
  useEffect(() => {
    setIsLoading(true);
    setHdrTexture(null);

    const loadEnvironment = async () => {
      try {
        console.log(`EnvironmentRenderer: Loading environment ${environmentType}`);
        
        const texture = await hdrImageCache.getTexture(environmentType);
        
        if (texture) {
          console.log(`EnvironmentRenderer: Successfully loaded HDR texture for ${environmentType}`);
          
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.needsUpdate = true;
          texture.magFilter = THREE.LinearFilter;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.generateMipmaps = true;
          
          setHdrTexture(texture);
        } else {
          console.warn(`EnvironmentRenderer: Failed to load ${environmentType}`);
        }
      } catch (error) {
        console.error(`EnvironmentRenderer: Error loading ${environmentType}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEnvironment();
  }, [environmentType]);

  return (
    <>
      {/* Use HDR texture if available, otherwise fallback to basic presets */}
      {hdrTexture && !isLoading ? (
        <Environment 
          map={hdrTexture}
          background={environmentConfig.background}
          environmentIntensity={finalIntensity}
        />
      ) : (
        <Environment 
          preset={environmentType === 'milkyway' ? 'night' : 
                 environmentType === 'twilight' ? 'sunset' : 'studio'}
          background={environmentConfig.background}
          environmentIntensity={finalIntensity}
        />
      )}
    </>
  );
};

export default EnvironmentRenderer;
